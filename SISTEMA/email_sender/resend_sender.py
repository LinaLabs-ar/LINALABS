"""
LINALABS — RESEND EMAIL SENDER
Envio automatico de cold email via API de Resend (resend.com)
Fuente: Google Sheets (hoja "Campana Cold Email")
Correr: python resend_sender.py
"""

import json
import os
import time
import urllib.request
import urllib.error
from datetime import datetime
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request, AuthorizedSession
import gspread

# ============================================================
# CONFIGURACION
# ============================================================
# Lee desde env var (GitHub Actions) o desde archivo local .env
def _leer_api_key():
    key = os.environ.get("RESEND_API_KEY", "")
    if not key:
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
        if os.path.exists(env_path):
            for line in open(env_path, encoding='utf-8'):
                if line.startswith('RESEND_API_KEY='):
                    key = line.strip().split('=', 1)[1]
    return key

RESEND_API_KEY  = _leer_api_key()
FROM_EMAIL      = "contacto@envios.linalabs.ar"
FROM_NAME       = "Mario Barbieri | LinaLabs"
REPLY_TO_EMAIL  = "hello@linalabs.ar"
DAILY_LIMIT     = 10     # subir a 40 despues de 7 dias sin problemas
DELAY_SECONDS   = 8

SHEET_ID        = '10H6MHncLWQ8oPS9gSqyBrT3ZhD3sPjRPRzLMfhzftS4'
SHEET_NAME      = 'Campana Cold Email'
_BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE    = os.environ.get('GOOGLE_SHEETS_TOKEN_PATH',
                    os.path.join(_BASE_DIR, '..', 'token_sheets.json'))
TEMPLATES_DIR = os.path.join(_BASE_DIR, '..', 'email_templates')
LOG_FILE      = os.path.join(_BASE_DIR, 'enviados.json')

SCOPES = ['https://www.googleapis.com/auth/drive']  # drive es suficiente para leer/escribir Sheets

# Columnas en el Sheets (1-indexed para gspread)
COL_EMAIL      = 5   # E
COL_RUBRO      = 2   # B
COL_NOMBRE     = 3   # C
COL_INSTITUCION= 4   # D
COL_ESTADO     = 11  # K
COL_FECHA      = 12  # L


# ============================================================
# CONEXION A GOOGLE SHEETS
# ============================================================
def conectar_sheets():
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    gc = gspread.Client(auth=creds)
    gc.session = AuthorizedSession(creds)
    sh = gc.open_by_key(SHEET_ID)
    return sh.worksheet(SHEET_NAME)


# ============================================================
# TEMPLATES
# ============================================================
def _leer_template(nombre):
    with open(os.path.join(TEMPLATES_DIR, nombre), encoding='utf-8') as f:
        return f.read()

def get_template(rubro, nombre):
    if rubro == 'Automotriz':
        html = _leer_template('cold_automotriz.html')
        return html.replace('{{NOMBRE}}', nombre or 'Hola'), "Una propuesta que puede interesarte"
    elif rubro == 'Idiomas':
        return _leer_template('cold_idiomas.html'), "Una propuesta de interes para su institucion"
    elif rubro == 'Colegio':
        return _leer_template('cold_colegios.html'), "Una propuesta de interes para su institucion"
    else:
        # Intenta cargar template especifico del rubro (ej: cold_gimnasios.html)
        nombre_archivo = f"cold_{rubro.lower().replace(' ', '_')}.html"
        try:
            return _leer_template(nombre_archivo), "Una propuesta de interes para su empresa"
        except FileNotFoundError:
            # Fallback al template generico de colegios
            return _leer_template('cold_colegios.html'), "Una propuesta de interes para su empresa"


# ============================================================
# ENVIO VIA RESEND
# ============================================================
def enviar_mail(email, asunto, cuerpo, reply_to=REPLY_TO_EMAIL):
    body = {
        "from": f"{FROM_NAME} <{FROM_EMAIL}>",
        "to": [email],
        "subject": asunto,
        "html": cuerpo,
    }
    if reply_to:
        body["reply_to"] = reply_to
    payload = json.dumps(body).encode('utf-8')
    req = urllib.request.Request("https://api.resend.com/emails", data=payload, method='POST')
    req.add_header('Authorization', f'Bearer {RESEND_API_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('User-Agent', 'python-resend/1.0')
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return True, resp.read().decode()
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode()}"
    except Exception as ex:
        return False, str(ex)


# ============================================================
# BACKUP LOCAL
# ============================================================
def guardar_backup(email, nombre, inst, rubro, asunto):
    log = {}
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, encoding='utf-8') as f:
            log = json.load(f)
    log[email] = {"nombre": nombre, "institucion": inst, "rubro": rubro,
                  "fecha": datetime.now().isoformat(), "asunto": asunto}
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(log, f, ensure_ascii=False, indent=2)


# ============================================================
# PROGRAMA PRINCIPAL
# ============================================================
def main():
    print("=" * 55)
    print("  LINALABS - CAMPANA COLD EMAIL (Resend + Sheets)")
    print("=" * 55)

    print("  Conectando a Google Sheets...")
    ws = conectar_sheets()

    # Leer todos los datos (incluye header en fila 1)
    all_rows = ws.get_all_values()
    header   = all_rows[0]
    data     = all_rows[1:]  # filas reales, index 0 = fila 2 del Sheets

    hoy = datetime.now().strftime('%Y-%m-%d')

    # Contar enviados hoy (FECHA_ENVIO = hoy)
    enviados_hoy = sum(1 for r in data if len(r) >= COL_FECHA and r[COL_FECHA-1].startswith(hoy))
    total_enviados = sum(1 for r in data if len(r) >= COL_ESTADO and r[COL_ESTADO-1] == 'Enviado')
    pendientes = [
        (i, r) for i, r in enumerate(data)
        if len(r) < COL_ESTADO or r[COL_ESTADO-1] != 'Enviado'
    ]

    quedan_hoy = DAILY_LIMIT - enviados_hoy

    print(f"  Enviados hoy: {enviados_hoy}/{DAILY_LIMIT}")
    print(f"  Total historico: {total_enviados}")
    print(f"  Pendientes: {len(pendientes)}")
    print()

    if quedan_hoy <= 0:
        print(f"Limite diario alcanzado ({DAILY_LIMIT}). Volvé mañana.")
        return

    enviados_sesion = 0
    enviados_sesion_lista = []

    for idx, row in pendientes:
        if enviados_sesion >= quedan_hoy:
            break

        email  = row[COL_EMAIL-1].strip().lower()      if len(row) >= COL_EMAIL       else ''
        rubro  = row[COL_RUBRO-1].strip()              if len(row) >= COL_RUBRO       else ''
        nombre = row[COL_NOMBRE-1].strip()             if len(row) >= COL_NOMBRE      else ''
        inst   = row[COL_INSTITUCION-1].strip()        if len(row) >= COL_INSTITUCION else ''

        if not email or '@' not in email:
            continue

        cuerpo, asunto = get_template(rubro, nombre)

        print(f"  [{enviados_sesion+1}/{quedan_hoy}] {email} ({rubro})... ", end='', flush=True)
        ok, resp = enviar_mail(email, asunto, cuerpo)

        if ok:
            # Backup local primero (no depende de red)
            guardar_backup(email, nombre, inst, rubro, asunto)
            enviados_sesion += 1
            enviados_sesion_lista.append({'nombre': nombre, 'institucion': inst, 'rubro': rubro})
            print("OK")

            # Actualizar Sheets (no critico si falla)
            try:
                fila_sheets = idx + 2
                fecha_str = datetime.now().strftime('%Y-%m-%d')
                ws.update_cell(fila_sheets, COL_ESTADO, 'Enviado')
                ws.update_cell(fila_sheets, COL_FECHA,  fecha_str)
            except Exception as e_sheets:
                print(f'  [AVISO] No se pudo actualizar Sheets para {email}: {e_sheets}')

            time.sleep(DELAY_SECONDS)
        else:
            print(f"ERROR: {resp[:100]}")

    pendientes_restantes = len(pendientes) - enviados_sesion

    print()
    print(f"Sesion terminada: {enviados_sesion} mails enviados.")
    print(f"Total historico: {total_enviados + enviados_sesion}")
    print(f"Pendientes restantes: {pendientes_restantes}")

    # Resumen a hello@linalabs.ar
    if enviados_sesion > 0:
        hoy_str = datetime.now().strftime('%d/%m/%Y')
        filas = ''.join([
            f"<tr><td style='padding:4px 8px;border-bottom:1px solid #eee;font-size:13px;'>{v['nombre'] or '-'}</td>"
            f"<td style='padding:4px 8px;border-bottom:1px solid #eee;font-size:13px;'>{v['institucion'] or '-'}</td>"
            f"<td style='padding:4px 8px;border-bottom:1px solid #eee;font-size:13px;color:#555;'>{v['rubro']}</td></tr>"
            for v in enviados_sesion_lista
        ])
        dias = (pendientes_restantes + DAILY_LIMIT - 1) // DAILY_LIMIT if pendientes_restantes > 0 else 0
        resumen_html = f"""
        <div style="font-family:'Montserrat',Arial,sans-serif;max-width:580px;margin:0 auto;padding:20px;">
          <p style="font-size:22px;font-weight:900;letter-spacing:2px;text-transform:uppercase;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px;">LINALABS</p>
          <p style="font-size:15px;color:#1a1a1a;"><strong>Campana del {hoy_str} completada.</strong></p>
          <p style="font-size:14px;color:#333;">Se enviaron <strong>{enviados_sesion} mails</strong>. Las respuestas llegan a <strong>hello@linalabs.ar</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr style="background:#f5f5f5;">
              <th style="padding:6px 8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Nombre</th>
              <th style="padding:6px 8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Institucion</th>
              <th style="padding:6px 8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Rubro</th>
            </tr>
            {filas}
          </table>
          <p style="font-size:13px;color:#888;margin-top:20px;">Total historico: <strong>{total_enviados + enviados_sesion}</strong> enviados | Pendientes: <strong>{pendientes_restantes}</strong> | Dias restantes: <strong>{dias}</strong></p>
          <p style="font-size:12px;color:#aaa;margin-top:12px;">Ver campana completa: <a href="https://docs.google.com/spreadsheets/d/{SHEET_ID}">Google Sheets</a></p>
        </div>
        """
        print(f"Enviando resumen a {REPLY_TO_EMAIL}...")
        ok_r, resp_r = enviar_mail(REPLY_TO_EMAIL,
                              f"Campana LinaLabs - {enviados_sesion} mails enviados hoy ({hoy_str})",
                              resumen_html, reply_to=None)
        if ok_r:
            print(f"Resumen enviado OK a {REPLY_TO_EMAIL}")
        else:
            print(f"ERROR enviando resumen: {resp_r}")

if __name__ == "__main__":
    main()

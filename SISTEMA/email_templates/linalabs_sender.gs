// ============================================================
// LINALABS — COLD EMAIL SENDER
// Google Apps Script — pegar en Extensions > Apps Script
// ============================================================
// CONFIGURACIÓN
var REPLY_TO      = "hello@linalabs.ar";
var FROM_NAME     = "Mario Barbieri | LinaLabs";
var DAILY_LIMIT   = 40;
var SENT_COLUMN   = 7;   // columna G — marca "ENVIADO"
var EMAIL_COLUMN  = 3;   // columna C — email del contacto
var NAME_COLUMN   = 1;   // columna A — nombre (puede estar vacío)
var INST_COLUMN   = 2;   // columna B — institución/empresa

// ============================================================
// TEMPLATE — EDUCACIÓN (Colegios + Idiomas)
// Cambiar por el template de automotriz cuando corresponda
// ============================================================
function getTemplate(nombre, institucion, rubro) {
  var saludo = nombre ? "Buenos días, " + nombre + "," : "Buenos días,";

  var body = saludo + "\n\n" +
    "Gracias por tomarse un minuto para leer esto — voy a ser muy breve.\n\n" +
    "Mi nombre es Mario Barbieri, soy director de LinaLabs, un laboratorio creativo " +
    "especializado en comunicación institucional para colegios y organizaciones educativas.\n\n" +
    "En muchas instituciones educativas que visitamos pasa algo similar: el nivel es excelente, " +
    "pero la comunicación hacia afuera no lo refleja con la misma claridad. Hoy las familias " +
    "toman decisiones sobre dónde inscribir a sus hijos mirando la web y las redes antes de llamar " +
    "— y esa primera impresión define mucho.\n\n" +
    "Lo que hacemos en LinaLabs: nos encargamos de toda la comunicación visual e institucional " +
    "— identidad de marca, redes sociales activas, materiales de inscripción, comunicados para " +
    "familias, gestión de publicidad paga en Meta para atraer nuevas inscripciones — por un costo " +
    "mensual fijo. Contamos con creativos de distintas disciplinas: diseñadores, artistas plásticos, " +
    "muralistas, fotógrafos y videógrafos, para darle a la institución la impronta visual y tecnológica " +
    "que se merece. También trabajamos en Interim Management para instituciones que necesitan ordenar " +
    "su área de comunicación desde adentro.\n\n" +
    "¿Tendría sentido que hablemos 20 minutos esta semana? Sin ningún compromiso.\n\n" +
    "Saludos,\n" +
    "Mario Barbieri\n" +
    "LINALABS — Laboratorio Creativo\n" +
    "hello@linalabs.ar | linalabs.ar\n" +
    "+54 9 11 4028-1901\n\n" +
    "--\n" +
    "Si no desea recibir más mensajes de nuestra parte, responda con \"BAJA\" y lo eliminamos de inmediato.";

  return body;
}

// ============================================================
// FUNCIÓN PRINCIPAL — correr manualmente o con trigger diario
// ============================================================
function enviarCampana() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = sheet.getDataRange().getValues();
  var enviados = 0;
  var hoy = new Date().toLocaleDateString("es-AR");

  for (var i = 1; i < data.length; i++) {
    if (enviados >= DAILY_LIMIT) break;

    var fila     = data[i];
    var nombre   = fila[NAME_COLUMN - 1]   ? fila[NAME_COLUMN - 1].toString().trim()   : "";
    var inst     = fila[INST_COLUMN - 1]   ? fila[INST_COLUMN - 1].toString().trim()   : "";
    var email    = fila[EMAIL_COLUMN - 1]  ? fila[EMAIL_COLUMN - 1].toString().trim()  : "";
    var estado   = fila[SENT_COLUMN - 1]   ? fila[SENT_COLUMN - 1].toString().trim()   : "";

    // Saltar si ya fue enviado o no tiene email
    if (!email || estado === "ENVIADO") continue;

    try {
      var asunto  = "Una propuesta de interés para su institución";
      var cuerpo  = getTemplate(nombre, inst, "educacion");

      GmailApp.sendEmail(email, asunto, cuerpo, {
        name:    FROM_NAME,
        replyTo: REPLY_TO,
      });

      // Marcar como enviado en columna G
      sheet.getRange(i + 1, SENT_COLUMN).setValue("ENVIADO " + hoy);
      enviados++;

      // Pausa 3 segundos entre mails para no gatillar filtros
      Utilities.sleep(3000);

    } catch(e) {
      sheet.getRange(i + 1, SENT_COLUMN).setValue("ERROR: " + e.message);
    }
  }

  SpreadsheetApp.getUi().alert("✅ Campaña enviada: " + enviados + " mails hoy.\nResponstas llegan a: " + REPLY_TO);
}

// ============================================================
// AGREGAR MENÚ PERSONALIZADO EN SHEETS
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📧 LinaLabs Campaña")
    .addItem("Enviar " + DAILY_LIMIT + " mails de hoy", "enviarCampana")
    .addItem("Ver cuántos faltan", "verEstado")
    .addToUi();
}

function verEstado() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = sheet.getDataRange().getValues();
  var total = 0, enviados = 0, pendientes = 0;

  for (var i = 1; i < data.length; i++) {
    var email  = data[i][EMAIL_COLUMN - 1];
    var estado = data[i][SENT_COLUMN - 1] ? data[i][SENT_COLUMN - 1].toString() : "";
    if (!email) continue;
    total++;
    if (estado.indexOf("ENVIADO") !== -1) enviados++;
    else pendientes++;
  }

  SpreadsheetApp.getUi().alert(
    "📊 Estado de campaña\n\n" +
    "Total contactos: " + total + "\n" +
    "Enviados: " + enviados + "\n" +
    "Pendientes: " + pendientes + "\n" +
    "Días restantes (40/día): " + Math.ceil(pendientes / DAILY_LIMIT)
  );
}

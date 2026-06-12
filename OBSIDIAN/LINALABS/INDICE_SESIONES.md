# 📚 Índice de Sesiones — LinaLabs

## 🚨 ALERTA URGENTE

**[[ALERT_TOKEN_RENEWAL_JUNE12|Token expirando en 24 horas (12 de Junio)]]**
- Documentación: [[TOKEN_RENEWAL_URGENT_JUNE2026]]
- Acción: Renovar token Netlify o activar GitHub Actions
- Tiempo: ~5 minutos

---

## Sesiones Registradas

### 2026-06-11 — GitHub Actions + Auto-Deploy Setup ⭐ ÚLTIMA

**[[SESIONES/2026-06-11 - GitHub Actions + Auto-Deploy Final|Ver sesión completa]]**

**Resumen:**
- ✅ GitHub Actions workflow configurado (auto-deploy)
- ✅ Org LinaLabs-ar + repo LINALABS creados
- ✅ Secrets GitHub configurados (NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID)
- ✅ **AUTO_DEPLOY.bat creado** - Usuario solo hace double-click
- ✅ Script sin intervención manual - cero git knowledge required
- ✅ Deploy automático en cada ejecución del script

**Duración:** ~3 horas  
**Status:** Completado exitosamente

**Herramienta Clave:**
- `AUTO_DEPLOY.bat`: Script ejecutable que automáticamente detecta cambios, hace commit, push, y dispara GitHub Actions

**Cómo Usar:**
1. Edita archivos en `SISTEMA/web/`
2. Doble-click en `AUTO_DEPLOY.bat`
3. Espera 1-2 minutos
4. Sitio actualizado en https://linalabs.ar

**Status Final:**
- 🟢 Sitio web 100% operativo
- 🟢 GitHub Actions deployando automáticamente
- 🟢 Auto-deploy sin manual git commands
- 🟢 Token Netlify funcionando (nfp_DbwX...)

---

### 2026-06-11 — Institutos de Idiomas + Arquitectura Universal Campaña

**[[SESIONES/2026-06-11 - Institutos de Idiomas CABA|Ver sesión completa]]**

**Resumen:**
- ✅ Nueva hoja "Institutos de Idiomas" creada y **expandida a 142 institutos** (batches 1–15, todos los barrios de CABA)
- ✅ Base de datos migrada a Google Sheets online
- ✅ Sistema de cold email conectado al Sheets — enviados se marcan en tiempo real
- ✅ **`sync_campana.py`** — sync universal multi-rubro (cualquier hoja nueva entra automáticamente)
- ✅ **Pestaña ENVIADOS** en primera posición — verde, visible de inmediato (Sheets + Excel)
- ✅ **Campaña expandida: 622 → 1.219** (Colegios Privados CABA incorporados al pipeline)
- ✅ `resend_sender.py` actualizado con fallback dinámico de templates por rubro

**Duración:** ~5 horas + 2 sesiones de continuación  
**Status:** Completado exitosamente

**Google Sheets activo:**
- URL: https://docs.google.com/spreadsheets/d/10H6MHncLWQ8oPS9gSqyBrT3ZhD3sPjRPRzLMfhzftS4
- 6 hojas: **ENVIADOS** (46) + Colegios (796) + Resumen + Lista de Mails + Idiomas (142) + Campaña (1.219)
- Institutos CABA: **ALTO: 66 | MEDIO: 15 | BAJO: 61**
- Estado campaña: **46 enviados / 1.173 pendientes / ~118 días a 10/día**
- Rubros: Colegio (730) | Automotriz (427) | Idiomas (62)

---

### 2026-06-10 — Deploy & Netlify Token

**[[SESIONES/2026-06-10 - Deploy & Netlify Token|Ver sesión completa]]**

**Resumen:**
- ✅ Problema de token Netlify diagnosticado
- ✅ GitHub Actions workflow creado
- ✅ Documentación técnica completada
- ✅ Scripts de automatización listos
- 🟢 Sitio web 100% operativo

**Duración:** ~2 horas  
**Status:** Completado exitosamente

**Archivos Creados:**
- DIAGNOSTICO_TOKEN.md
- SOLUCION_TOKEN.md
- STATUS_DEPLOY_2026.md
- SETUP_GITHUB_ACTIONS.md
- setup-github-deploy.sh
- .github/workflows/deploy-netlify.yml
- ESTADO_DEPLOY_WEB.md (Obsidian)
- README_SISTEMA.md (Obsidian)

**Documentos en Obsidian:**
- [[SESIONES/2026-06-10 - Deploy & Netlify Token]] (completo)
- [[SISTEMA/ESTADO_DEPLOY_WEB]] (resumen)
- [[SISTEMA/README_SISTEMA]] (índice)

**Credenciales Actualizadas:**
- Token Netlify PAT confirmado: ✅ nfp_DbwX...
- Site ID documentado: f7f238cd-2cea-40fb-89bf-4c876f7cf6a7

---

## Próximas Sesiones Recomendadas

### 📅 Diciembre 2026 — Revisar Estado
- Verificar si token sigue siendo válido
- Revisar logs de deploy
- Evaluar activar GitHub Actions si es necesario

### 📅 Marzo 2027 — Si Token Falla
- Renovar token Netlify
- O activar GitHub Actions workflow
- Actualizar documentación

---

## 🔗 Accesos Rápidos

### Base de Prospección Online
- [Google Sheets](https://docs.google.com/spreadsheets/d/10H6MHncLWQ8oPS9gSqyBrT3ZhD3sPjRPRzLMfhzftS4) — 6 hojas, 1.219 prospectos en campaña
- [Drive LinaLabs](https://drive.google.com/drive/folders/1oJyZNplFc94DhDsP9F9zkThJ0K-flR4F) — carpeta raíz en la nube
- [[SISTEMA/GOOGLE_SHEETS_INTEGRACION]] — doc técnico completo

### Cold Email
- [[SISTEMA/COLD_EMAIL/00 - Estado Cold Email]] — estado y progreso
- [[5_PROCESOS/Estrategia Cold Email 2026]]

### Desarrollo Web
- [[SISTEMA/ESTADO_DEPLOY_WEB]] - Estado actual del sitio
- [[SISTEMA/DIAGNOSTICO_TOKEN]] - Análisis técnico
- [[SISTEMA/SETUP_GITHUB_ACTIONS]] - Guía de GitHub Actions

### Credenciales
- [[SISTEMA/CREDENCIALES Y API KEYS]] ⚠️ Confidencial

### Referencias Generales
- [[_QUE_ES_LINALABS]] - Contexto general
- [[SISTEMA/README_SISTEMA]] - Índice técnico

---

## 📊 Estadísticas de Sesiones

| Período | Sesiones | Status |
|---------|----------|--------|
| Junio 2026 | 3 (Cold Email + Deploy + Idiomas + Google Sheets) | ✅ Completadas |
| **Total** | **3** | ✅ Documentadas |

---

## 🎯 Notas Generales

- Todas las sesiones están documentadas en Obsidian
- Credenciales guardadas en archivo confidencial
- Código en repositorio Git con commits descriptivos
- GitHub Actions listo para activar cuando sea necesario

---

**Última actualización:** 11 de Junio de 2026 (sesión de arquitectura universal)  
**Próxima revisión:** Agregar nuevo rubro / revisar respuestas de campana

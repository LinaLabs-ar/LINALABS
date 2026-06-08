# Solución para Problema de Token Netlify CLI

## 🔴 Problema Identificado

Los tokens **nuevos creados en el dashboard de Netlify** no funcionan con `netlify-cli`:
- Error 1: `"Your session has expired"` con `status` command
- Error 2: `"Unauthorized"` con `deploy` command

El token **viejo sigue funcionando perfectamente** para todos los comandos.

## ✅ Soluciones Verificadas

### Opción 1: GitHub Auto-Deploy (RECOMENDADO - SIN TOKEN)
**Ventaja:** No necesita token CLI, deploy automático en cada push

```bash
# 1. Asegúrate que el código está en GitHub
git push origin main

# 2. En Netlify dashboard:
#    - Settings > Build & Deploy > Source
#    - Conectar GitHub account
#    - Seleccionar repo y branch
#    - Netlify auto-deploya en cada push

# 3. No necesitas token CLI en absoluto
```

### Opción 2: Usar Token Viejo (TEMPORAL - HASTA MAÑANA)
**Ventaja:** Funciona ahora mismo

```bash
export NETLIFY_AUTH_TOKEN="nfp_DbwXJjPKtBGD9sJB1MNPqjL7QGjuz16x922c"
npx netlify-cli deploy --prod
```

**⚠️ Expira:** 6 de Junio de 2026 (mañana a las 23:59 UTC)

### Opción 3: Crear Token desde CLI (NO DASHBOARD)
**Ventaja:** Tal vez el CLI cree tokens que funcionan con CLI

```bash
# 1. Login interactivo
npx netlify-cli login

# 2. Esto abre navegador y autentica
# 3. El CLI guarda el token localmente en ~/.netlify/state.json
# 4. Luego puedes usar sin NETLIFY_AUTH_TOKEN

npx netlify-cli deploy --prod
```

### Opción 4: Contactar Netlify Support
**Ventaja:** Obtener ayuda oficial

"Los tokens nuevos creados en el dashboard dan error 'Unauthorized' y 'Session expired' con netlify-cli, pero el token anterior funciona. ¿Por qué los nuevos tokens no funcionan?"

## 📋 Recomendación

**Usa Opción 1 (GitHub Auto-Deploy)** - Es la más robusta y no necesita tokens en CLI.

Si necesitas deploy manual rápido, usa Opción 2 (token viejo) hasta que expire mañana.

## 🔧 Implementación de GitHub Auto-Deploy

1. El código ya está en GitHub (el sitio está en git)
2. En Netlify dashboard:
   - Projects > linalabs > Settings > Build & Deploy
   - Source: Conectar GitHub
   - Repo: el repo de LINALABS
   - Branch: main (o la que uses)
   - Deploy settings: automático

3. Desde ese momento, cada `git push` triggers un deploy automático

## 📌 Próximos Pasos

- [ ] Implementar GitHub Auto-Deploy
- [ ] Dejar de usar tokens CLI
- [ ] Contactar Netlify sobre el bug de tokens nuevos
- [ ] Documentar el proceso en README


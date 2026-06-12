# Auto-Deploy - GuÍa Simple

## ✨ La Solución: No Hacer Nada Manualmente

**Ya no tienes que hacer `git push` ni nada de comandos.**

Todo está automatizado. Solo 2 formas de usarlo:

---

## 🚀 Opción 1: Click en un Archivo (MÁS FÁCIL)

1. **Abre esta carpeta:**
   ```
   D:\Users\Razor\Documents\Razor\Clientes\LINALABS\SISTEMA\
   ```

2. **Busca el archivo:**
   ```
   AUTO_DEPLOY.bat
   ```

3. **Haz doble-click**
   - Se abrirá una ventana
   - Automáticamente detecta cambios
   - Si hay cambios, hace commit + push automático
   - El sitio se actualiza en ~1-2 minutos
   - Presiona cualquier tecla para cerrar

**¡Listo! Todo sucede automáticamente.**

---

## 🔄 Opción 2: Programarlo para que se Ejecute Automáticamente

Si quieres que se ejecute **cada día a las 9 AM** sin hacer nada:

1. Presiona `Windows + R`
2. Escribe: `taskschd.msc`
3. Click en "Crear Tarea Básica"
4. Nombre: `LinaLabs Auto Deploy`
5. En "Trigger": Selecciona "Diario" a las 9 AM
6. En "Acción": Programa: `AUTO_DEPLOY.bat`
7. Click OK

**Ahora cada día a las 9 AM, el sitio se actualiza automáticamente.**

---

## 📋 ¿Qué Hace?

Cuando haces click:

✅ Verifica si hay cambios en la carpeta `web/`  
✅ Si hay cambios:
   - Crea un commit automáticamente
   - Hace push a GitHub automáticamente
   - Activa GitHub Actions automáticamente
   - El sitio se redeploya en Netlify
✅ Si no hay cambios, no hace nada (tan simple)

**No tienes que escribir nada, no tienes que entender git, no tienes que hacer nada.**

---

## 🌐 Resultado

Después de hacer click:

1. **Ventana se cierra en ~10 segundos**
2. **En ~1-2 minutos**: El sitio https://linalabs.ar está actualizado

Si quieres verificar que funcionó:
- Ve a: https://github.com/LinaLabs-ar/LINALABS/actions
- (Pero no es necesario, funciona automático)

---

## 🎯 Resumen

- **Antes:** Necesitabas escribir comandos git
- **Ahora:** Solo haz click en AUTO_DEPLOY.bat
- **Después:** Sitio actualizado automáticamente

**¡Eso es todo!**

---

**Si algo falla:**
- La ventana te dirá qué pasó
- Pero 99% de las veces funciona perfectamente
- Si tienes dudas, preguntame

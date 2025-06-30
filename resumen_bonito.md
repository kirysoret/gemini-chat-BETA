# ✨ Gemini Chat - Funcionalidades principales

## 🤖 Comando IA `!bh`
- Responde usando **Gemini AI** (modelo gemini-2.0-flash) con la respuesta generada por la IA.
- Si el mensaje es respuesta a otro mensaje, usa ese contenido como prompt.
- Si no, usa el texto después de `!bh` como prompt.
- _Ejemplo:_ `!bh ¿cómo estás?` o responder a un mensaje con `!bh`.

---

## 🗂️ Gestión avanzada de memorias
- Cada usuario puede tener **múltiples memorias** y backups.
- Las memorias y backups se guardan en carpetas separadas por ID de usuario.
- Cada memoria tiene historial y reglas personalizadas.

### 📋 Comandos de memoria
- `!deletebh` — Elimina la memoria actual. Si hay más de una, activa otra existente. Si solo queda una, crea una nueva vacía.
- `!restbh` — Muestra una lista de backups disponibles y permite restaurar una memoria.
- `!restbh [nombre]` — Restaura el backup seleccionado y lo activa.
- `!renamebh [nuevo_nombre]` — Cambia el nombre de la memoria actual.
- `!createbh [nombre]` — Crea una nueva memoria y la activa.
- `!toglebh [nombre]` — Cambia la memoria activa a la seleccionada.
- `!listbh` — Muestra la lista de memorias guardadas.
- `!backupdeletebh [nombre]` — Elimina permanentemente una memoria del backup, con confirmación por reacción (✅ para confirmar, ❌ para cancelar).
- `!revisememorybh` — Revisa todas las memorias y crea backups faltantes automáticamente.

---

## ⚙️ Reglas y personalización
- Cada usuario puede agregar reglas personalizadas a su memoria con `!rg bh`.
- Siempre existe la regla: _"Siempre responde en español a menos que el mensaje esté en otro idioma."_
- Todas las reglas se guardan en la sección **reglas** de la memoria.

---

## 📢 Canal de alertas configurable
- Usa `!chanelalerts #canal` o `!chanelalerts <ID>` para seleccionar el canal donde el bot enviará el resumen y las actualizaciones.
- La configuración se guarda en una subcarpeta por servidor dentro de la carpeta `alertchanel`.

---

## 🌍 Idioma configurable por servidor
- Al unirse a un servidor, el bot pregunta el idioma con un embed bonito.
- Usa `!language [idioma]` para seleccionar el idioma del servidor. El bot adapta la regla y el resumen a ese idioma.
- El idioma y la regla se guardan en la carpeta `serverconfig/<guildId>/rules.json`.

---

## 📝 Regla meta
- Todo cambio o nueva funcionalidad implementada debe ser registrada en el archivo `resumen.dm`. 
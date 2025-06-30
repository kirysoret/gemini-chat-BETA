const resumenBonito = `# ✨ Gemini Chat - Funcionalidades principales\n\n## 🤖 Comando IA !bh\n- Responde usando **Gemini AI** (modelo gemini-2.0-flash) con la respuesta generada por la IA.\n- Si el mensaje es respuesta a otro mensaje, usa ese contenido como prompt.\n- Si no, usa el texto después de !bh como prompt.\n- _Ejemplo:_ !bh ¿cómo estás? o responder a un mensaje con !bh.\n\n---\n\n## 🗂️ Gestión avanzada de memorias\n- Cada usuario puede tener **múltiples memorias** y backups.\n- Las memorias y backups se guardan en carpetas separadas por ID de usuario.\n- Cada memoria tiene historial y reglas personalizadas.\n\n### 📋 Comandos de memoria\n- !deletebh — Elimina la memoria actual. Si hay más de una, activa otra existente. Si solo queda una, crea una nueva vacía.\n- !restbh — Muestra una lista de backups disponibles y permite restaurar una memoria.\n- !restbh [nombre] — Restaura el backup seleccionado y lo activa.\n- !renamebh [nuevo_nombre] — Cambia el nombre de la memoria actual.\n- !createbh [nombre] — Crea una nueva memoria y la activa.\n- !toglebh [nombre] — Cambia la memoria activa a la seleccionada.\n- !listbh — Muestra la lista de memorias guardadas.\n- !backupdeletebh [nombre] — Elimina permanentemente una memoria del backup, con confirmación por reacción (✅ para confirmar, ❌ para cancelar).\n- !revisememorybh — Revisa todas las memorias y crea backups faltantes automáticamente.\n\n---\n\n## ⚙️ Reglas y personalización\n- Cada usuario puede agregar reglas personalizadas a su memoria con !rg bh.\n- Siempre existe la regla: _"Siempre responde en español a menos que el mensaje esté en otro idioma."_\n- Todas las reglas se guardan en la sección **reglas** de la memoria.\n\n---\n\n## 📢 Canal de alertas configurable\n- Usa !chanelalerts #canal o !chanelalerts <ID> para seleccionar el canal donde el bot enviará el resumen y las actualizaciones.\n- La configuración se guarda en una subcarpeta por servidor dentro de la carpeta alertchanel.\n\n---\n\n## 🌍 Idioma configurable por servidor\n- Al unirse a un servidor, el bot pregunta el idioma con un embed bonito.\n- Usa !language [idioma] para seleccionar el idioma del servidor. El bot adapta la regla y el resumen a ese idioma.\n- El idioma y la regla se guardan en la carpeta serverconfig/<guildId>/rules.json.\n\n---\n\n## 📝 Regla meta\n- Todo cambio o nueva funcionalidad implementada debe ser registrada en el archivo resumen.dm.\n`;

const summarySection = document.getElementById('summary-section');
const summaryContent = document.getElementById('summary-content');
const setLangBtn = document.getElementById('set-language');
const langInput = document.getElementById('language-input');
const introText = document.getElementById('intro-text');

// Utilidades para cookies
function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}
function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? decodeURIComponent(v[2]) : null;
}

// Textos estáticos en inglés por defecto, no traducir la página

// Mostrar el resumen bonito (en el idioma seleccionado)
async function mostrarResumen(lang) {
  // Ocultar input y botón, mostrar mensaje de traduciendo
  langInput.style.display = 'none';
  setLangBtn.style.display = 'none';
  summaryContent.innerHTML = '<em>Translating...</em>';
  introText.innerText = `Translating to: ${lang}`;
  let resumen = resumenBonito;
  let translated = resumen;
  try {
    translated = await translateWithGemini(resumen, lang);
    // Si Gemini responde con un mensaje de error, mostrar el original
    if (translated.toLowerCase().includes('por favor, proporciona el texto') ||
        translated.toLowerCase().includes('please provide the text')) {
      translated = resumen;
    }
  } catch {
    translated = resumen;
  }
  // Convertir markdown básico a HTML bonito
  summaryContent.innerHTML = marked.parse(translated);
  summarySection.classList.remove('hidden');
  introText.innerText = `Language selected: ${lang}`;
}

// Cambiar tema y guardar en cookie
Array.from(document.getElementsByClassName('theme-btn')).forEach(btn => {
  btn.onclick = () => {
    document.body.className = 'theme-' + btn.dataset.theme;
    setCookie('gemini_theme', btn.dataset.theme);
  };
});

// Restaurar tema e idioma al cargar
window.addEventListener('DOMContentLoaded', async () => {
  const savedTheme = getCookie('gemini_theme');
  if (savedTheme) {
    document.body.className = 'theme-' + savedTheme;
  }
  const savedLang = getCookie('gemini_lang');
  if (savedLang) {
    langInput.value = savedLang;
    await mostrarResumen(savedLang);
  }
});

const geminiApiKeys = [
  'AIzaSyC-OBgiCNVvE89JAGSE7fmLwpYEIZUWC1s',
  'AIzaSyB6020EfqXaM6hxGBr3muHM8I6NREUrTjc',
  'AIzaSyDPwkYnObXfDRmA0LklDQeExmc1O7ubNhQ',
  'AIzaSyAYbjvdUUoF6BBxY2A2zgTT7i-ULOoFKj8',
  'AIzaSyBGRwyBpYlqq_NDqOsK43Gwbr3BQuY5I5A',
  'AIzaSyA5CPsCdRfyd2FgqQkCLaSOq8q1rwrSruE',
  'AIzaSyBCeDqr5cSRsfOW79ebp11kAGVVt_gSyms',
  'AIzaSyCROpyrVOnE3ZJ4svyrdsGEoHdl8qroC9A',
  'AIzaSyCpbXc6yzjXghdRoz7AXB-dXUBW9I73F6M'
];
let geminiKeyIndex = 0;
function getNextGeminiKey() {
  const key = geminiApiKeys[geminiKeyIndex];
  geminiKeyIndex = (geminiKeyIndex + 1) % geminiApiKeys.length;
  return key;
}

// Traducción con Gemini (requiere tu API key de Gemini)
async function translateWithGemini(text, lang) {
  const apiKey = getNextGeminiKey();
  const prompt = `Traduce el siguiente texto al idioma ${lang}:\n${text}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await response.json();
  if (data && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  return text;
}

setLangBtn.onclick = async () => {
  const lang = langInput.value.trim();
  if (!lang) return;
  setCookie('gemini_lang', lang);
  await mostrarResumen(lang);
}; 
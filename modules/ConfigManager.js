const ConfigManager = {
  // Claves de localStorage
  STORAGE_KEYS: {
    LANG: 'lol-tracker-lang',
    THEME: 'lol-tracker-theme'
  },

  // Obtener idioma guardado o detectar del navegador
  getLanguage() {
    const saved = localStorage.getItem(this.STORAGE_KEYS.LANG);
    if (saved) return saved;
    
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('es') ? 'es' : 'en';
  },

  // Guardar idioma
  setLanguage(lang) {
    localStorage.setItem(this.STORAGE_KEYS.LANG, lang);
  },

  // Obtener tema guardado o usar por defecto
  getTheme(urlTheme = null) {
    return urlTheme || localStorage.getItem(this.STORAGE_KEYS.THEME) || 'dark';
  },

  // Guardar tema
  setTheme(theme) {
    localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
  },

  // Aplicar tema al body
  applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  },

  // Configurar switches iniciales
  setupSwitches(lang, theme) {
    const langSwitch = document.getElementById('langSwitch');
    const themeSwitch = document.getElementById('themeSwitch');
    
    if (langSwitch) langSwitch.checked = lang === 'es';
    if (themeSwitch) themeSwitch.checked = theme === 'light';
  },

  // Configurar event listeners para switches
  setupEventListeners(callbacks = {}) {
    const { onLanguageChange, onThemeChange } = callbacks;
    
    const langSwitch = document.getElementById('langSwitch');
    const themeSwitch = document.getElementById('themeSwitch');
    const soundSwitch = document.getElementById('soundSwitch');

    if (langSwitch) {
      langSwitch.addEventListener('change', () => {
        const newLang = langSwitch.checked ? 'es' : 'en';
        this.setLanguage(newLang);
        if (onLanguageChange) onLanguageChange(newLang);
      });
    }

    if (themeSwitch) {
      themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.applyTheme(newTheme);
        if (onThemeChange) onThemeChange(newTheme);
      });
    }

    if (soundSwitch) {
      soundSwitch.addEventListener('change', () => {
        // Placeholder para funcionalidad futura
      });
    }
  },

  // Verificar si está activo el modo "no guardar"
  isNoSaveMode() {
    return localStorage.getItem('no-save-options') === 'true';
  },

  // Guardar tema (siempre guarda, el bloqueo se maneja externamente)
  setTheme(theme) {
    localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
  },

  // Guardar idioma (siempre guarda, el bloqueo se maneja externamente)
  setLanguage(lang) {
    localStorage.setItem(this.STORAGE_KEYS.LANG, lang);
  },

  // Guardar solo si no está en modo "no guardar"
  conditionalSave(key, value) {
    if (!this.isNoSaveMode()) {
      localStorage.setItem(key, value);
    }
  },

  // Remover solo si no está en modo "no guardar"
  conditionalRemove(key) {
    if (!this.isNoSaveMode()) {
      localStorage.removeItem(key);
    }
  },

  // Inicializar configuración completa
  init(urlTheme = null, callbacks = {}) {
    const lang = this.getLanguage();
    const theme = this.getTheme(urlTheme);
    
    this.applyTheme(theme);
    this.setupSwitches(lang, theme);
    this.setupEventListeners(callbacks);
    
    return { lang, theme };
  }
};
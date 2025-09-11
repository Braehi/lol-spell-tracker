const LocalizationManager = {
  // Traducciones disponibles
  translations: {
    en: {
      waiting: 'Waiting for players...',
      generating: 'Generating new room...',
      invalidId: 'Invalid ID (6 characters)',
      connected: 'Connected to host',
      connecting: 'Connecting',
      error: 'Error',
      idInUse: 'ID in use. Click "New ID".',
      host: 'You are the host',
      tutorialTitle: 'Keyboard shortcuts:',
      keyStart: 'Start timer for role',
      keyAlt: 'Subtract 10 seconds (only if active and >10s left)',
      keyShift: 'Subtract 30 seconds (only if active and >30s left)',
      keyClick: 'Start timer',
      keyReset: 'Manual reset',
      reset: 'Reset',
      hostId: 'Host ID',
      copy: 'Copy',
      paste: 'Paste',
      join: 'Join',
      players: 'player',
      players_plural: 'players',
      noPlayers: 'No players',
      playingSolo: 'Playing solo',
      playingSoloHostLost: 'Playing solo (Host lost)'
    },
    es: {
      waiting: 'Esperando jugadores...',
      generating: 'Generando nueva sala...',
      invalidId: 'ID inválida (6 caracteres)',
      connected: 'Conectado al anfitrión',
      connecting: 'Conectando',
      error: 'Error',
      idInUse: 'ID en uso. Pulsa "Nueva ID".',
      host: 'Eres el host',
      tutorialTitle: 'Atajos de teclado:',
      keyStart: 'Inicia el temporizador del rol',
      keyAlt: 'Resta 10 segundos (solo si está activo y queda +10s)',
      keyShift: 'Resta 30 segundos (solo si está activo y queda +30s)',
      keyClick: 'Inicia el temporizador',
      keyReset: 'Reinicia manualmente',
      reset: 'Reinicio',
      hostId: 'ID del Host',
      copy: 'Copiar',
      paste: 'Pegar',
      join: 'Unirse',
      players: 'jugador',
      players_plural: 'jugadores',
      noPlayers: 'Sin jugadores',
      playingSolo: 'Jugando solo',
      playingSoloHostLost: 'Jugando solo (Host perdido)'
    }
  },

  // Idioma actual
  currentLang: 'en',

  // Inicializar con idioma
  init(lang) {
    this.currentLang = lang || 'en';
    return this.currentLang;
  },

  // Obtener traducción por clave
  t(key) {
    return this.translations[this.currentLang][key] || key;
  },

  // Cambiar idioma
  setLanguage(lang) {
    this.currentLang = lang;
  },

  // Obtener objeto de traducciones para idioma actual
  getTranslations() {
    return this.translations[this.currentLang];
  },

  // Actualizar todos los textos en la interfaz
  updateTexts(callbacks = {}) {
    const { updatePlayersBar } = callbacks;
    const trans = this.getTranslations();

    // Actualizar barra de jugadores si se proporciona callback
    if (updatePlayersBar) {
      updatePlayersBar();
    }

    // Actualizar elementos específicos que dependen del contexto
    // (estos se actualizarán desde el código principal según sea necesario)
    
    return trans;
  }
};
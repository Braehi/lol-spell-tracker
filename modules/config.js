const CONFIG = {
  MAX_NICKNAME_LENGTH: 20,
  MIN_NICKNAME_LENGTH: 2,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
  
  WINDOW_SIZES: {
    small: { width: 450, height: 725 },
    medium: { width: 450, height: 775 },
    large: { width: 550, height: 900 }
  },

  VALIDATION: {
    NICKNAME_PATTERN: /^[a-zA-Z0-9\sáéíóúñüÁÉÍÓÚÑÜ.']+$/,
    DIANA_NAMES: ['Diana, Scorn of the Moon', 'Diana, El desdén de la Luna']
  },

  STORAGE_KEYS: {
    LANG: 'lol-tracker-lang',
    THEME: 'lol-tracker-theme',
    NICKNAME: 'lol-tracker-nickname',
    MODE: 'lol-tracker-mode',
    ROLE: 'preferred-role',
    RECENT_NAMES: 'lol-tracker-recent-names',
    SELECTED_CHAMPION: 'selected-champion',
    USER_COLOR: 'user-color',
    REMEMBER_CHOICE: 'remember-choice',
    AUTO_FOCUS: 'auto-focus',
    WINDOW_SIZE: 'window-size'
  },

  DIANA: {
    GRADIENT_COLOR: 'linear-gradient(45deg, #ffffff, #87ceeb)',
    CHAMPION: 'Diana',
    AUDIO_PATH: './sound/Diana_Select.ogg',
    BACKGROUND_IMAGE: './Champions_assets/Diana_0.jpg'
  }
};
const ValidationManager = {
  sanitizeInput(input) {
    return input
      .replace(/[<>"'&]/g, '')
      .trim()
      .substring(0, CONFIG.MAX_NICKNAME_LENGTH);
  },

  validateNickname(nickname, isUsingRandomName = false) {
    if (CONFIG.DIANA.CHAMPION && CONFIG.VALIDATION.DIANA_NAMES.includes(nickname)) {
      return { valid: true, type: 'diana' };
    }
    
    if (!nickname || nickname.trim().length < CONFIG.MIN_NICKNAME_LENGTH) {
      return { valid: false, error: 'nameRequired' };
    }
    
    if (nickname.trim().length > CONFIG.MAX_NICKNAME_LENGTH) {
      return { valid: false, error: 'nameTooLong' };
    }
    
    if (!CONFIG.VALIDATION.NICKNAME_PATTERN.test(nickname.trim())) {
      return { valid: false, error: 'invalidChars' };
    }
    
    if (isUsingRandomName) {
      return { valid: true };
    }
    
    const selectedChampion = localStorage.getItem(CONFIG.STORAGE_KEYS.SELECTED_CHAMPION);
    const isChampionName = ChampionManager.validateChampionName(nickname.trim());
    
    if (isChampionName && selectedChampion && selectedChampion.toLowerCase() !== nickname.trim().toLowerCase()) {
      return { valid: false, error: 'championNameConflict' };
    }
    
    return { valid: true };
  },

  validateRealTime(nickname, inputElement) {
    inputElement.classList.remove('warning', 'error', 'success');
    
    if (CONFIG.VALIDATION.DIANA_NAMES.includes(nickname)) {
      inputElement.classList.add('success');
      return true;
    }
    
    if (!nickname || nickname.length < CONFIG.MIN_NICKNAME_LENGTH) {
      if (nickname.length > 0) {
        inputElement.classList.add('warning');
      }
      return false;
    }
    
    if (nickname.length > CONFIG.MAX_NICKNAME_LENGTH) {
      inputElement.classList.add('error');
      return false;
    }
    
    if (!CONFIG.VALIDATION.NICKNAME_PATTERN.test(nickname)) {
      inputElement.classList.add('error');
      return false;
    }
    
    inputElement.classList.add('success');
    return true;
  }
};
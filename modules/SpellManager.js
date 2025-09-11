const SpellManager = {
  // Datos de hechizos
  spellData: {
    heal: { duration: 240, icon: './images/SummonerHeal.png' },
    teleport: { duration: 300, icon: './images/SummonerTeleport.png' },
    ignite: { duration: 180, icon: './images/SummonerDot.png' },
    exhaust: { duration: 210, icon: './images/SummonerExhaust.png' },
    cleanse: { duration: 210, icon: './images/SummonerBoost.png' },
    ghost: { duration: 180, icon: './images/SummonerHaste.png' },
    barrier: { duration: 210, icon: './images/SummonerBarrier.png' },
    smite: { duration: 90, icon: './images/SummonerSmite.png' }
  },

  // Configuración de roles
  roles: ['Top', 'Jungle', 'Middle', 'Bottom', 'Support'],
  
  icons: [
    "./images/Top_icon.png",
    "./images/Jungle_icon.png", 
    "./images/Middle_icon.png",
    "./images/Bottom_icon.png",
    "./images/Support_icon.png"
  ],
  
  defaultSpells: ['teleport', 'smite', 'teleport', 'barrier', 'heal'],
  
  keyMap: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 },

  // Verificar si es smite
  isSmite(spell) {
    return spell === 'smite';
  },

  // Obtener datos de un hechizo
  getSpellData(spell) {
    return this.spellData[spell] || null;
  },

  // Aplicar lógica especial de smite a un elemento
  applySmiteLogic(element, spell) {
    const timeSpan = element.querySelector('span');
    
    if (this.isSmite(spell)) {
      element.classList.add('smite-reference');
      if (timeSpan) {
        timeSpan.textContent = '';
      }
      element.dataset.seconds = 0;
      element.dataset.initialDuration = 0;
    } else {
      element.classList.remove('smite-reference');
      const data = this.getSpellData(spell);
      if (data && timeSpan) {
        element.dataset.seconds = data.duration;
        element.dataset.initialDuration = data.duration;
        timeSpan.textContent = formatTime(data.duration);
      }
    }
  },

  // Traducciones de hechizos
  spellTranslations: {
    en: {
      teleport: 'Teleport',
      heal: 'Heal',
      smite: 'Smite',
      cleanse: 'Cleanse',
      exhaust: 'Exhaust',
      barrier: 'Barrier',
      ghost: 'Ghost',
      ignite: 'Ignite'
    },
    es: {
      teleport: 'Teleportar',
      heal: 'Curación',
      smite: 'Aplastar',
      cleanse: 'Limpiar',
      exhaust: 'Extenuación',
      barrier: 'Barrera',
      ghost: 'Fantasmal',
      ignite: 'Prender'
    }
  },

  // Obtener nombre traducido de hechizo
  getSpellName(spell, lang = 'en') {
    return this.spellTranslations[lang][spell] || spell;
  },

  // Crear opciones para select de hechizos
  createSpellOptions(lang = 'en') {
    return Object.keys(this.spellData).map(spell => ({
      value: spell,
      text: this.getSpellName(spell, lang)
    }));
  },

  // Obtener hechizo por defecto para un rol
  getDefaultSpellForRole(roleIndex) {
    return this.defaultSpells[roleIndex] || 'heal';
  },

  // Obtener índice de rol por tecla
  getRoleIndexByKey(key) {
    return this.keyMap[key] !== undefined ? this.keyMap[key] : -1;
  },

  // Validar si un hechizo existe
  validateSpell(spell) {
    return spell in this.spellData;
  },

  // Cambiar hechizo y resetear temporizador si estaba activo
  changeSpell(staticTimer, select, spell, formatTime, updateStaticTimerStyle) {
    const wasActive = staticTimer.classList.contains('active');
    const row = staticTimer.parentElement;
    
    // Detener temporizador si estaba activo
    if (staticTimer.interval) {
      clearInterval(staticTimer.interval);
      staticTimer.interval = null;
    }
    
    // Remover estados activos
    staticTimer.classList.remove('active', 'completed');
    row.classList.remove('secondary-active');
    staticTimer.style.removeProperty('border-color');
    staticTimer.style.removeProperty('box-shadow');
    staticTimer.style.removeProperty('animation');
    
    // Aplicar nuevo hechizo
    const data = this.getSpellData(spell);
    staticTimer.dataset.seconds = data.duration;
    staticTimer.dataset.initialDuration = data.duration;
    staticTimer.style.backgroundImage = `url(${data.icon})`;
    
    // Aplicar lógica de smite
    this.applySmiteLogic(staticTimer, spell);
    
    // Actualizar texto solo si no es smite
    if (!this.isSmite(spell)) {
      staticTimer.querySelector('span').textContent = formatTime(data.duration);
    }
    
    updateStaticTimerStyle(staticTimer);
  }
};
const TimerManager = {
  // Constantes de duración
  DURATIONS: {
    PRIMARY: 300,     // 5:00
    GAME: 600,        // 10:00
    WARNING: 60,      // <= 60s
    NOTIF: 800,       // ms
    FEEDBACK: 500,    // ms
    RESET_FLASH: 1000 // ms
  },

  // Formatear tiempo en MM:SS
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // Iniciar temporizador primario
  startTimer(box, shouldSync = true, callbacks = {}) {
    const { sendEvent, playPingSound, checkTimerErrors } = callbacks;
    
    if (box.interval) return;
    const timeSpan = box.querySelector('.time');
    const row = box.parentElement;

    box.classList.remove('active', 'completed');
    row.classList.add('active');
    box.offsetHeight;
    box.classList.add('active');

    box.style.removeProperty('border-color');
    box.style.removeProperty('box-shadow');
    box.style.removeProperty('animation');

    let totalSeconds = parseInt(box.dataset.seconds) || this.DURATIONS.PRIMARY;
    box.startTime = new Date().getTime();
    box.dataset.seconds = totalSeconds;
    timeSpan.textContent = this.formatTime(totalSeconds);

    box.interval = setInterval(() => {
      totalSeconds = parseInt(box.dataset.seconds);
      totalSeconds--;
      box.dataset.seconds = totalSeconds;
      timeSpan.textContent = this.formatTime(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(box.interval);
        box.interval = null;
        box.startTime = null;
        box.classList.remove('active');
        row.classList.remove('active');
        box.classList.add('completed');
        box.style.removeProperty('border-color');
        box.style.removeProperty('box-shadow');
        box.dataset.seconds = this.DURATIONS.PRIMARY;
        timeSpan.textContent = '05:00';
        timeSpan.style.color = '';
        timeSpan.classList.remove('warning');
        if (playPingSound) playPingSound();

        setTimeout(() => {
          if (!box.interval) {
            box.classList.remove('completed');
          }
        }, 10000);
      } else if (totalSeconds <= 60) {
        box.style.animation = 'none';
        box.style.borderColor = 'var(--warning-border)';
        box.style.boxShadow = '0 0 12px rgba(229, 57, 53, 0.6)';
        timeSpan.classList.add('warning');
      } else {
        box.style.removeProperty('animation');
        box.style.removeProperty('border-color');
        box.style.removeProperty('box-shadow');
        box.classList.add('active');
        timeSpan.classList.remove('warning');
      }
    }, 1000);

    if (shouldSync && sendEvent) {
      sendEvent({
        a: 'start',
        i: parseInt(box.dataset.index),
        s: totalSeconds,
        startTime: box.startTime
      });
    }
    
    if (checkTimerErrors) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      checkTimerErrors(minutes, seconds);
    }
  },

  // Resetear temporizador primario
  resetTimer(box, shouldSync = true, callbacks = {}) {
    const { sendEvent } = callbacks;
    const timeSpan = box.querySelector('.time');
    const message = box.querySelector('.reset-message');
    const row = box.parentElement;

    if (box.interval) {
      clearInterval(box.interval);
      box.interval = null;
    }

    timeSpan.textContent = '05:00';
    timeSpan.style.color = '';
    timeSpan.classList.remove('warning');
    box.classList.remove('active', 'completed', 'buttons-hidden');
    row.classList.remove('active');
    if (box.hoverTimeout) {
      clearTimeout(box.hoverTimeout);
      box.hoverTimeout = null;
    }
    box.style.removeProperty('border-color');
    box.style.removeProperty('box-shadow');
    box.style.removeProperty('animation');
    box.dataset.seconds = 300;

    message.classList.add('show');
    box.classList.add('reset-flash');
    setTimeout(() => {
      message.classList.remove('show');
      box.classList.remove('reset-flash');
    }, this.DURATIONS.RESET_FLASH);

    if (shouldSync && sendEvent) {
      sendEvent({
        a: 'reset',
        i: parseInt(box.dataset.index)
      });
    }
  },

  // Ajustar tiempo del temporizador
  adjustTime(box, seconds, shouldSync = true, callbacks = {}) {
    const { sendEvent } = callbacks;
    const timeSpan = box.querySelector('.time');
    const notification = box.querySelector('.time-notification');
    const feedback = box.querySelector('.feedback');

    if (!box.classList.contains('active')) return;

    const currentTotal = parseInt(box.dataset.seconds) || this.DURATIONS.PRIMARY;

    if (seconds === -10 && currentTotal < 10) return;
    if (seconds === -30 && currentTotal < 30) return;

    const newTotal = Math.max(0, currentTotal + seconds);
    box.dataset.seconds = newTotal;
    timeSpan.textContent = this.formatTime(newTotal);

    notification.textContent = `${seconds}s`;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), this.DURATIONS.NOTIF);

    feedback.textContent = seconds === -10 ? '-10' : '-30';
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), this.DURATIONS.FEEDBACK);

    timeSpan.style.color = 'white';
    timeSpan.style.transform = 'scale(0.9)';
    setTimeout(() => {
      timeSpan.style.color = '';
      timeSpan.style.transform = '';
    }, 150);
    
    timeSpan.classList.add('highlight');
    setTimeout(() => timeSpan.classList.remove('highlight'), this.DURATIONS.FEEDBACK);

    if (shouldSync && sendEvent) {
      sendEvent({
        a: 'adjust',
        i: parseInt(box.dataset.index),
        s: seconds
      });
    }
  },

  // Iniciar temporizador secundario
  startStaticTimer(el) {
    if (el.interval) return;
    const timeSpan = el.querySelector('span');
    const row = el.parentElement;

    el.classList.remove('completed');
    el.classList.add('active');

    el.style.removeProperty('border-color');
    el.style.removeProperty('box-shadow');
    el.style.removeProperty('animation');

    let totalSeconds = parseInt(el.dataset.seconds);
    el.startTime = new Date().getTime();
    timeSpan.textContent = this.formatTime(totalSeconds);

    el.interval = setInterval(() => {
      totalSeconds--;
      el.dataset.seconds = totalSeconds;
      timeSpan.textContent = this.formatTime(totalSeconds);

      if (totalSeconds <= 0) {
        clearInterval(el.interval);
        el.interval = null;
        el.startTime = null;
        el.classList.remove('active');
        row.classList.remove('secondary-active');
        el.classList.add('completed');
        el.style.removeProperty('border-color');
        el.style.removeProperty('box-shadow');
        el.dataset.seconds = parseInt(el.dataset.initialDuration);
        timeSpan.textContent = this.formatTime(el.dataset.seconds);
      } else if (totalSeconds <= 60) {
        el.style.animation = 'none';
        el.style.borderColor = 'var(--warning-border)';
        el.style.boxShadow = '0 0 12px rgba(229, 57, 53, 0.6)';
      } else {
        el.style.removeProperty('animation');
        el.style.removeProperty('border-color');
        el.style.removeProperty('box-shadow');
        el.classList.add('active');
      }
    }, 1000);
  },

  // Resetear temporizador secundario
  resetStaticTimer(el, select, isTeleportUnleashed = false) {
    const timeSpan = el.querySelector('span');
    const row = el.parentElement;

    if (el.interval) {
      clearInterval(el.interval);
      el.interval = null;
    }

    const spell = select.value;
    const data = SpellManager.getSpellData(spell);
    let duration = data.duration;
    
    if (spell === 'teleport' && isTeleportUnleashed) {
      duration = 240;
    }
    
    el.dataset.seconds = duration;
    el.dataset.initialDuration = duration;
    
    // Aplicar lógica de smite
    SpellManager.applySmiteLogic(el, spell);
    if (!SpellManager.isSmite(spell)) {
      timeSpan.textContent = this.formatTime(duration);
    }

    el.classList.remove('active', 'completed');
    row.classList.remove('secondary-active');
    el.style.removeProperty('border-color');
    el.style.removeProperty('box-shadow');
    el.style.removeProperty('animation');

    const message = document.createElement('div');
    message.className = 'reset-message';
    message.textContent = 'Reset';
    el.appendChild(message);
    message.classList.add('show');
    setTimeout(() => {
      if (message.parentNode) message.remove();
    }, this.DURATIONS.RESET_FLASH);
  },

  // Actualizar estilo del temporizador secundario
  updateStaticTimerStyle(el) {
    const seconds = parseInt(el.dataset.seconds);
    el.classList.remove('warning', 'active');
    if (seconds <= 60 && seconds > 0) {
      el.classList.add('warning');
    }
  },

  // Resetear todos los temporizadores
  resetAll(timerBoxes, staticTimers, spellSelects, gameTimerEl, mainActionBtn, shouldSync = true, callbacks = {}) {
    const { sendEvent, clearErrorTimeout } = callbacks;
    
    if (shouldSync && sendEvent) {
      sendEvent({ a: 'resetAll' });
    }

    timerBoxes.forEach(box => {
      if (box.interval) {
        clearInterval(box.interval);
        box.interval = null;
      }
      const timeSpan = box.querySelector('.time');
      const message = box.querySelector('.reset-message');
      const row = box.parentElement;

      timeSpan.textContent = '05:00';
      timeSpan.style.color = '';
      timeSpan.classList.remove('warning');
      box.classList.remove('active', 'completed');
      row.classList.remove('active');
      box.style.removeProperty('border-color');
      box.style.removeProperty('box-shadow');
      box.style.removeProperty('animation');
      box.dataset.seconds = 300;

      message.classList.add('show');
      box.classList.add('reset-flash');
      setTimeout(() => {
        message.classList.remove('show');
        box.classList.remove('reset-flash');
      }, 1000);
    });

    staticTimers.forEach((el, i) => {
      if (el.interval) {
        clearInterval(el.interval);
        el.interval = null;
      }
      const timeSpan = el.querySelector('span');
      const row = el.parentElement;
      const select = spellSelects[i];

      const defaultSpell = SpellManager.getDefaultSpellForRole(i);
      select.value = defaultSpell;
      const data = SpellManager.getSpellData(defaultSpell);
      el.style.backgroundImage = `url(${data.icon})`;
      
      // Aplicar lógica de smite
      SpellManager.applySmiteLogic(el, defaultSpell);
      if (!SpellManager.isSmite(defaultSpell)) {
        el.dataset.seconds = data.duration;
        el.dataset.initialDuration = data.duration;
      }

      el.classList.remove('active', 'completed');
      row.classList.remove('secondary-active');
      el.style.removeProperty('border-color');
      el.style.removeProperty('box-shadow');
      el.style.removeProperty('animation');

      const message = document.createElement('div');
      message.className = 'reset-message';
      message.textContent = 'Reset';
      el.appendChild(message);
      message.classList.add('show');
      setTimeout(() => {
        if (message.parentNode) message.remove();
      }, 1000);
    });

    if (gameTimerEl && mainActionBtn) {
      gameTimerEl.classList.remove('active');
      gameTimerEl.textContent = '10:00';
      mainActionBtn.textContent = 'Start Game';
    }
    
    if (clearErrorTimeout) {
      clearErrorTimeout();
    }
  },

  // Actualizar duración de teleport
  updateTeleportDuration(staticTimers, spellSelects, newDuration) {
    staticTimers.forEach((el, i) => {
      const select = spellSelects[i];
      if (select.value === 'teleport') {
        const timeSpan = el.querySelector('span');
        el.dataset.seconds = newDuration;
        el.dataset.initialDuration = newDuration;
        timeSpan.textContent = this.formatTime(newDuration);
      }
    });
  },

  // Verificar errores de tiempo
  checkTimerErrors(startTimeMinutes, startTimeSeconds, lang, errorTimeout, setErrorTimeout) {
    const totalSeconds = startTimeMinutes * 60 + startTimeSeconds;
    const errorMsg = document.getElementById('timer-error-msg');
    
    if (totalSeconds > 301) {
      errorMsg.textContent = lang === 'es' ? '¿Temporizadores incorrectos? Comprueba la hora del sistema.' : 'Wrong timers? Check system time.';
      errorMsg.style.display = 'block';
      
      if (errorTimeout) clearTimeout(errorTimeout);
      const newTimeout = setTimeout(() => {
        errorMsg.style.display = 'none';
      }, 60000);
      setErrorTimeout(newTimeout);
    } else {
      errorMsg.style.display = 'none';
      if (errorTimeout) {
        clearTimeout(errorTimeout);
        setErrorTimeout(null);
      }
    }
  },

  // Parsear tiempo desde string
  parseTime(timeStr) {
    if (timeStr === 'Unleashed Teleport!') return 0;
    const [min, sec] = timeStr.split(':').map(Number);
    return min * 60 + sec;
  }
};
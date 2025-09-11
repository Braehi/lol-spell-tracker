const AudioManager = {
  // Contexto de audio
  audioContext: null,

  // Inicializar contexto de audio
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  },

  // Reproducir sonido de ping
  playPingSound(soundSwitch) {
    if (!this.audioContext) this.init();
    
    if (this.audioContext.state === 'suspended') return;
    if (!this.soundEnabled(soundSwitch)) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  },

  // Verificar si el sonido está habilitado
  soundEnabled(soundSwitch) {
    return soundSwitch && soundSwitch.checked;
  },

  // Configurar activación automática del audio
  setupAutoResume() {
    if (!this.audioContext) this.init();
    
    document.addEventListener('click', () => {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    }, { once: true });
  }
};
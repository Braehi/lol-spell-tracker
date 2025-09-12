class RoomManager {
  static isOpen = true;
  static maxPlayers = 7;
  static playerRoles = new Map(); // playerId -> 'guest' | 'mod'
  
  static init() {
    this.createRoomMenuButton();
    this.createRoomMenuPanel();
    this.setupEventListeners();
  }
  
  static createRoomMenuButton() {
    const button = document.createElement('button');
    button.id = 'roomMenuToggle';
    button.className = 'tutorial-toggle';
    button.style.cssText = 'display: none; width: 280px; max-width: 280px;'; // Solo visible para hosts
    button.innerHTML = `
      <span id="roomMenuArrow">▼</span>
      <span data-translate="roomSettings">Room Settings</span>
    `;
    
    // Insertar después del tutorial box
    const tutorialBox = document.getElementById('tutorialBox');
    if (tutorialBox) {
      tutorialBox.parentNode.insertBefore(button, tutorialBox.nextSibling);
    }
  }
  
  static createRoomMenuPanel() {
    const panel = document.createElement('div');
    panel.id = 'roomMenuBox';
    panel.className = 'tutorial-box';
    panel.style.cssText = 'width: 280px; max-width: 280px;';
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span><strong data-translate="roomStatus">Room Status:</strong></span>
        <label class="switch" style="margin: 0;">
          <input type="checkbox" id="roomOpenSwitch" checked>
          <span class="slider"></span>
        </label>
        <span id="roomStatusText" style="color: #4caf50; font-weight: bold;" data-translate="open">Open</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span><strong data-translate="maxPlayers">Max Players:</strong></span>
        <select id="maxPlayersSelect" style="padding: 4px 8px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); border-radius: 4px;">
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7" selected>7</option>
        </select>
      </div>
      <div style="margin-top: 12px;">
        <div style="font-weight: bold; margin-bottom: 8px;" data-translate="currentPlayers">Current Players:</div>
        <div id="playersList" style="max-height: 150px; overflow-y: auto;"></div>
      </div>
    `;
    
    this.updatePlayersList();
    
    // Insertar después del room menu button
    const roomMenuButton = document.getElementById('roomMenuToggle');
    if (roomMenuButton) {
      roomMenuButton.parentNode.insertBefore(panel, roomMenuButton.nextSibling);
    }
  }
  
  static setupEventListeners() {
    // Toggle del menú
    document.addEventListener('click', (e) => {
      if (e.target.closest('#roomMenuToggle')) {
        this.toggleRoomMenu();
      }
    });
    
    // Switch de abrir/cerrar sala y selector de jugadores máximos
    document.addEventListener('change', (e) => {
      if (e.target.matches('#roomOpenSwitch')) {
        this.toggleRoomStatus(e.target.checked);
      }
      if (e.target.matches('#maxPlayersSelect')) {
        this.setMaxPlayers(parseInt(e.target.value));
      }
    });
  }
  
  static toggleRoomMenu() {
    const box = document.getElementById('roomMenuBox');
    const arrow = document.getElementById('roomMenuArrow');
    
    if (box.classList.contains('show')) {
      box.classList.remove('show');
      arrow.textContent = '▼';
    } else {
      box.classList.add('show');
      arrow.textContent = '▲';
    }
  }
  
  static toggleRoomStatus(isOpen) {
    this.isOpen = isOpen;
    const statusText = document.getElementById('roomStatusText');
    
    if (isOpen) {
      statusText.textContent = LocalizationManager.t('open');
      statusText.style.color = '#4caf50';
    } else {
      statusText.textContent = LocalizationManager.t('closed');
      statusText.style.color = '#ff5252';
    }
    
    // Actualizar barra de jugadores y lista
    if (window.updatePlayersBar) {
      window.updatePlayersBar();
    }
    this.updatePlayersList();
    
    // Enviar cambio de estado a todos los invitados
    if (window.sendEvent) {
      window.sendEvent({ a: 'roomStatusChanged', isOpen: isOpen });
    }
    
    // Notificar al sistema principal si existe
    if (window.roomStatusChanged) {
      window.roomStatusChanged(isOpen);
    }
  }
  
  static showForHost() {
    const button = document.getElementById('roomMenuToggle');
    if (button) {
      button.style.display = 'flex';
    }
  }
  
  static hideForGuest() {
    const button = document.getElementById('roomMenuToggle');
    if (button) {
      button.style.display = 'none';
    }
  }
  
  static canJoinRoom(isInvitation = false) {
    return this.isOpen || isInvitation;
  }
  
  static updatePlayersList() {
    const playersList = document.getElementById('playersList');
    if (!playersList || !window.connectedPlayers) return;
    
    playersList.innerHTML = '';
    
    window.connectedPlayers.forEach((player, playerId) => {
      const playerDiv = document.createElement('div');
      playerDiv.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; padding: 4px; background: rgba(255,255,255,0.05); border-radius: 4px;';
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = player.nick;
      nameSpan.style.cssText = 'flex: 1; font-size: 0.8rem;';
      
      if (player.isSelf) {
        // Host
        const hostLabel = document.createElement('span');
        hostLabel.textContent = LocalizationManager.t('host');
        hostLabel.style.cssText = 'color: #4caf50; font-weight: bold; font-size: 0.75rem;';
        playerDiv.appendChild(nameSpan);
        playerDiv.appendChild(hostLabel);
      } else {
        // Guest con controles
        const roleSelect = document.createElement('select');
        roleSelect.style.cssText = 'margin: 0 8px; padding: 2px 4px; font-size: 0.7rem; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border); border-radius: 3px;';
        
        const guestOption = document.createElement('option');
        guestOption.value = 'guest';
        guestOption.textContent = LocalizationManager.t('guest');
        
        const modOption = document.createElement('option');
        modOption.value = 'mod';
        modOption.textContent = LocalizationManager.t('mod');
        
        roleSelect.appendChild(guestOption);
        roleSelect.appendChild(modOption);
        roleSelect.value = this.playerRoles.get(playerId) || 'guest';
        
        const kickBtn = document.createElement('button');
        kickBtn.textContent = LocalizationManager.t('kick');
        kickBtn.style.cssText = 'padding: 2px 6px; font-size: 0.7rem; background: #ff5252; color: white; border: none; border-radius: 3px; cursor: pointer; transition: all 0.2s ease;';
        kickBtn.onmouseenter = () => kickBtn.style.background = '#ff1744';
        kickBtn.onmouseleave = () => kickBtn.style.background = '#ff5252';
        kickBtn.onmousedown = () => kickBtn.style.transform = 'scale(0.95)';
        kickBtn.onmouseup = () => kickBtn.style.transform = 'scale(1)';
        kickBtn.onclick = () => {
          console.log('Kick button clicked for:', playerId);
          this.kickPlayer(playerId);
        };
        
        playerDiv.appendChild(nameSpan);
        playerDiv.appendChild(roleSelect);
        playerDiv.appendChild(kickBtn);
      }
      
      playersList.appendChild(playerDiv);
    });
  }
  
  static kickPlayer(playerId) {
    console.log('kickPlayer called with:', playerId);
    console.log('window.connections exists:', !!window.connections);
    console.log('window.connections length:', window.connections ? window.connections.length : 'N/A');
    
    if (window.connections) {
      console.log('All connections:', window.connections.map(c => c.peer));
      const conn = window.connections.find(c => c.peer === playerId);
      console.log('Connection found:', !!conn);
      if (conn) {
        console.log('Connection open:', conn.open);
        if (conn.open) {
          console.log('Sending kick message');
          conn.send({ a: 'kicked' });
          console.log('Kick message sent');
        }
      }
    }
  }
  
  static setMaxPlayers(max) {
    this.maxPlayers = max;
    
    // Actualizar barra de jugadores y lista
    if (window.updatePlayersBar) {
      window.updatePlayersBar();
    }
    this.updatePlayersList();
    
    // Enviar cambio a todos los invitados
    if (window.sendEvent) {
      window.sendEvent({ a: 'maxPlayersChanged', maxPlayers: max });
    }
  }
  
  static getMaxGuests() {
    return this.maxPlayers - 1; // Excluir al host
  }
}

// Auto-inicializar cuando se carga el módulo
if (typeof window !== 'undefined') {
  window.RoomManager = RoomManager;
}
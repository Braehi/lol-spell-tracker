const EventManager = {
  listeners: new Map(),

  on(element, event, handler) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }
    
    const elementListeners = this.listeners.get(element);
    if (!elementListeners.has(event)) {
      elementListeners.set(event, []);
    }
    
    elementListeners.get(event).push(handler);
    element.addEventListener(event, handler);
  },

  delegate(parent, selector, event, handler) {
    const delegatedHandler = (e) => {
      if (e.target.matches(selector)) {
        handler(e);
      }
    };
    
    this.on(parent, event, delegatedHandler);
  },

  off(element, event, handler) {
    element.removeEventListener(event, handler);
    
    const elementListeners = this.listeners.get(element);
    if (elementListeners && elementListeners.has(event)) {
      const handlers = elementListeners.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  },

  cleanup() {
    this.listeners.forEach((eventMap, element) => {
      eventMap.forEach((handlers, event) => {
        handlers.forEach(handler => {
          element.removeEventListener(event, handler);
        });
      });
    });
    this.listeners.clear();
  }
};
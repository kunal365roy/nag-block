(() => {
  // Block custom elements before any scripts run
  const blockCustomElements = () => {
    Object.defineProperty(window, 'customElements', {
      value: {
        define: () => {},
        get: () => undefined,
        whenDefined: () => Promise.resolve(),
        upgrade: () => {}
      },
      configurable: false,
      enumerable: false,
      writable: false
    });
  };

  // Execute immediately
  blockCustomElements();

  // Block any attempts to redefine customElements
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === window && prop === 'customElements') {
      return obj;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };

  // Prevent Shadow DOM attachment
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function() {
    if (this.tagName && this.tagName.toLowerCase() === 'gu-island') {
      return this;
    }
    return originalAttachShadow.apply(this, arguments);
  };

  // Block gu-island element creation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    if (tagName.toLowerCase() === 'gu-island') {
      const div = originalCreateElement.call(document, 'div');
      div.style.cssText = 'display:none!important;';
      return div;
    }
    return originalCreateElement.call(document, tagName, options);
  };

  // Remove any dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Check for gu-island elements
            if (node.tagName && node.tagName.toLowerCase() === 'gu-island') {
              const name = node.getAttribute('name');
              if (name === 'StickyBottomBanner' || name === 'UsEoy2024Wrapper') {
                node.remove();
              }
            }
            // Check for aside elements
            if (node.tagName && node.tagName.toLowerCase() === 'aside') {
              const hasGuIsland = node.querySelector('gu-island');
              const hasFieldset = node.querySelector('fieldset');
              if (hasGuIsland || hasFieldset) {
                node.remove();
              }
            }
            // Remove any scripts that might initialize the banner
            if (node.tagName === 'SCRIPT') {
              const src = node.src || '';
              if (src.includes('guardian') || src.includes('contributions')) {
                node.remove();
              }
            }
          }
        });
      }
    });
  });

  // Start observing with aggressive configuration
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true
  });

  // Block any attempts to load banner-related scripts
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(node) {
    if (node.tagName === 'SCRIPT') {
      const src = node.src || '';
      if (src.includes('guardian') || src.includes('contributions')) {
        return node;
      }
    }
    return originalAppendChild.call(this, node);
  };
})();

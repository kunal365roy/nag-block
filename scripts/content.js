(() => {
  // Override window.customElements before it's even accessed
  const customElementsDescriptor = Object.getOwnPropertyDescriptor(window, 'customElements') || {};
  Object.defineProperty(window, 'customElements', {
    ...customElementsDescriptor,
    get: function() {
      return {
        define: function() { return undefined; },
        get: function() { return undefined; },
        whenDefined: function() { return Promise.resolve(undefined); },
        upgrade: function() { return undefined; }
      };
    },
    configurable: false,
    enumerable: false
  });

  // Prevent Shadow DOM attachment
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    if (this.tagName && this.tagName.toLowerCase() === 'gu-island') {
      return this;
    }
    return originalAttachShadow.call(this, init);
  };

  // Block custom element upgrades
  const originalUpgrade = document.createElement;
  document.createElement = function(tagName, options) {
    if (tagName.toLowerCase().includes('gu-') || options?.is?.includes('gu-')) {
      const div = originalUpgrade.call(this, 'div');
      div.style.display = 'none';
      return div;
    }
    return originalUpgrade.call(this, tagName, options);
  };

  // Define comprehensive selectors
  const AD_SELECTORS = [
    // Banner selectors
    'aside:has(> gu-island[name="StickyBottomBanner"])',
    'gu-island[name="StickyBottomBanner"]',
    'aside > gu-island[name="StickyBottomBanner"]',
    'aside:has(gu-island[name="StickyBottomBanner"])',
    'aside:has(> gu-island)',
    'aside:last-child:has(gu-island)',

    // Alternative banner selectors
    'gu-island[name="UsEoy2024Wrapper"]',
    'aside:has(> gu-island[name="UsEoy2024Wrapper"])',
    'div:has(> gu-island[name="UsEoy2024Wrapper"])',

    // Contribution elements
    'input[name*="contribution-frequency"]',
    'input[name*="contribution-amount"]',
    '[name*="contribution"]',
    'fieldset:has(input[name*="contribution"])',

    // Generic elements
    'aside:has(fieldset)',
    'aside:has(picture)',
    'aside:has(button[type="button"])',
    'div:has(> [data-contribution-type])',
    'div:has(> [name*="contribution"])',
    'aside:last-child'
  ];

  // Inject early CSS rules
  const style = document.createElement('style');
  style.textContent = `
    ${AD_SELECTORS.join(',\n    ')} {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: fixed !important;
      top: -9999px !important;
      left: -9999px !important;
      height: 0 !important;
      width: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      clip: rect(0 0 0 0) !important;
      -webkit-clip-path: inset(50%) !important;
      clip-path: inset(50%) !important;
    }
    gu-island {
      display: none !important;
    }
  `;
  document.documentElement.appendChild(style);

  // Block script loading
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === 'SCRIPT') {
            const src = node.src || '';
            if (src.includes('guardian') || src.includes('contributions')) {
              node.remove();
            }
          }
          if (node.nodeType === 1) {
            const elements = node.querySelectorAll(AD_SELECTORS.join(','));
            elements.forEach(el => el.remove());
          }
        });
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Override CSS variables
  document.documentElement.style.setProperty('--sticky-banner-height', '0', 'important');
  document.documentElement.style.setProperty('--banner-height', '0', 'important');
})();

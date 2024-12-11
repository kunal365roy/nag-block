(() => {
  // Immediately inject CSS rules before any scripts run
  const style = document.createElement('style');
  style.textContent = `
    aside:has(> gu-island[name="StickyBottomBanner"]),
    aside:has(> gu-island[name="UsEoy2024Wrapper"]),
    gu-island[name="StickyBottomBanner"],
    gu-island[name="UsEoy2024Wrapper"],
    aside:has(fieldset:has(input[name*="contribution"])),
    aside:last-child:has(gu-island),
    aside:has(> div:has(fieldset)),
    aside:has(picture:has(+ div:has(fieldset))),
    div:has(> [data-contribution-type]),
    div:has(> [name*="contribution"]) {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      width: 0 !important;
      position: absolute !important;
      pointer-events: none !important;
      clip: rect(0, 0, 0, 0) !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
    }
  `;
  document.documentElement.appendChild(style);

  // Block web components before any scripts run
  const blockCustomElements = () => {
    if (!window.customElements) return;
    const noop = () => {};
    Object.defineProperty(window, 'customElements', {
      value: {
        define: noop,
        get: () => undefined,
        whenDefined: () => Promise.resolve(),
        upgrade: noop
      },
      configurable: false,
      enumerable: false,
      writable: false
    });
  };

  // Execute immediately and on DOMContentLoaded
  blockCustomElements();
  document.addEventListener('DOMContentLoaded', blockCustomElements);

  // Prevent Shadow DOM attachment
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function() {
    if (this.tagName && this.tagName.toLowerCase() === 'gu-island') {
      return this;
    }
    return originalAttachShadow.apply(this, arguments);
  };

  // Block element creation and upgrades
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    if (tagName.toLowerCase() === 'gu-island') {
      const div = originalCreateElement.call(document, 'div');
      div.style.cssText = 'display:none!important;';
      return div;
    }
    return originalCreateElement.call(document, tagName, options);
  };

  // Remove elements as soon as they appear
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check for banner elements
          if (node.tagName && node.tagName.toLowerCase() === 'gu-island') {
            const name = node.getAttribute('name');
            if (name === 'StickyBottomBanner' || name === 'UsEoy2024Wrapper') {
              node.remove();
            }
          }
          // Check for container elements
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
    });
  });

  // Start observing with aggressive configuration
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  // Override CSS variables
  const overrideCSSVariables = () => {
    document.documentElement.style.setProperty('--sticky-banner-height', '0', 'important');
    document.documentElement.style.setProperty('--banner-height', '0', 'important');
    document.documentElement.style.setProperty('--contributions-banner-height', '0', 'important');
  };

  // Execute CSS variable override immediately and on DOM changes
  overrideCSSVariables();
  document.addEventListener('DOMContentLoaded', overrideCSSVariables);
})();

(() => {
  // Block web components before they can be registered
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

  // Execute web component blocking immediately
  blockCustomElements();

  // Block banner initialization and web components
  const blockBanners = () => {
    // Remove existing banners
    const selectors = [
      // Target specific banner elements
      'gu-island[name="StickyBottomBanner"]',
      'input[name="contributions-banner-choice-cards-contribution-frequency"]',
      'input[name="contributions-banner-choice-cards-contribution-amount"]',
      'fieldset:has(input[name*="contributions-banner-choice-cards"])',
      // Target banner containers
      'aside:has(> gu-island)',
      'aside:has(> div > gu-island)',
      'aside:has(> div:has(> gu-island))',
      // Target contribution elements
      'fieldset:has(legend)',
      'fieldset:has(input[name*="contribution"])',
      'div:has(> [data-contribution-type])',
      'div:has(> [name*="contribution"])',
      // Target all contribution-related elements
      '[href*="contribute"]',
      '[href*="support"]',
      '[name*="contribution"]',
      '[data-contribution-type]'
    ];

    // Remove elements matching selectors
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.remove();
      });
    });

    // Override CSS variables to prevent banner space
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --sticky-banner-height: 0 !important;
        --banner-height: 0 !important;
        --contributions-banner-height: 0 !important;
        --banner-bottom-height: 0 !important;
        --banner-top-height: 0 !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Execute banner blocking immediately and on DOM changes
  blockBanners();
  document.addEventListener('DOMContentLoaded', blockBanners);
  window.addEventListener('load', blockBanners);

  // Prevent Shadow DOM attachment
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function() {
    if (this.tagName && this.tagName.toLowerCase() === 'gu-island') {
      return this;
    }
    return originalAttachShadow.apply(this, arguments);
  };

  // Block element creation
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName, options) {
    if (tagName.toLowerCase() === 'gu-island') {
      const div = originalCreateElement.call(document, 'div');
      div.style.cssText = 'display:none!important;';
      return div;
    }
    return originalCreateElement.call(document, tagName, options);
  };

  // Remove elements as they appear
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Check for banner elements
          if (node.tagName && (
            node.tagName.toLowerCase() === 'aside' ||
            node.tagName.toLowerCase() === 'gu-island' ||
            node.querySelector('fieldset') ||
            node.querySelector('[name*="contribution"]')
          )) {
            node.remove();
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

    // Run banner blocking after mutations
    blockBanners();
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
    const variables = [
      '--sticky-banner-height',
      '--banner-height',
      '--contributions-banner-height',
      '--banner-bottom-height',
      '--banner-top-height'
    ];
    variables.forEach(variable => {
      document.documentElement.style.setProperty(variable, '0', 'important');
    });
  };

  // Execute CSS variable override
  overrideCSSVariables();
  document.addEventListener('DOMContentLoaded', overrideCSSVariables);
  window.addEventListener('load', overrideCSSVariables);
})();

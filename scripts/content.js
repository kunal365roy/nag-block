(() => {
  // Block Shadow DOM and custom element initialization
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    if (this.tagName && this.tagName.toLowerCase() === 'gu-island') {
      console.debug('Blocked shadow DOM attachment for gu-island');
      return this;
    }
    return originalAttachShadow.call(this, init);
  };

  // Override customElements.define before it's even created
  Object.defineProperty(window, 'customElements', {
    get: function() {
      return {
        define: function(name, constructor) {
          console.debug('Blocked custom element registration:', name);
          return undefined;
        },
        get: function(name) {
          return undefined;
        },
        whenDefined: function(name) {
          return Promise.resolve(undefined);
        }
      };
    },
    configurable: false,
    enumerable: false
  });

  // Define comprehensive selectors targeting all banner variants
  const AD_SELECTORS = [
    // Primary banner selectors (current implementation)
    'aside:has(> gu-island[name="StickyBottomBanner"])',
    'gu-island[name="StickyBottomBanner"]',
    'aside:last-child:has(> gu-island[name="StickyBottomBanner"])',
    'aside:has(> gu-island[name="StickyBottomBanner"]) > *',
    'aside > gu-island[name="StickyBottomBanner"]',
    'aside:has(gu-island[name="StickyBottomBanner"])',

    // Alternative banner selectors
    'gu-island[name="UsEoy2024Wrapper"]',
    'aside:has(> gu-island[name="UsEoy2024Wrapper"])',
    'div:has(> gu-island[name="UsEoy2024Wrapper"])',

    // Contribution form elements
    'input[name="contributions-banner-choice-cards-contribution-frequency"]',
    'input[name="contributions-banner-choice-cards-contribution-amount"]',
    '[name="thrasher-choice-cards-contribution-frequency"]',
    '[name="thrasher-choice-cards-contribution-amount"]',
    'fieldset:has(> input[name*="contribution"])',

    // Generic banner elements
    'aside:has(fieldset)',
    'aside:has(picture)',
    'aside:has(button[type="button"])',
    'aside:has(> div:has(fieldset))',
    'div:has(> [data-contribution-type])',
    'div:has(> [name*="contribution"])',
    'aside:last-child:has(gu-island)',
    'aside > gu-island:only-child',
    'aside:has(> gu-island):last-child'
  ];

  // Function to aggressively remove banners
  function removeBanners() {
    AD_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element) {
          element.remove();
          console.debug('Removed element:', selector);
        }
      });
    });
  }

  // Run initial cleanup
  removeBanners();

  // Set up aggressive monitoring for dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check if added nodes contain our target elements
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            // Check if the node itself matches our selectors
            AD_SELECTORS.forEach(selector => {
              if (node.matches && node.matches(selector)) {
                node.remove();
                console.debug('Removed dynamically added element:', selector);
              }
            });

            // Check children of the added node
            const elements = node.querySelectorAll(AD_SELECTORS.join(','));
            elements.forEach(element => {
              element.remove();
              console.debug('Removed child element:', element);
            });
          }
        });

        // Run full cleanup after each mutation
        removeBanners();
      }
    });
  });

  // Start observing with aggressive configuration
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  // Inject CSS rules as a backup
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
      z-index: -9999 !important;
      clip: rect(0, 0, 0, 0) !important;
      clip-path: inset(50%) !important;
      transform: translateY(-100%) !important;
      max-height: 0 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
    }
  `;
  document.documentElement.appendChild(style);

  // Run cleanup periodically as a fallback
  setInterval(removeBanners, 1000);
})();

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

  // Define comprehensive selectors targeting both banner variants
  const AD_SELECTORS = [
    // Current banner structure
    'aside:has(> gu-island[name="StickyBottomBanner"])',
    'gu-island[name="StickyBottomBanner"]',
    'aside:has(> gu-island)',
    'aside:last-child:has(gu-island)',
    'aside > gu-island:only-child',

    // End of year banner
    'gu-island[name="UsEoy2024Wrapper"]',
    'aside:has(> gu-island[name="UsEoy2024Wrapper"])',
    'div:has(> gu-island[name="UsEoy2024Wrapper"])',

    // Contribution elements
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
    'div:has(> [name*="contribution"])'
  ];

  // Inject aggressive CSS rules
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
    }
  `;
  document.documentElement.appendChild(style);

  // Aggressive banner removal
  const removeBanners = () => {
    const elements = document.querySelectorAll('aside, gu-island');
    elements.forEach(el => {
      if (el.tagName.toLowerCase() === 'gu-island' ||
          el.querySelector('gu-island') ||
          el.querySelector('fieldset') ||
          el.querySelector('picture')) {
        el.remove();
      }
    });
  };

  // Run immediately and set up continuous monitoring
  removeBanners();
  new MutationObserver(removeBanners).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Set banner heights to 0
  document.documentElement.style.setProperty('--sticky-banner-height', '0px', 'important');
  document.documentElement.style.setProperty('--banner-height', '0px', 'important');
  document.documentElement.style.setProperty('--contributions-banner-height', '0px', 'important');
})();

const scriptBlocker = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeName === 'SCRIPT') {
        const script = node;
        if (script.src && (
          script.src.includes('guardian.web-components') ||
          script.src.includes('island.web') ||
          script.src.includes('island.bundle')
        )) {
          script.remove();
        }
      }
    }
  }
});

scriptBlocker.observe(document.documentElement, {
  childList: true,
  subtree: true
});

const style = document.createElement('style');
style.textContent = `
  ${AD_SELECTORS.join(',\n  ')} {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
    position: fixed !important;
    top: -9999px !important;
    left: -9999px !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    clip: rect(0 0 0 0) !important;
    margin: -1px !important;
    padding: 0 !important;
    border: 0 !important;
    min-height: 0 !important;
    max-height: 0 !important;
  }

  aside,
  gu-island {
    contain: strict !important;
  }

  aside:has(gu-island),
  aside:has(fieldset),
  aside:has(picture) {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
    height: 0 !important;
    min-height: 0 !important;
    max-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 0 !important;
    contain: strict !important;
  }

  body {
    --sticky-banner-height: 0px !important;
    --banner-height: 0px !important;
    --contributions-banner-height: 0px !important;
  }
`;
document.head.appendChild(style);

function removeAds() {
  AD_SELECTORS.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element && element.parentNode) {
        const aside = element.closest('aside');
        if (aside) {
          aside.remove();
        } else if (element.parentNode.tagName.toLowerCase() === 'gu-island') {
          element.parentNode.remove();
        } else {
          element.remove();
        }
      }
    });
  });
}

removeAds();

setInterval(removeAds, 10);

const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      removeAds();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true
});

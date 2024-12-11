(() => {
  // Override prototype methods to prevent banner initialization
  const elementProto = Element.prototype;
  const originalAppendChild = elementProto.appendChild;
  const originalInsertBefore = elementProto.insertBefore;
  const originalSetAttribute = elementProto.setAttribute;

  // Block appendChild for banner elements
  elementProto.appendChild = function(node) {
    if (node && (
      (node.tagName && node.tagName.toLowerCase() === 'gu-island') ||
      (node.getAttribute && node.getAttribute('name') === 'StickyBottomBanner') ||
      (node.parentElement && node.parentElement.tagName && node.parentElement.tagName.toLowerCase() === 'aside')
    )) {
      console.debug('Blocked appendChild of banner element');
      return node;
    }
    return originalAppendChild.call(this, node);
  };

  // Block insertBefore for banner elements
  elementProto.insertBefore = function(node, ref) {
    if (node && (
      (node.tagName && node.tagName.toLowerCase() === 'gu-island') ||
      (node.getAttribute && node.getAttribute('name') === 'StickyBottomBanner')
    )) {
      console.debug('Blocked insertBefore of banner element');
      return node;
    }
    return originalInsertBefore.call(this, node, ref);
  };

  // Block setAttribute for banner-related attributes
  elementProto.setAttribute = function(name, value) {
    if (name === 'name' && (value === 'StickyBottomBanner' || value.includes('Banner'))) {
      console.debug('Blocked setAttribute for banner');
      return;
    }
    return originalSetAttribute.call(this, name, value);
  };

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

const AD_SELECTORS = [
  '.ad-slot',
  '[data-link-name*="advertisement"]',
  '.js-ad-slot',
  '.contributions__epic',
  '.contributions-banner',
  '.site-message--contributions',
  'gu-island[name="TopBar"]',
  'gu-island[name="ExpandableMarketingCardWrapper"]',
  'gu-island[name="StickyBottomBanner"]',
  'gu-island[name="UsEoy2024Wrapper"]',
  '.ad-slot-container',
  '.commercial-unit',
  '.contributions__epic-wrapper',
  '[name="contributions-banner-choice-cards-contribution-frequency"]',
  '[name="contributions-banner-choice-cards-contribution-amount"]',
  'aside > gu-island[name="StickyBottomBanner"]',
  'aside > *',
  'gu-island[name*="Banner"]',
  'div[data-contribution-type]',
  'aside:has(> gu-island[name="StickyBottomBanner"])',
  'aside:has(> gu-island[name*="Banner"])',
  'div:has(> [name*="contribution"])',
  'div:has(> [data-contribution-type])',
  'aside:last-child:has(gu-island)',
  'aside:last-child > gu-island',
  'aside:last-child > gu-island[name="StickyBottomBanner"]',
  'aside > gu-island:only-child',
  'input[name="contributions-banner-choice-cards-contribution-frequency"]',
  'input[name="contributions-banner-choice-cards-contribution-amount"]',
  'fieldset:has(> input[name*="contribution"])',
  'aside:has(fieldset)',
  'aside:last-child:has(gu-island)',
  'div:has(> [data-contribution-type])',
  'div:has(> [name*="contribution"])',
  'aside:has(> gu-island)',
  'aside > *:has(fieldset)',
  'aside:has(picture)',
  'aside:has(button[type="button"])',
  'aside:has(> div:has(fieldset))'
];

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

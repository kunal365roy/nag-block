// Prevent banner initialization
document.documentElement.style.setProperty('--sticky-banner-height', '0px', 'important');
document.documentElement.style.setProperty('--banner-height', '0px', 'important');

// Block web component initialization
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

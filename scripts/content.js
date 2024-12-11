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
  'aside > gu-island:only-child'
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
  }
  aside:has(gu-island[name="StickyBottomBanner"]),
  aside:has(gu-island[name*="Banner"]),
  aside:last-child:has(gu-island) {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
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
          aside.parentNode?.removeChild(aside);
        } else if (element.parentNode.tagName.toLowerCase() === 'gu-island') {
          element.parentNode.remove();
          element.parentNode.parentNode?.removeChild(element.parentNode);
        } else {
          element.remove();
          element.parentNode?.removeChild(element);
        }
      }
    });
  });
}

removeAds();

setInterval(removeAds, 25);

const observer = new MutationObserver((mutations) => {
  const shouldRemoveAds = mutations.some(mutation => {
    const hasNewAds = Array.from(mutation.addedNodes).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return AD_SELECTORS.some(selector =>
          node.matches?.(selector) ||
          node.querySelector?.(selector) ||
          node.closest?.('aside:has(gu-island[name*="Banner"])') ||
          node.closest?.('aside:last-child:has(gu-island)')
        );
      }
      return false;
    });

    if (mutation.target.nodeType === Node.ELEMENT_NODE) {
      return AD_SELECTORS.some(selector =>
        mutation.target.matches?.(selector) ||
        mutation.target.querySelector?.(selector) ||
        mutation.target.closest?.('aside:has(gu-island[name*="Banner"])') ||
        mutation.target.closest?.('aside:last-child:has(gu-island)')
      );
    }

    return hasNewAds;
  });

  if (shouldRemoveAds) {
    removeAds();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  characterData: true
});

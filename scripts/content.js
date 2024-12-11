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
  'div[data-contribution-type]'
];

const style = document.createElement('style');
style.textContent = `
  ${AD_SELECTORS.join(',\n  ')} {
    display: none !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
`;
document.head.appendChild(style);

function removeAds() {
  AD_SELECTORS.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element && element.parentNode) {
        if (element.parentNode.tagName.toLowerCase() === 'gu-island' ||
            element.parentNode.tagName.toLowerCase() === 'aside') {
          element.parentNode.remove();
        } else {
          element.remove();
        }
      }
    });
  });
}

removeAds();

setInterval(removeAds, 100);

const observer = new MutationObserver((mutations) => {
  const shouldRemoveAds = mutations.some(mutation => {
    const hasNewAds = Array.from(mutation.addedNodes).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return AD_SELECTORS.some(selector =>
          node.matches?.(selector) || node.querySelector?.(selector)
        );
      }
      return false;
    });

    if (mutation.target.nodeType === Node.ELEMENT_NODE) {
      return AD_SELECTORS.some(selector =>
        mutation.target.matches?.(selector) || mutation.target.querySelector?.(selector)
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

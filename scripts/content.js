const AD_SELECTORS = [
  '.ad-slot',
  '[data-link-name*="advertisement"]',
  '.js-ad-slot',
  '.contributions__epic',
  '.contributions-banner',
  '.site-message--contributions',
  'gu-island[name="TopBar"]',
  'gu-island[name="ExpandableMarketingCardWrapper"]',
  '.ad-slot-container',
  '.commercial-unit',
  '.contributions__epic-wrapper'
];

function removeAds() {
  AD_SELECTORS.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element && element.parentNode) {
        element.remove();
      }
    });
  });
}

removeAds();

const observer = new MutationObserver((mutations) => {
  const shouldRemoveAds = mutations.some(mutation => {
    return Array.from(mutation.addedNodes).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return AD_SELECTORS.some(selector =>
          node.matches?.(selector) || node.querySelector?.(selector)
        );
      }
      return false;
    });
  });

  if (shouldRemoveAds) {
    removeAds();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

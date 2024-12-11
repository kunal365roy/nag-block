const AD_SELECTORS = [
  '.ad-slot',
  '[data-link-name*="advertisement"]',
  '.js-ad-slot',
  '.contributions__epic',
  '.contributions-banner',
  '.site-message--contributions',
  'gu-island[name="TopBar"]',
  'gu-island[name="ExpandableMarketingCardWrapper"]',
  'gu-island[name="StickyBottomBanner"]',  // Add sticky banner wrapper
  'gu-island[name="UsEoy2024Wrapper"]',    // Keep fundraising banner wrapper
  '.ad-slot-container',
  '.commercial-unit',
  '.contributions__epic-wrapper',
  '[name="contributions-banner-choice-cards-contribution-frequency"]',  // Update form element names
  '[name="contributions-banner-choice-cards-contribution-amount"]',     // Update form element names
  'aside > gu-island'  // Catch any other fundraising banners in asides
];

function removeAds() {
  AD_SELECTORS.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element && element.parentNode) {
        // Also remove parent if it's a container
        if (element.parentNode.tagName.toLowerCase() === 'gu-island') {
          element.parentNode.remove();
        } else {
          element.remove();
        }
      }
    });
  });
}

// Initial removal
removeAds();

// Continuous check every 500ms for dynamically loaded content
setInterval(removeAds, 500);

// Monitor DOM changes
const observer = new MutationObserver((mutations) => {
  const shouldRemoveAds = mutations.some(mutation => {
    // Check added nodes
    const hasNewAds = Array.from(mutation.addedNodes).some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return AD_SELECTORS.some(selector =>
          node.matches?.(selector) || node.querySelector?.(selector)
        );
      }
      return false;
    });

    // Also check if the mutation target itself matches our selectors
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
  attributes: true,  // Monitor attribute changes
  characterData: true  // Monitor text content changes
});

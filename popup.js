document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const statusDiv = document.getElementById('status');
  const currentTab = tabs[0];

  if (currentTab.url.includes('theguardian.com')) {
    statusDiv.textContent = 'Active on The Guardian';
  } else {
    statusDiv.textContent = 'Inactive - Not a Guardian page';
    statusDiv.style.backgroundColor = '#fff3e0';
    statusDiv.style.color = '#e65100';
  }
});

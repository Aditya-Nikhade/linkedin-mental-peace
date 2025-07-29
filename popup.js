document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('enabled');

  // Restore toggle state
  chrome.storage.local.get("linkedinFilterEnabled", (data) => {
    toggle.checked = data.linkedinFilterEnabled !== false;
  });

  // Save toggle and notify content script
  toggle.addEventListener('change', (e) => {
    const newState = e.target.checked;
    chrome.storage.local.set({ linkedinFilterEnabled: newState });

    // Send message to the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "TOGGLE_FILTER",
        enabled: newState
      });
    });
  });
});

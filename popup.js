document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('enabled');

  // Restore saved toggle state
  chrome.storage.local.get("linkedinFilterEnabled", (data) => {
    toggle.checked = data.linkedinFilterEnabled !== false;
  });

  toggle.addEventListener('change', (e) => {
    const newState = e.target.checked;

    // Save new state
    chrome.storage.local.set({ linkedinFilterEnabled: newState });

    // Send message only if the current tab is LinkedIn
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url || !tab.url.includes("linkedin.com")) {
        console.warn("Not a LinkedIn tab. Skipping message.");
        return;
      }

      chrome.tabs.sendMessage(tab.id, {
        type: "TOGGLE_FILTER",
        enabled: newState
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("⚠️ No content script to receive message:", chrome.runtime.lastError.message);
        }
      });
    });
  });
});

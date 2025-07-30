//add the banned words and phrases below as you wish.👇🏼

const bannedWords = [
  "excited", "thrilled", "congratulations", "maang", "faang",
  "google", "meta", "layoffs", "grateful", "Tier 3"
];

const bannedPhrases = [
  "excited to announce",
  "i will be joining",
  "i am happy to share that",
  "i'm happy to share that",
  "proud to share",
  "humbled to be",
  "thrilled to join",
  "grateful for the opportunity",
  "wonderful experience"
];

function hideBuzzwordwalePosts() {
  const posts = document.querySelectorAll('div.feed-shared-update-v2');

  posts.forEach((post) => {
    const text = post.innerText.toLowerCase();
    if (bannedWords.some(word => text.includes(word)) ||
        bannedPhrases.some(phrase => text.includes(phrase))) {
      post.style.display = "none";
    }
  });
}

// Initial check on load
chrome.storage.local.get("linkedinFilterEnabled", (data) => {
  const isEnabled = data.linkedinFilterEnabled;
  if (isEnabled === false) {
    console.log("🟡 LinkedIn Filter is OFF");
    return;
  }

  console.log("🟢 LinkedIn Filter is ON");
  hideBuzzwordwalePosts();

  const observer = new MutationObserver(hideBuzzwordwalePosts);
  observer.observe(document.body, { childList: true, subtree: true });
});

// Listen for live toggle updates from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE_FILTER") {
    if (message.enabled) {
      console.log("✅ Filter enabled from popup");
      hideBuzzwordwalePosts();

      const observer = new MutationObserver(hideBuzzwordwalePosts);
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      console.log("❌ Filter disabled from popup");
      const posts = document.querySelectorAll('div.feed-shared-update-v2');
      posts.forEach(post => post.style.display = "");
    }
  }
});

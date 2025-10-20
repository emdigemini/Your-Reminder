const cacheName = "your-app-v0.50"; // incremented for cache refresh

const assets = [
  "./",
  "./index.html",
  "./manifest.json",

  // CSS
  "./styles/style.css",
  "./styles/about.css",
  "./styles/animation.css",
  "./styles/contact.css",
  "./styles/goals.css",
  "./styles/notes.css",
  "./styles/noteTab.css",
  "./styles/reminder.css",
  "./styles/settings.css",
  "./styles/tasks.css",
  
  // JS (main + core scripts)
  "./scripts/script.js",
  "./scripts/about.js",
  "./scripts/animation.js",
  "./scripts/clock.js",
  "./scripts/contact.js",
  "./scripts/popState.js",
  "./scripts/settings.js",

  // Feature modules
  "./scripts/Goals/goals.js",
  "./scripts/Goals/utils/filter.js",
  "./scripts/Goals/icon/icons8-unit.png",
  "./scripts/Notes/notes.js",
  "./scripts/Reminder/reminder.js",
  "./scripts/Tasks/tasks.js",
  "./scripts/quotes-generator/quotes.js"
];

// ✅ INSTALL EVENT
self.addEventListener("install", (event) => {
  console.log("🛠️ Service Worker installing...");

  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      for (const asset of assets) {
        try {
          const response = await fetch(asset);
          if (response.ok) {
            await cache.put(asset, response);
            console.log(`✅ Cached: ${asset}`);
          } else {
            console.warn(`⚠️ Skipped ${asset}: ${response.status}`);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to fetch ${asset}: ${err.message}`);
        }
      }
    })()
  );

  self.skipWaiting(); // Activate immediately
});

// ✅ ACTIVATE EVENT
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activating...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== cacheName)
          .map((oldKey) => {
            console.log(`🧹 Deleting old cache: ${oldKey}`);
            return caches.delete(oldKey);
          })
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

// ✅ FETCH EVENT
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // return from cache
      }
      // fetch from network if not cached
      return fetch(event.request).catch(() =>
        caches.match("./index.html")
      );
    })
  );
});

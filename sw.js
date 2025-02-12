const CACHE_NAME = "todo-list-v1";
const ASSETS = [
    "/", 
    "/index.html",
    "/styles.css", 
    "/script.js",
    "/favicon.ico",
    "/icons/icon-192x192.png", 
    "/icons/icon-512x512.png"
];

// Install event: Caches app shell files
self.addEventListener("install", (event) => {
    console.log("Service Worker: Installing...");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Caching files...");
            return cache.addAll(ASSETS);
        })
    );
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activated");

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Deleting old cache", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve cached files when offline
self.addEventListener("fetch", (event) => {
    console.log("Service Worker: Fetching", event.request.url);

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(() => {
            console.log("Service Worker: Network request failed, serving cached content if available.");
        })
    );
});

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("todo-cache").then((cache) => {
            return cache.addAll(["index.html", "styles.css", "script.js", "manifest.json"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
self.addEventListener("install", (event) => {
    console.log("Service Worker Installed");
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated");
});

self.addEventListener("fetch", (event) => {
    console.log("Fetching:", event.request.url);
});

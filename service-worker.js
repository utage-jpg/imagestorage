self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("cache-v1").then((cache) =>
      cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => response);

        return response || fetchPromise;
      })
    )
  );
});

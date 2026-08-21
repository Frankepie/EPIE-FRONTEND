const CACHE_NAME = "edulearn-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png"
];


// ==========================================
// INSTALL
// ==========================================

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then((cache) => {

        return cache.addAll(APP_SHELL);

      })

  );

  self.skipWaiting();

});


// ==========================================
// ACTIVATE
// ==========================================

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys()
      .then((cacheNames) => {

        return Promise.all(

          cacheNames
            .filter(
              (cacheName) =>
                cacheName !== CACHE_NAME
            )
            .map(
              (cacheName) =>
                caches.delete(cacheName)
            )

        );

      })

  );

  self.clients.claim();

});


// ==========================================
// FETCH
// ==========================================

self.addEventListener("fetch", (event) => {

  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }


  // Handle page navigation
  if (
    event.request.mode === "navigate"
  ) {

    event.respondWith(

      fetch(event.request)
        .catch(() => {

          return caches.match(
            "/index.html"
          );

        })

    );

    return;

  }


  // Handle other resources
  event.respondWith(

    caches.match(event.request)
      .then((cachedResponse) => {

        if (cachedResponse) {

          return cachedResponse;

        }


        return fetch(event.request)
          .then((response) => {

            return response;

          });

      })

  );

});
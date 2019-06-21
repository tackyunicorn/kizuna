const staticCache = `site-static-v1`;

const assets = [
    '/css/styles.css',
    '/img/loading.gif',
    '/img/sad-pug.png',
    '/js/comments.js',
    '/js/delete-post.js',
    '/js/follow-unfollow.js',
    '/js/lazy-load.js',
    '/js/likes.js',
    '/js/registerServiceWorker.js',
    '/js/search.js',
    '/js/ui.js',
    '/js/upload.js',
    '/pages/fallback.html',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

// install service worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCache).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCache)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse => {
            return cacheResponse || fetch(evt.request).catch(() => caches.match('/pages/fallback.html'));
        })
    );
});
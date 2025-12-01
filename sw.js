// --- sw.js ---

// 1. UPDATE THE PATH TO MATCH YOUR REPO NAME
var GHPATH = '/PWA-new'; 

var APP_PREFIX = 'gppwa_';
var VERSION = 'version_004'; // I bumped the version so the browser sees the change

var URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/Css/style.css`,  
    `${GHPATH}/JS/script.js`    
];
    
    // I COMMENTED THIS OUT TO PREVENT THE CRASH
    // Uncomment this line ONLY if you are sure the file exists on GitHub
    // , `${GHPATH}/images/android-chrome-192x192.png` 
];

var CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Installing cache : ' + CACHE_NAME);
            return cache.addAll(URLS);
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheWhitelist.push(CACHE_NAME);
            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheWhitelist.indexOf(key) === -1) {
                        console.log('Deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

// --- THIS IS WHERE THE API LOGIC GOES ---
self.addEventListener('fetch', function (e) {
    
    // 1. Check if the URL is your AI API
    if (e.request.url.includes('pollinations.ai')) {
        // STRATEGY: Network Only
        // Always go to the internet for the AI image. Never cache it.
        e.respondWith(
            fetch(e.request).catch(() => {
                console.log("Offline: Cannot generate AI image");
            })
        );
        return; // Stop here, don't run the cache code below
    }

    // 2. Standard Cache Strategy for everything else (HTML, CSS, JS)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('Responding with cache : ' + e.request.url);
                return request;
            } else {
                console.log('File is not cached, fetching : ' + e.request.url);
                return fetch(e.request);
            }
        })
    );
});
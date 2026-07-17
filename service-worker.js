// ============================================
// SERVICE WORKER 📲
// This is a special script that runs in the background, completely
// separate from the actual web page — it keeps running even after
// the page itself is closed. Its superpower is sitting quietly
// BETWEEN the browser and the internet: it can save a copy of
// files the first time they're downloaded into a special browser
// storage called a "cache," so next time, instead of asking the
// real internet for them again, the browser can just hand back
// that SAVED copy instantly — even with no internet connection at
// all. That's what makes a website "installable" and usable
// offline, instead of only ever working while online.
//
// This file has to sit in the same folder as index.html (not
// tucked away anywhere else) — a service worker can only ever
// watch over files in its own folder and whatever's inside it.
// ============================================

// Bumping this name (for example, to 'ino-cache-v3' next time) is
// the on/off switch for "throw out the old saved files and grab
// fresh ones" — do that after making a real update to index.html
// or any file listed below, so visitors don't get stuck seeing a
// stale copy of the page forever. This name was bumped from v1 to
// v2 specifically because index.html changed but the cached copy
// didn't know that yet — see the "skipWaiting" note further down
// for the other half of that same fix.
var CACHE_NAME = 'ino-cache-v2';

// Just enough files to make the page still open and look like
// itself with zero internet connection — not every single photo
// on the site, just the essentials.
var FILES_TO_CACHE = [
  './',
  './index.html',
  './crown.png',
  './ino-pfp.jpg'
];

// "install" fires exactly once, every time a NEW version of this
// exact file (service-worker.js) shows up — this is where we reach
// out and save our starter list of files into a fresh cache.
// "self.skipWaiting()" tells the browser "don't wait for every open
// tab of the old site to be closed first — put this new version in
// charge right away." Without it, a returning visitor could still
// see the OLD cached page for a while even after a real update went
// out, simply because they never fully closed their old tab.
self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// "activate" fires right after "install," and is the correct
// moment to clean up any OLD, no-longer-needed caches left behind
// by a previous version of this file (any cache whose name doesn't
// match the current CACHE_NAME above). "self.clients.claim()" is
// the other half of the "take over immediately" fix above — it
// hands this new service worker control of any already-open tabs
// right away, instead of only affecting the NEXT time the site is
// opened.
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// "fetch" fires every single time the page asks for ANY file at
// all (images, the HTML itself, fonts, everything). This is a
// "cache-first" strategy: check the cache first, and only ask the
// real internet if that exact file isn't saved yet — which is
// both a little faster AND is the actual mechanism that makes
// offline browsing possible in the first place.
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});

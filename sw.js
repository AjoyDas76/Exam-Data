// পরীক্ষার হল — অ্যাপ শেল ক্যাশিং সার্ভিস ওয়ার্কার
// নতুন করে ডিপ্লয় করলে CACHE_NAME এর ভার্সন নম্বর বাড়িয়ে দিন,
// তাহলে পুরনো ক্যাশ মুছে নতুন ফাইল লোড হবে।
const CACHE_NAME = 'exam-hall-shell-v4';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// এইসব ডোমেইনের রিকোয়েস্ট কখনো ক্যাশ করা হবে না — সবসময় লাইভ নেটওয়ার্কে যাবে
// (Firebase রিয়েল-টাইম ডাটা, তাই ক্যাশ করলে পুরনো/ভুল তথ্য দেখাতে পারে)
const NEVER_CACHE_HOSTS = ['firebaseio.com', 'googleapis.com', 'firebase.google.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {}) // ইন্টারনেট না থাকলেও ইনস্টল যেন ব্যর্থ না হয়
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (NEVER_CACHE_HOSTS.some((h) => url.hostname.includes(h))) return; // Firebase — হাত দেওয়া হবে না

  // পেজ নেভিগেশন: আগে নেটওয়ার্ক চেষ্টা করুন, অফলাইনে ক্যাশ করা index.html দেখান
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // বাকি সবকিছু (CSS/JS/ফন্ট/CDN লাইব্রেরি/আইকন): আগে ক্যাশ, না পেলে নেটওয়ার্ক থেকে এনে ক্যাশে রাখুন
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});

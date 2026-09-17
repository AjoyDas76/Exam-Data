// পরীক্ষার হল — অ্যাপ শেল ক্যাশিং সার্ভিস ওয়ার্কার
// নতুন করে ডিপ্লয় করলে CACHE_NAME এর ভার্সন নম্বর বাড়িয়ে দিন,
// তাহলে পুরনো ক্যাশ মুছে নতুন ফাইল লোড হবে।
const CACHE_NAME = 'exam-hall-shell-v6';
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


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

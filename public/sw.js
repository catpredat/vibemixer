const CACHE_NAME = 'vibemixer-v1';

// รายการไฟล์ที่ต้องการให้ใช้งานได้ทันทีแม้ไม่มีเน็ต (Static Assets)
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/globals.css',
  // ใส่ path ของ icon หรือ font ที่คุณใช้ในโปรเจกต์ตรงนี้
];

self.addEventListener('install', (e) => {
  console.log('VibeMixer Service Worker: Installed');
  // บังคับให้เก็บไฟล์ลง Cache ทันทีที่ติดตั้ง
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('VibeMixer: Caching Shell Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('VibeMixer Service Worker: Activated');
  // ลบ Cache เก่าทิ้งเมื่อมีการอัปเดตเวอร์ชัน (เปลี่ยนชื่อ CACHE_NAME)
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // กลยุทธ์: Cache First, Falling back to Network
  // ถ้าเจอในเครื่องให้เอามาโชว์ก่อน ถ้าไม่เจอค่อยไปโหลดจากเน็ต
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(e.request).then((networkResponse) => {
        // ถ้าโหลดจากเน็ตสำเร็จ ให้แอบเก็บไฟล์นั้นลง Cache ไว้ใช้ครั้งหน้าด้วย
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // กรณีเน็ตหลุดและไม่มีใน Cache (เช่น ไฟล์ที่ยังไม่เคยเปิด)
      // แอปจะยังเปิดขึ้น แต่ไฟล์นั้นอาจจะเล่นไม่ได้
    })
  );
});
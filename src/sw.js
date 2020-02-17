import {precacheAndRoute} from 'workbox-precaching/precacheAndRoute.mjs';

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
precacheAndRoute(self.__WB_MANIFEST);

import './css/tailwind.pcss';
import App from './App.svelte';
import {Workbox} from 'workbox-window';

const app = new App({
  target: document.body,
});

window.addEventListener('hashchange', () => {
  app.handleHash(window.location.hash);
});
app.handleHash(window.location.hash);

window.addEventListener('beforeinstallprompt', e => {
  e.userChoice.then(() => {
    app.$set({deferredPrompt: null});
  });
  app.$set({deferredPrompt: e});
});

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.js');

  wb.addEventListener('waiting', () => {
    app.$set({hasUpdate: true});
    app.$on('doUpdate', () => {
      wb.addEventListener('controlling', () => {
        window.location.reload();
      });
      wb.messageSW({type: 'SKIP_WAITING'});
    });
  });

  wb.register();
}

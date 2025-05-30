importScripts(
  "https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBj2D3Vrw6EtB2LtqNq8fPPOg0D-E3ESDM",
  authDomain: "evently-aa407.firebaseapp.com",
  projectId: "evently-aa407",
  storageBucket: "evently-aa407.firebasestorage.app",
  messagingSenderId: "532802052003",
  appId: "1:532802052003:web:49ef0ea05709c44bbc0416",
  measurementId: "G-564KBD4CLQ",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  self.clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "PUSH_NOTIFICATION",
          payload,
        });
      });
    });
});

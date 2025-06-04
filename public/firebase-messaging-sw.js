self.addEventListener("push", function (event) {
  const data = event.data?.json();
  console.log("[Service Worker] Push received:", data);

  const options = {
    body: data.body,
    icon: "/assets/notificationIcon.svg",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received:", event.notification);

  const targetUrl = event.notification.data?.url || "/";
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});

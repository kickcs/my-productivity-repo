// Service Worker for Push Notifications

self.addEventListener("push", (event) => {
  console.log("[SW] Push received");

  if (!event.data) {
    console.log("[SW] No data in push event");
    return;
  }

  let data;
  try {
    data = event.data.json();
    console.log("[SW] Push data:", data);
  } catch (e) {
    console.error("[SW] Failed to parse push data:", e);
    data = { title: "Оценка дня", body: event.data.text() };
  }

  const options = {
    body: data.body || "Не забудьте оценить свой день!",
    icon: "/icons/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: [
      {
        action: "rate",
        title: "Оценить день",
      },
      {
        action: "close",
        title: "Закрыть",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Оценка дня", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(clients.claim());
});

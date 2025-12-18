"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pushApi } from "../api";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

export const pushKeys = {
  subscription: ["push-subscription"] as const,
};

export function usePushNotifications() {
  const queryClient = useQueryClient();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);

      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  // Check if user has subscription in database
  const { data: hasSubscription = false, isLoading: isCheckingSubscription } = useQuery({
    queryKey: pushKeys.subscription,
    queryFn: () => pushApi.hasSubscription(),
    enabled: isSupported,
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!registration) throw new Error("Service Worker not registered");

      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Get push subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("Invalid subscription");
      }

      // Save to database
      await pushApi.saveSubscription({
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      });

      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pushKeys.subscription });
    },
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      if (!registration) throw new Error("Service Worker not registered");

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await pushApi.deleteSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pushKeys.subscription });
    },
  });

  const subscribe = useCallback(() => {
    subscribeMutation.mutate();
  }, [subscribeMutation]);

  const unsubscribe = useCallback(() => {
    unsubscribeMutation.mutate();
  }, [unsubscribeMutation]);

  return {
    isSupported,
    permission,
    hasSubscription,
    isLoading: isCheckingSubscription || subscribeMutation.isPending || unsubscribeMutation.isPending,
    subscribe,
    unsubscribe,
    error: subscribeMutation.error || unsubscribeMutation.error,
  };
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pushApi } from "../api";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushKeys = {
  subscription: ["push-subscription"] as const,
};

export function usePushNotifications() {
  const queryClient = useQueryClient();
  const initStarted = useRef(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [localSubscription, setLocalSubscription] = useState<PushSubscription | null>(null);

  // Check if push notifications are supported and get local subscription
  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    setIsSupported(supported);

    if (!supported) {
      setIsInitializing(false);
      return;
    }

    setPermission(Notification.permission);

    const initServiceWorker = async () => {
      try {
        // Check if already registered first (faster)
        const existingReg = await navigator.serviceWorker.getRegistration("/sw.js");

        if (existingReg) {
          setRegistration(existingReg);
          const sub = await existingReg.pushManager.getSubscription();
          setLocalSubscription(sub);
        } else {
          const reg = await navigator.serviceWorker.register("/sw.js");
          setRegistration(reg);

          if (reg.active) {
            const sub = await reg.pushManager.getSubscription();
            setLocalSubscription(sub);
          }
        }
      } catch (err) {
        console.error("Service Worker initialization failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    // Defer initialization to not block render
    if ("requestIdleCallback" in window) {
      const windowWithIdle = window as Window & {
        requestIdleCallback: (callback: () => void, options?: { timeout: number }) => number;
      };
      windowWithIdle.requestIdleCallback(() => initServiceWorker(), { timeout: 2000 });
    } else {
      setTimeout(initServiceWorker, 100);
    }
  }, []);

  // Check if THIS browser's subscription exists in database
  const { data: hasSubscription = false, isLoading: isCheckingSubscription } = useQuery({
    queryKey: pushKeys.subscription,
    queryFn: async () => {
      if (!localSubscription) return false;
      // Check if this specific endpoint is in the database
      return pushApi.hasSubscriptionForEndpoint(localSubscription.endpoint);
    },
    enabled: isSupported && localSubscription !== null,
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      if (!registration) {
        throw new Error("Service Worker not registered");
      }

      // Wait for Service Worker to be active
      if (registration.installing || registration.waiting) {
        await new Promise<void>((resolve) => {
          const sw = registration.installing || registration.waiting;
          if (!sw) {
            resolve();
            return;
          }
          sw.addEventListener("statechange", () => {
            if (sw.state === "activated") {
              resolve();
            }
          });
          if (registration.active) {
            resolve();
          }
        });
      }

      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== "granted") {
        throw new Error("Notification permission denied");
      }

      // Get push subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        if (!VAPID_PUBLIC_KEY) {
          throw new Error("VAPID_PUBLIC_KEY is not configured");
        }
        const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as BufferSource,
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
    onSuccess: (subscription) => {
      setLocalSubscription(subscription);
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
      setLocalSubscription(null);
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
    isInitializing,
    permission,
    hasSubscription,
    isLoading: isCheckingSubscription || subscribeMutation.isPending || unsubscribeMutation.isPending,
    subscribe,
    unsubscribe,
    error: subscribeMutation.error || unsubscribeMutation.error,
  };
}

"use client";

import { IconBell, IconBellOff, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { usePushNotifications } from "../model";

export function NotificationToggle() {
  const {
    isSupported,
    permission,
    hasSubscription,
    isLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <Button variant="outline" className="w-full justify-start gap-3" disabled>
        <IconBellOff className="size-4" />
        Уведомления не поддерживаются
      </Button>
    );
  }

  if (permission === "denied") {
    return (
      <Button variant="outline" className="w-full justify-start gap-3" disabled>
        <IconBellOff className="size-4" />
        Уведомления заблокированы
      </Button>
    );
  }

  if (hasSubscription) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start gap-3"
        onClick={unsubscribe}
        disabled={isLoading}
      >
        {isLoading ? (
          <IconLoader2 className="size-4 animate-spin" />
        ) : (
          <IconBell className="size-4 text-primary" />
        )}
        Уведомления включены
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3"
      onClick={subscribe}
      disabled={isLoading}
    >
      {isLoading ? (
        <IconLoader2 className="size-4 animate-spin" />
      ) : (
        <IconBellOff className="size-4" />
      )}
      Включить уведомления
    </Button>
  );
}

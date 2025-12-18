"use client";

import { useState } from "react";
import { IconSend, IconLoader2, IconCheck } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { pushApi } from "../api";

export function TestNotificationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendTest = async () => {
    setIsLoading(true);
    setError(null);
    setSent(false);

    try {
      await pushApi.sendTestNotification();
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3"
      onClick={handleSendTest}
      disabled={isLoading}
    >
      {isLoading ? (
        <IconLoader2 className="size-4 animate-spin" />
      ) : sent ? (
        <IconCheck className="size-4 text-green-500" />
      ) : (
        <IconSend className="size-4" />
      )}
      {sent ? "Отправлено!" : error ? error : "Отправить тестовое уведомление"}
    </Button>
  );
}

"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui";
import { ExportButton } from "@/features/export-data";
import { ClearDataButton } from "@/features/clear-data";
import { SignOutButton } from "@/features/auth";
import { NotificationToggle, TestNotificationButton } from "@/features/push-notifications";
import { BottomNav } from "@/widgets/bottom-navigation";

export function SettingsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="flex items-center justify-center px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-sm font-bold tracking-wide">Настройки</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Напоминание оценить день в 9:00</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationToggle />
              <TestNotificationButton />
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Данные</CardTitle>
              <CardDescription>Управление вашими записями</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ExportButton />
              <ClearDataButton />
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle>Аккаунт</CardTitle>
              <CardDescription>Управление учетной записью</CardDescription>
            </CardHeader>
            <CardContent>
              <SignOutButton />
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>О приложении</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-muted-foreground">
                <IconInfoCircle className="size-5" />
                <div className="text-sm">
                  <p>Оценка дня v1.0</p>
                  <p className="text-xs mt-1">
                    Приложение для отслеживания качества дней
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

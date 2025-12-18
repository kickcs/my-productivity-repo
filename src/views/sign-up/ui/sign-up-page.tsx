"use client";

import Link from "next/link";
import { SignUpForm } from "@/features/auth";
import { routes } from "@/shared/config/routes";

export function SignUpPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Регистрация</h1>
            <p className="text-muted-foreground text-sm">
              Создайте новый аккаунт
            </p>
          </div>

          <SignUpForm />

          <p className="text-center text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              href={routes.signIn}
              className="text-primary hover:underline font-medium"
            >
              Войти
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

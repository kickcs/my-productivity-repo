"use client";

import Link from "next/link";
import { SignInForm } from "@/features/auth";
import { routes } from "@/shared/config/routes";

export function SignInPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Вход</h1>
            <p className="text-muted-foreground text-sm">
              Войдите в свой аккаунт
            </p>
          </div>

          <SignInForm />

          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              href={routes.signUp}
              className="text-primary hover:underline font-medium"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

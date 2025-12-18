"use client";

import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { Button, Input, Label } from "@/shared/ui";
import { useSignUp } from "../model/use-auth";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const signUp = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    signUp.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="h-10"
        />
      </div>

      {(error || signUp.error) && (
        <p className="text-sm text-destructive">
          {error || signUp.error?.message}
        </p>
      )}

      <Button type="submit" className="w-full h-10" disabled={signUp.isPending}>
        {signUp.isPending && (
          <IconLoader2 className="size-4 mr-2 animate-spin" />
        )}
        Создать аккаунт
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { Button, Input, Label } from "@/shared/ui";
import { useSignIn } from "../model/use-auth";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate({ email, password });
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

      {signIn.error && (
        <p className="text-sm text-destructive">{signIn.error.message}</p>
      )}

      <Button type="submit" className="w-full h-10" disabled={signIn.isPending}>
        {signIn.isPending && (
          <IconLoader2 className="size-4 mr-2 animate-spin" />
        )}
        Войти
      </Button>
    </form>
  );
}

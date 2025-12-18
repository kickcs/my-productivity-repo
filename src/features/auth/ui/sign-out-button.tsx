"use client";

import { IconLogout, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { useSignOut } from "../model/use-auth";

interface SignOutButtonProps {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export function SignOutButton({ variant = "destructive" }: SignOutButtonProps) {
  const signOut = useSignOut();

  return (
    <Button
      variant={variant}
      onClick={() => signOut.mutate()}
      disabled={signOut.isPending}
      className="w-full justify-start gap-3"
    >
      {signOut.isPending ? (
        <IconLoader2 className="size-4 animate-spin" />
      ) : (
        <IconLogout className="size-4" />
      )}
      Выйти из аккаунта
    </Button>
  );
}

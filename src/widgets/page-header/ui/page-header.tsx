"use client";

import { IconX, IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/shared/ui";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightAction?: React.ReactNode;
}

export function PageHeader({
  title,
  onBack,
  onClose,
  rightAction,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      {onClose ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <IconX className="size-5" />
        </Button>
      ) : onBack ? (
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onBack}
          className="rounded-md"
        >
          <IconArrowLeft className="size-4" />
        </Button>
      ) : (
        <div className="w-10" />
      )}
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {rightAction || <div className="w-10" />}
    </header>
  );
}

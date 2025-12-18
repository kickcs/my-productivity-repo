"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendarEvent,
  IconCalendarMonth,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/shared/lib";
import { routes } from "@/shared/config/routes";

interface NavItem {
  href: string;
  icon: typeof IconCalendarEvent;
  label: string;
}

const navItems: NavItem[] = [
  { href: routes.home, icon: IconCalendarEvent, label: "Запись" },
  { href: routes.history, icon: IconCalendarMonth, label: "История" },
  { href: routes.analytics, icon: IconChartBar, label: "Анализ" },
  { href: routes.settings, icon: IconSettings, label: "Настройки" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-background/95 backdrop-blur-lg border-t border-border pb-6 pt-3 px-6 flex justify-between items-center z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 w-16 transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              className="size-6"
              stroke={1.5}
              fill={isActive ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

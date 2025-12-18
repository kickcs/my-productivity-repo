"use client";

import { use } from "react";
import { RateDayPage } from "@/views/rate";

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function Page({ params }: PageProps) {
  const { date } = use(params);
  return <RateDayPage date={date} />;
}

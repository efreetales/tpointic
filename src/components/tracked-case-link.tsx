"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackCaseEvent } from "@/lib/track-case";

// Link do painel de case da home que registra o clique (`case_events`).
export function TrackedCaseLink({
  slug,
  position,
  ...props
}: { slug: string; position: number } & ComponentProps<typeof Link>) {
  return <Link {...props} onClick={() => trackCaseEvent(slug, "click", position)} />;
}

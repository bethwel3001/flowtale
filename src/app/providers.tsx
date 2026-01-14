"use client";

import { StoryProvider } from "@/lib/story-context";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoryProvider>
      {children}
      <Toaster />
    </StoryProvider>
  );
}

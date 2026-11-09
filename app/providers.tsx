"use client"

import { NarrationProvider } from '@/components/activity/narration'

export function Providers({ children }: { children: React.ReactNode }) {
  return <NarrationProvider>{children}</NarrationProvider>
}

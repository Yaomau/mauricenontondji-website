'use client';

import { ThemeProvider } from 'next-themes';
import { type ReactNode } from 'react';

export default function RootClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
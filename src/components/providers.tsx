'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import { type ReactNode } from 'react';

export function Providers({ children, themeProps }: { children: ReactNode; themeProps?: ThemeProviderProps }) {
  return (
    <NextAuthSessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
        {...themeProps}
      >
        {children}
      </NextThemesProvider>
    </NextAuthSessionProvider>
  );
}
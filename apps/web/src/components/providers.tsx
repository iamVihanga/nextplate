"use client";

import * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
  // return (
  //   <NextThemesProvider
  //     attribute="class"
  //     defaultTheme="system"
  //     enableSystem
  //     disableTransitionOnChange
  //     enableColorScheme
  //   >
  //     {children}
  //   </NextThemesProvider>
  // );
}

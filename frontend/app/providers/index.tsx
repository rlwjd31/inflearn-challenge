"use client";

import JotaiProvider from "@/app/providers/JotaiProvider";
import ReactQueryProvider from "@/app/providers/ReactQueryProvider";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <JotaiProvider>{children}</JotaiProvider>
    </ReactQueryProvider>
  );
}

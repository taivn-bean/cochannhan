"use client";

import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 24 * 60 * 60 * 1000, // 24h
          },
        },
      })
  );

  useEffect(() => {
    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient,
      persister,
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

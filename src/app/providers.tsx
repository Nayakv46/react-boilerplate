import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      gcTime: 0,
      // Allow consumers to provide `onSuccess`/`onError` handlers per-query
      // or rely on these global no-ops. Tests can inject a QueryClient to
      // observe or stub these callbacks.
      // provide a safe default meta shape so callers can pass `{ meta: { onSuccess, onError } }`
      meta: {} as Record<string, unknown>,
    },
  },
});

// Subscribe to the query cache and dispatch any per-query meta callbacks if present.
// React Query does not automatically execute functions stored in `meta`, so we
// wire them here. Use `any` for the event to avoid strict typings tied to react-query internals.
// Track last observed status per query so we only call callbacks on transitions.
const lastStatusByQuery = new WeakMap<any, string | undefined>();
defaultQueryClient.getQueryCache().subscribe((event: any) => {
  try {
    const query = event?.query;
    if (!query) return;

    const meta = query.options?.meta as any;
    const state = query.state || {};
    const last = lastStatusByQuery.get(query);
    const current = state?.status;

    // Only act when the status transitions
    if (current === last) return;

    // On transition to success
    if (current === "success" && typeof meta?.onSuccess === "function") {
      try {
        meta.onSuccess(state.data);
      } catch (err) {
        console.error("meta.onSuccess threw:", err);
      }
    }

    // On transition to error
    if (current === "error" && typeof meta?.onError === "function") {
      try {
        meta.onError(state.error);
      } catch (err) {
        console.error("meta.onError threw:", err);
      }
    }

    lastStatusByQuery.set(query, current);
  } catch (err) {
    // ignore subscription errors
  }
});

// Wrapper provider component for i.e. React Query, i18n, ...
export const AppProviders = ({
  children,
  queryClient = defaultQueryClient,
  disableQueryClient = false,
}: {
  children: ReactNode;
  queryClient?: QueryClient;
  disableQueryClient?: boolean;
}) => {
  if (disableQueryClient) return <>{children}</>;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      {/* 1. Put PersistGate first so Redux state hydrates instantly before anything else triggers */}
      <PersistGate loading={<p>loading.......</p>} persistor={persistor}>
        {/* 2. Put SessionProvider inside so it can use hydrated states if necessary */}
        <SessionProvider>
          {/* 3. React Query wraps your inner children layouts */}
          <QueryClientProvider client={queryClient}>
            <div className="flex min-h-screen flex-col w-full overflow-auto min-h-0">
              {children}
            </div>
          </QueryClientProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}
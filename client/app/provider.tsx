"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useState } from "react";

export default function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <PersistGate loading={<p>loading.......</p>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
         <div className="flex flex-col h-full w-full overflow-hidden min-h-0">
            {children}
          </div>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
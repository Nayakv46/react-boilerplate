import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./app/App";
import { AppProviders } from "./app/providers";
import { Toaster } from "./components/ui/shadcn/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <Toaster />
      <App />
    </AppProviders>
  </StrictMode>,
);

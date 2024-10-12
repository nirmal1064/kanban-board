import { Toaster } from "@/components/ui/sonner.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./providers/AuthProvider.tsx";
import BoardProvider from "./providers/BoardProvider.tsx";
import ColumnProvider from "./providers/ColumnProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BoardProvider>
          <ColumnProvider>
            <App />
            <Toaster />
          </ColumnProvider>
        </BoardProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);

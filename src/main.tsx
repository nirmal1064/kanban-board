import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import BoardProvider from "./providers/BoardProvider.tsx";
import ColumnProvider from "./providers/ColumnProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BoardProvider>
        <ColumnProvider>
          <App />
        </ColumnProvider>
      </BoardProvider>
    </ThemeProvider>
  </StrictMode>
);

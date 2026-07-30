import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WidgetConfig } from "./WidgetConfig";

createRoot(document.getElementById("widget-config")!).render(
  <StrictMode>
    <WidgetConfig />
  </StrictMode>,
);

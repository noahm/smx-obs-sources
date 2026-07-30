import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PersonalScoreDisplay } from "./PersonalScoreDisplay";
import { PANEL_MAP, DEFAULT_ORDER } from "./panels";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const params = new URLSearchParams(location.search);
const username = params.get("user");

// `panels` is an ordered, comma-separated list of panel keys. When the param is
// absent we pass `undefined` so the display falls back to the full default set
// (making `/widget?user=X` behave like `/pb`). When present, unknown keys are
// dropped; a present-but-empty list renders nothing.
const panelsParam = params.get("panels");
const panels =
  panelsParam === null
    ? DEFAULT_ORDER
    : panelsParam
        .split(",")
        .map((key) => key.trim())
        .filter((key) => PANEL_MAP.has(key));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PersonalScoreDisplay username={username} panels={panels} />
    </QueryClientProvider>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PersonalScoreDisplay } from "./PersonalScoreDisplay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const params = new URLSearchParams(location.search);
const username = params.get("user");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PersonalScoreDisplay username={username} />
    </QueryClientProvider>
  </StrictMode>,
);

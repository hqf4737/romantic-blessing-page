import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PublicApp from "./PublicApp.jsx";
import "./public.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PublicApp />
  </StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "highlight.js/styles/github-dark.css";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

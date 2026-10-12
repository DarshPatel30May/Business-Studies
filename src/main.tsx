import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { SettingsProvider } from "./state/settings";
import { ProgressProvider } from "./state/progress";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <SettingsProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </SettingsProvider>
    </HashRouter>
  </React.StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Get the root container
const container = document.getElementById("root");

if (!container) {
  console.error("❌ Error: Root element not found! Check if <div id='root'></div> exists in index.html.");
} else {
  const root = ReactDOM.createRoot(container);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

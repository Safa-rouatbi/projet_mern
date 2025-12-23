import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import useAuthStore from "./store/authStore";

useAuthStore.getState().loadUser(); // 🔥 OBLIGATOIRE

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

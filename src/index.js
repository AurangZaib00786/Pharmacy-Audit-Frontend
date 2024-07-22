import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./Context/AuthContext";
import { AddDataProvider } from "./Context/adddataContext";
import { AddheaderProvider } from "./Context/addheaderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <AddDataProvider>
        <AddheaderProvider>
          <App />
        </AddheaderProvider>
      </AddDataProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();

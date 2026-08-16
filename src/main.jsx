// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

// 💡 នាំចូលនិង Initialize EmailJS Public Key នៅទីនេះឱ្យបានត្រឹមត្រូវ
import emailjs from "@emailjs/browser";
emailjs.init("alZeiwlYDOFHN9GC1");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const initialState = {
  theme: "system",
  color: "#3b82f6",
  setTheme: () => null,
  setColor: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
  const [color, setColor] = useState(() => localStorage.getItem("themeColor") || "#3b82f6");

  // Function to generate a lighter shade of the primary color
  const generateLightColor = (hex) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness (increase RGB values)
    r = Math.min(255, r + 160);
    g = Math.min(255, g + 160);
    b = Math.min(255, b + 160);

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Set primary color and dynamically generate primary-light
    root.style.setProperty("--primary-color", color);
    root.style.setProperty("--primary-light", generateLightColor(color));

    localStorage.setItem("themeColor", color);
  }, [theme, color]);

  
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, color, setColor }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
};

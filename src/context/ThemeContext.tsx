"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

type Theme = "studiolight" | "studiodark";

interface ThemeValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeValue>({ theme: "studiolight", toggleTheme: () => {} });

// The theme lives on <html data-theme="...">. The inline script in layout.tsx sets it
// before the page paints (no flash), and React simply watches that attribute.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "studiodark" ? "studiodark" : "studiolight";

const getServerSnapshot = (): Theme => "studiolight";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "studiolight" ? "studiodark" : "studiolight";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("studio-theme", next);
    } catch {
      /* storage can be blocked, the theme still changes */
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

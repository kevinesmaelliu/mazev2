import { TLUiOverrides } from "tldraw"

// CoffeeMod Light Theme
const LIGHT_THEME: TLUiOverrides = {
  colors: {
    text: "#202020",
    textOnColorful: "#ffffff",
    background: "#f9f9f9",
    panel: "#ffffff",
    panelContrast: "#efefef",
    border: "#d8d8d8",
    input: "#d8d8d8",
    inputBorder: "#d8d8d8",
    solid: "#644a40", // coffee brown primary
    selection: "#644a40",
    accent: "#644a40",
    grey: "#808080",
  },
}

// CoffeeMod Dark Theme
const DARK_THEME: TLUiOverrides = {
  colors: {
    text: "#eeeeee",
    textOnColorful: "#081a1b",
    background: "#130f0c",
    panel: "#211c18",
    panelContrast: "#222222",
    border: "#36332b",
    input: "#484848",
    inputBorder: "#36332b",
    solid: "#ffe0c2", // light peach primary
    selection: "#ffe0c2",
    accent: "#ffe0c2",
    grey: "#b4b4b4",
  },
}

/**
 * Get CoffeeMod themed TLDraw configuration
 * Detects dark mode from prop, DOM class, or system preference
 */
export function getCanvasTheme(isDark?: boolean): TLUiOverrides {
  // Determine dark mode setting
  let shouldUseDarkTheme = isDark

  if (isDark === undefined) {
    // Check for dark class on document element (Next.js dark mode)
    if (typeof document !== "undefined") {
      shouldUseDarkTheme = document.documentElement.classList.contains("dark")
    }

    // Fall back to system preference
    if (shouldUseDarkTheme === undefined && typeof window !== "undefined") {
      shouldUseDarkTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
    }
  }

  return shouldUseDarkTheme ? DARK_THEME : LIGHT_THEME
}

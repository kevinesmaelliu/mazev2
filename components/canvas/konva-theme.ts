/**
 * Konva Canvas Theme - CoffeeMod color palette and styling
 * Provides theme configuration for canvas elements based on light/dark mode
 */

export interface CanvasThemeConfig {
  colors: {
    // Text and UI
    text: string
    textSecondary: string
    background: string
    border: string

    // Canvas elements
    shape: string
    shapeFill: string
    shapeStroke: string
    selectionStroke: string
    selectionFill: string

    // UI elements
    grid: string
    gridMinor: string
    primary: string
  }
  shapes: {
    stroke: {
      width: number
      color: string
    }
    fill: {
      color: string
      opacity: number
    }
    selection: {
      stroke: string
      strokeWidth: number
      opacity: number
    }
  }
  text: {
    fontSize: number
    fontFamily: string
    fill: string
  }
}

// CoffeeMod Light Theme
const LIGHT_THEME: CanvasThemeConfig = {
  colors: {
    text: "#202020",
    textSecondary: "#666666",
    background: "#f9f9f9",
    border: "#d8d8d8",
    shape: "#644a40",
    shapeFill: "#f5f5f5",
    shapeStroke: "#644a40",
    selectionStroke: "#644a40",
    selectionFill: "rgba(100, 74, 64, 0.1)",
    grid: "#e8e8e8",
    gridMinor: "#f0f0f0",
    primary: "#644a40",
  },
  shapes: {
    stroke: {
      width: 2,
      color: "#644a40",
    },
    fill: {
      color: "#ffffff",
      opacity: 1,
    },
    selection: {
      stroke: "#644a40",
      strokeWidth: 2,
      opacity: 0.8,
    },
  },
  text: {
    fontSize: 14,
    fontFamily: "system-ui, -apple-system, sans-serif",
    fill: "#202020",
  },
}

// CoffeeMod Dark Theme
const DARK_THEME: CanvasThemeConfig = {
  colors: {
    text: "#eeeeee",
    textSecondary: "#b4b4b4",
    background: "#130f0c",
    border: "#36332b",
    shape: "#ffe0c2",
    shapeFill: "#211c18",
    shapeStroke: "#ffe0c2",
    selectionStroke: "#ffe0c2",
    selectionFill: "rgba(255, 224, 194, 0.15)",
    grid: "#2a2420",
    gridMinor: "#1a1510",
    primary: "#ffe0c2",
  },
  shapes: {
    stroke: {
      width: 2,
      color: "#ffe0c2",
    },
    fill: {
      color: "#211c18",
      opacity: 1,
    },
    selection: {
      stroke: "#ffe0c2",
      strokeWidth: 2,
      opacity: 0.8,
    },
  },
  text: {
    fontSize: 14,
    fontFamily: "system-ui, -apple-system, sans-serif",
    fill: "#eeeeee",
  },
}

/**
 * Get Konva canvas theme configuration
 * Detects dark mode from prop, DOM class, or system preference
 */
export function getCanvasTheme(isDark?: boolean): CanvasThemeConfig {
  // Determine dark mode setting
  let shouldUseDarkTheme = isDark

  if (isDark === undefined) {
    // Check for dark class on document element (Next.js dark mode)
    if (typeof document !== "undefined") {
      shouldUseDarkTheme = document.documentElement.classList.contains("dark")
    }

    // Fall back to system preference if still undefined
    if (shouldUseDarkTheme === undefined || shouldUseDarkTheme === false) {
      if (typeof window !== "undefined") {
        shouldUseDarkTheme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
      }
    }
  }

  // Default to dark theme if no explicit setting
  return shouldUseDarkTheme !== false ? DARK_THEME : LIGHT_THEME
}

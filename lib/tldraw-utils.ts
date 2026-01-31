import type { Editor } from "tldraw"

/**
 * Converts a File object to a data URL
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`))
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Validates if a URL is a valid image URL
 */
function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    const pathname = urlObj.pathname.toLowerCase()
    return imageExtensions.some((ext) => pathname.endsWith(ext))
  } catch {
    return false
  }
}

/**
 * Insert an image into the TLDraw canvas from a File object
 *
 * @param editor - TLDraw Editor instance
 * @param file - File object to insert (should be an image)
 * @param position - Optional position for the image (x, y coordinates)
 */
export async function insertImageFromFile(
  editor: Editor,
  file: File,
  position?: { x: number; y: number }
): Promise<void> {
  // Validate file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error(
      `Invalid file type: ${file.type}. Only image files are supported.`
    )
  }

  try {
    // Convert file to data URL
    const dataUrl = await fileToDataUrl(file)

    // Get the center of the viewport if no position provided
    const currentPage = editor.getCurrentPage()
    const viewportPageBounds = editor.getViewportPageBounds()

    const insertX = position?.x ?? viewportPageBounds.x + viewportPageBounds.w / 2
    const insertY = position?.y ?? viewportPageBounds.y + viewportPageBounds.h / 2

    // Insert image shape into canvas
    editor.createShape({
      type: "image",
      x: insertX,
      y: insertY,
      props: {
        w: 300,
        h: 300,
        src: dataUrl,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to insert image from file"
    throw new Error(message)
  }
}

/**
 * Insert an image into the TLDraw canvas from a URL
 *
 * @param editor - TLDraw Editor instance
 * @param imageUrl - URL of the image to insert
 * @param position - Optional position for the image (x, y coordinates)
 */
export async function insertImageFromUrl(
  editor: Editor,
  imageUrl: string,
  position?: { x: number; y: number }
): Promise<void> {
  // Validate URL format
  if (!isValidImageUrl(imageUrl)) {
    throw new Error(
      `Invalid image URL: ${imageUrl}. Please provide a valid image URL.`
    )
  }

  try {
    // Get the center of the viewport if no position provided
    const viewportPageBounds = editor.getViewportPageBounds()

    const insertX = position?.x ?? viewportPageBounds.x + viewportPageBounds.w / 2
    const insertY = position?.y ?? viewportPageBounds.y + viewportPageBounds.h / 2

    // Insert image shape into canvas
    editor.createShape({
      type: "image",
      x: insertX,
      y: insertY,
      props: {
        w: 300,
        h: 300,
        src: imageUrl,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to insert image from URL"
    throw new Error(message)
  }
}

/**
 * Export the current canvas state as a JSON string
 *
 * @param editor - TLDraw Editor instance
 * @returns JSON string representation of the canvas state
 */
export async function exportCanvasAsJSON(editor: Editor): Promise<string> {
  try {
    // Get all shapes from the current page
    const currentPage = editor.getCurrentPage()
    const shapes = editor.getShapesAtPage(currentPage.id)

    // Create a snapshot of the canvas state
    const canvasState = {
      pageId: currentPage.id,
      pageName: currentPage.name,
      shapes: shapes.map((shape) => ({
        id: shape.id,
        type: shape.type,
        x: shape.x,
        y: shape.y,
        props: shape.props,
        parentId: shape.parentId,
      })),
      timestamp: new Date().toISOString(),
    }

    return JSON.stringify(canvasState, null, 2)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to export canvas state"
    throw new Error(message)
  }
}

/**
 * Load canvas state from a JSON string
 *
 * @param editor - TLDraw Editor instance
 * @param jsonState - JSON string representation of the canvas state
 */
export async function loadCanvasFromJSON(
  editor: Editor,
  jsonState: string
): Promise<void> {
  try {
    // Parse the JSON
    const canvasState = JSON.parse(jsonState)

    if (!canvasState.shapes || !Array.isArray(canvasState.shapes)) {
      throw new Error(
        "Invalid canvas state format: missing or invalid 'shapes' array"
      )
    }

    // Get the current page
    const currentPage = editor.getCurrentPage()

    // Delete all existing shapes on the current page
    const existingShapes = editor.getShapesAtPage(currentPage.id)
    editor.deleteShapes(existingShapes.map((s) => s.id))

    // Create shapes from the loaded state
    const newShapes = canvasState.shapes.map(
      (shapeData: {
        id: string
        type: string
        x: number
        y: number
        props: unknown
        parentId?: string
      }) => ({
        id: shapeData.id,
        type: shapeData.type,
        x: shapeData.x,
        y: shapeData.y,
        parentId: shapeData.parentId || currentPage.id,
        props: shapeData.props,
      })
    )

    editor.createShapes(newShapes)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load canvas state from JSON"
    throw new Error(message)
  }
}

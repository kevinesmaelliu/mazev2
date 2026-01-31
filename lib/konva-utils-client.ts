'use client'

/**
 * Client-side Konva utilities - dynamically imported to avoid server-side issues
 */

let Konva: typeof import("konva").default

async function loadKonva() {
  if (!Konva) {
    Konva = (await import("konva")).default
  }
  return Konva
}

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
 * Insert an image into the Konva canvas from a File object
 *
 * @param stage - Konva Stage instance
 * @param file - File object to insert (should be an image)
 * @param position - Optional position for the image (x, y coordinates)
 */
export async function insertImageFromFile(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: any,
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
    const KonvaLib = await loadKonva()

    // Convert file to data URL
    const dataUrl = await fileToDataUrl(file)

    // Get the layer
    const layer = stage.getLayers()[0]
    if (!layer) {
      throw new Error("No layer found on stage")
    }

    // Create image element
    const img = new Image()
    img.src = dataUrl

    // Wait for image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Failed to load image"))
    })

    // Calculate position - center of viewport if not provided
    const stageWidth = stage.width()
    const stageHeight = stage.height()
    const insertX = position?.x ?? stageWidth / 2
    const insertY = position?.y ?? stageHeight / 2

    // Add image to canvas
    const imageNode = new KonvaLib.Image({
      image: img,
      x: insertX - img.width / 2,
      y: insertY - img.height / 2,
      width: img.width,
      height: img.height,
      draggable: true,
      name: "image",
    })

    layer.add(imageNode)
    layer.batchDraw()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to insert image from file"
    throw new Error(message)
  }
}

/**
 * Insert an image into the Konva canvas from a URL
 *
 * @param stage - Konva Stage instance
 * @param imageUrl - URL of the image to insert
 * @param position - Optional position for the image (x, y coordinates)
 */
export async function insertImageFromUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: any,
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
    const KonvaLib = await loadKonva()

    // Get the layer
    const layer = stage.getLayers()[0]
    if (!layer) {
      throw new Error("No layer found on stage")
    }

    // Create image element
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    // Wait for image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Failed to load image from URL"))
    })

    // Calculate position - center of viewport if not provided
    const stageWidth = stage.width()
    const stageHeight = stage.height()
    const insertX = position?.x ?? stageWidth / 2
    const insertY = position?.y ?? stageHeight / 2

    // Add image to canvas
    const imageNode = new KonvaLib.Image({
      image: img,
      x: insertX - img.width / 2,
      y: insertY - img.height / 2,
      width: img.width,
      height: img.height,
      draggable: true,
      name: "image",
    })

    layer.add(imageNode)
    layer.batchDraw()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to insert image from URL"
    throw new Error(message)
  }
}

export interface CanvasExportState {
  shapes: Array<{
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    properties: Record<string, unknown>
  }>
  viewport: {
    x: number
    y: number
    z: number
  }
}

/**
 * Export the current canvas state as a JSON string
 *
 * @param stage - Konva Stage instance
 * @returns JSON string representation of the canvas state
 */
export async function exportCanvasAsJSON(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: any
): Promise<string> {
  try {
    const layer = stage.getLayers()[0]
    if (!layer) {
      throw new Error("No layer found on stage")
    }

    // Get all shapes from the layer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shapes = layer.getChildren().map((node: any) => {
      const attrs = node.attrs
      return {
        id: node.id(),
        type: node.className,
        x: attrs.x || 0,
        y: attrs.y || 0,
        width: attrs.width || 0,
        height: attrs.height || 0,
        properties: {
          ...attrs,
        },
      }
    })

    // Get viewport position and scale
    const camera = stage.attrs
    const canvasState = {
      shapes,
      viewport: {
        x: camera.offsetX || 0,
        y: camera.offsetY || 0,
        z: stage.scaleX() || 1,
      },
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
 * @param stage - Konva Stage instance
 * @param jsonState - JSON string representation of the canvas state
 */
export async function loadCanvasFromJSON(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: any,
  jsonState: string
): Promise<void> {
  try {
    const KonvaLib = await loadKonva()

    // Parse the JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvasState = JSON.parse(jsonState) as any as CanvasExportState

    if (!canvasState.shapes || !Array.isArray(canvasState.shapes)) {
      throw new Error(
        "Invalid canvas state format: missing or invalid 'shapes' array"
      )
    }

    const layer = stage.getLayers()[0]
    if (!layer) {
      throw new Error("No layer found on stage")
    }

    // Clear existing shapes
    layer.destroyChildren()

    // Recreate shapes from the loaded state
    for (const shapeData of canvasState.shapes) {
      if (shapeData.type === "Image") {
        // Handle images - need to recreate from src
        const src = (shapeData.properties.src as string) || ""
        if (src) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = src

          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error("Failed to load image"))
          })

          const imageNode = new KonvaLib.Image({
            id: shapeData.id,
            image: img,
            x: shapeData.x,
            y: shapeData.y,
            width: shapeData.width,
            height: shapeData.height,
            draggable: true,
          })
          layer.add(imageNode)
        }
      } else if (shapeData.type === "Rect") {
        const rect = new KonvaLib.Rect({
          id: shapeData.id,
          x: shapeData.x,
          y: shapeData.y,
          width: shapeData.width,
          height: shapeData.height,
          stroke: (shapeData.properties.stroke as string) || "black",
          strokeWidth: (shapeData.properties.strokeWidth as number) || 1,
          fill: (shapeData.properties.fill as string) || "transparent",
          draggable: true,
        })
        layer.add(rect)
      } else if (shapeData.type === "Circle") {
        const circle = new KonvaLib.Circle({
          id: shapeData.id,
          x: shapeData.x,
          y: shapeData.y,
          radius: (shapeData.properties.radius as number) || 50,
          stroke: (shapeData.properties.stroke as string) || "black",
          strokeWidth: (shapeData.properties.strokeWidth as number) || 1,
          fill: (shapeData.properties.fill as string) || "transparent",
          draggable: true,
        })
        layer.add(circle)
      } else if (shapeData.type === "Line") {
        const points = (shapeData.properties.points as number[]) || []
        const line = new KonvaLib.Line({
          id: shapeData.id,
          points,
          stroke: (shapeData.properties.stroke as string) || "black",
          strokeWidth: (shapeData.properties.strokeWidth as number) || 2,
          tension: (shapeData.properties.tension as number) || 0,
          draggable: true,
        })
        layer.add(line)
      } else if (shapeData.type === "Text") {
        const text = new KonvaLib.Text({
          id: shapeData.id,
          x: shapeData.x,
          y: shapeData.y,
          text: (shapeData.properties.text as string) || "",
          fontSize: (shapeData.properties.fontSize as number) || 14,
          fontFamily: (shapeData.properties.fontFamily as string) || "Arial",
          fill: (shapeData.properties.fill as string) || "black",
          draggable: true,
        })
        layer.add(text)
      }
    }

    // Restore viewport if provided
    if (canvasState.viewport) {
      stage.offset({
        x: canvasState.viewport.x,
        y: canvasState.viewport.y,
      })
      stage.scale({ x: canvasState.viewport.z, y: canvasState.viewport.z })
    }

    layer.batchDraw()
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load canvas state from JSON"
    throw new Error(message)
  }
}

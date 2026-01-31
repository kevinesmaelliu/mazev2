import type { Editor } from "tldraw"
import { insertImageFromUrl } from "./tldraw-utils"

interface ParsedFigmaUrl {
  fileId: string
  frameId?: string
}

/**
 * Parse a Figma URL to extract file ID and optional frame ID
 *
 * Supports formats:
 * - https://www.figma.com/file/[fileId]/...
 * - https://www.figma.com/proto/[fileId]/...
 * - https://figma.com/file/[fileId]?node-id=[frameId]
 *
 * @param url - Figma URL to parse
 * @returns Object with fileId and optional frameId, or null if invalid
 */
export function parseFigmaUrl(url: string): ParsedFigmaUrl | null {
  try {
    const urlObj = new URL(url)

    if (!urlObj.hostname.includes("figma.com")) {
      return null
    }

    // Extract file ID from path
    // Formats: /file/[fileId]/... or /proto/[fileId]/...
    const pathMatch = urlObj.pathname.match(/\/(file|proto)\/([a-z0-9]+)/i)
    if (!pathMatch || !pathMatch[2]) {
      return null
    }

    const fileId = pathMatch[2]

    // Try to extract frame/node ID from URL parameters
    // Format: ?node-id=[nodeId] or #[nodeId]
    let frameId: string | undefined

    // Check query parameters
    const nodeIdParam = urlObj.searchParams.get("node-id")
    if (nodeIdParam) {
      frameId = nodeIdParam
    }

    // Check hash/fragment
    if (!frameId && urlObj.hash) {
      const hashMatch = urlObj.hash.match(/node-id[=%]([a-z0-9:]+)/i)
      if (hashMatch && hashMatch[1]) {
        frameId = hashMatch[1]
      }
    }

    return { fileId, frameId }
  } catch {
    return null
  }
}

/**
 * Fetch a Figma frame as an image URL
 *
 * Uses the Figma API to render a specific frame or board as an image.
 * Requires FIGMA_API_TOKEN environment variable to be set.
 *
 * @param fileId - Figma file ID
 * @param frameId - Optional Figma node/frame ID (if not provided, exports entire file)
 * @param token - Optional Figma API token (defaults to FIGMA_API_TOKEN env var)
 * @returns Image URL for the exported frame
 */
export async function getFigmaFrameImage(
  fileId: string,
  frameId?: string,
  token?: string
): Promise<string> {
  const apiToken = token || process.env.FIGMA_API_TOKEN

  if (!apiToken) {
    throw new Error(
      "Figma API token is required. Set FIGMA_API_TOKEN environment variable."
    )
  }

  if (!fileId) {
    throw new Error("Figma file ID is required")
  }

  try {
    // Build the API endpoint
    const apiUrl = new URL("https://api.figma.com/v1/images/" + fileId)

    // Add node IDs if provided
    if (frameId) {
      apiUrl.searchParams.set("ids", frameId)
    }

    // Request PNG format with scale factor
    apiUrl.searchParams.set("format", "png")
    apiUrl.searchParams.set("scale", "2") // 2x resolution for clarity

    // Fetch from Figma API
    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "X-FIGMA-TOKEN": apiToken,
      },
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Invalid Figma API token")
      } else if (response.status === 404) {
        throw new Error("Figma file or frame not found")
      } else {
        throw new Error(`Figma API error: ${response.statusText}`)
      }
    }

    const data = await response.json() as { images?: Record<string, string | null> }

    // Extract the image URL from the response
    if (!data.images || Object.keys(data.images).length === 0) {
      throw new Error("No image data returned from Figma API")
    }

    const imageUrl = Object.values(data.images)[0]

    if (!imageUrl) {
      throw new Error("Invalid image URL returned from Figma API")
    }

    return imageUrl
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Figma frame image"
    throw new Error(message)
  }
}

/**
 * Insert a Figma frame or board into the TLDraw canvas
 *
 * Parses the Figma URL, fetches the frame as an image, and inserts it into the canvas.
 *
 * @param editor - TLDraw Editor instance
 * @param figmaUrl - Figma URL (file or prototype link)
 * @param token - Optional Figma API token (defaults to FIGMA_API_TOKEN env var)
 * @param position - Optional position for the image (x, y coordinates)
 */
export async function insertFigmaFrame(
  editor: Editor,
  figmaUrl: string,
  token?: string,
  position?: { x: number; y: number }
): Promise<void> {
  try {
    // Parse the Figma URL
    const parsed = parseFigmaUrl(figmaUrl)

    if (!parsed) {
      throw new Error(
        `Invalid Figma URL: ${figmaUrl}. Please provide a valid Figma file or prototype URL.`
      )
    }

    // Fetch the frame image
    const imageUrl = await getFigmaFrameImage(parsed.fileId, parsed.frameId, token)

    // Insert the image into the canvas
    await insertImageFromUrl(editor, imageUrl, position)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to insert Figma frame"
    throw new Error(message)
  }
}

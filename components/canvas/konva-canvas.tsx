"use client"

import { useEffect, useRef, useState } from "react"
import type { KonvaCanvasProps, EditorState, ShapeData, ViewportState } from "./canvas-types"
import { getCanvasTheme } from "./konva-theme"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KonvaStageType = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KonvaLayerType = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KonvaModuleType = any

export function KonvaCanvas({
  width = "100%",
  height = "100%",
  className,
  initialState,
  onEditorMount,
  onUpdateShape,
  onSelectionChange,
  readOnly = false,
  darkMode,
  onSave,
  autoSave = true,
  autoSaveInterval = 5000,
}: KonvaCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<KonvaStageType | null>(null)
  const layerRef = useRef<KonvaLayerType | null>(null)
  const selectedNodesRef = useRef<string[]>([])
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  const KonvaRef = useRef<KonvaModuleType>(null)

  // Initialize Konva when container has dimensions (avoids 0x0 canvas); cleanup resets state for Strict Mode remount
  useEffect(() => {
    const container = containerRef.current
    if (!container || hasInitialized) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    let wheelHandler: ((e: WheelEvent) => void) | null = null

    const initKonva = async () => {
      if (stageRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 && h === 0) return

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Konva = (await import("konva")).default as any
        if (cancelled) return
        KonvaRef.current = Konva

        const containerWidth = w || 800
        const containerHeight = h || 600

        const stage = new Konva.Stage({
          container,
          width: containerWidth,
          height: containerHeight,
        })

        const theme = getCanvasTheme(darkMode ?? true)

        // Dotted grid: theme tokens only (grid color), non-interactive, behind content – visually differentiates Konva canvas
        const GRID_SPACING = 24
        const GRID_DOT_RADIUS = 2
        const gridLayer = new Konva.Layer({ listening: false })
        const gridShape = new Konva.Shape({
          sceneFunc: (context: KonvaLayerType, shape: KonvaLayerType) => {
            const extentW = containerWidth * 2
            const extentH = containerHeight * 2
            const offsetX = -containerWidth / 2
            const offsetY = -containerHeight / 2
            for (let x = 0; x <= extentW; x += GRID_SPACING) {
              for (let y = 0; y <= extentH; y += GRID_SPACING) {
                context.beginPath()
                context.arc(offsetX + x, offsetY + y, GRID_DOT_RADIUS, 0, Math.PI * 2)
                context.fillStrokeShape(shape)
              }
            }
          },
          fill: theme.colors.grid,
          listening: false,
        })
        gridLayer.add(gridShape)
        stage.add(gridLayer)
        gridLayer.batchDraw()

        const layer = new Konva.Layer()
        stage.add(layer)

        stageRef.current = stage
        layerRef.current = layer
        stage.batchDraw()

        // Expose stage to parent component
        if (onEditorMount) {
          onEditorMount(stage)
        }

        // Load initial state if provided
        if (initialState?.shapes && initialState.shapes.length > 0) {
          const theme = getCanvasTheme(darkMode ?? true)
          for (const shapeData of initialState.shapes) {
            if (shapeData.type === "rect") {
              const rect = new Konva.Rect({
                id: shapeData.id,
                x: shapeData.x,
                y: shapeData.y,
                width: shapeData.width,
                height: shapeData.height,
                stroke: theme.shapes.stroke.color,
                strokeWidth: theme.shapes.stroke.width,
                fill: theme.shapes.fill.color,
                draggable: !readOnly,
                name: "shape",
              })
              layer.add(rect)
            } else if (shapeData.type === "circle") {
              const circle = new Konva.Circle({
                id: shapeData.id,
                x: shapeData.x,
                y: shapeData.y,
                radius: shapeData.width / 2,
                stroke: theme.shapes.stroke.color,
                strokeWidth: theme.shapes.stroke.width,
                fill: theme.shapes.fill.color,
                draggable: !readOnly,
                name: "shape",
              })
              layer.add(circle)
            } else if (shapeData.type === "image") {
              const imgUrl = (shapeData.properties?.src as string) || ""
              if (imgUrl) {
                const img = new Image()
                img.src = imgUrl
                img.onload = () => {
                  const imageNode = new Konva.Image({
                    id: shapeData.id,
                    image: img,
                    x: shapeData.x,
                    y: shapeData.y,
                    width: shapeData.width,
                    height: shapeData.height,
                    draggable: !readOnly,
                    name: "image",
                  })
                  layer.add(imageNode)
                  layer.batchDraw()
                }
              }
            }
          }
          layer.batchDraw()
        }

        // Set initial viewport if provided
        if (initialState?.viewport) {
          const { x, y, z } = initialState.viewport
          stage.offset({ x, y })
          stage.scale({ x: z, y: z })
        }

        // Set up zoom controls
        wheelHandler = (e: WheelEvent) => {
          e.preventDefault()

          const oldScale = stage.scaleX()
          const pointer = stage.getPointerPosition()

          if (!pointer) return

          const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
          }

          const newScale = e.deltaY > 0 ? oldScale * 0.8 : oldScale * 1.2
          const newScale_clamped = Math.max(0.1, Math.min(newScale, 5))

          stage.scale({ x: newScale_clamped, y: newScale_clamped })

          const newPos = {
            x: pointer.x - mousePointTo.x * newScale_clamped,
            y: pointer.y - mousePointTo.y * newScale_clamped,
          }
          stage.position(newPos)
          stage.batchDraw()
        }

        container.addEventListener("wheel", wheelHandler)
        setHasInitialized(true)
      } catch (error) {
        console.error("Failed to initialize Konva stage:", error)
      }
    }

    // Defer init one frame so layout is complete and container has dimensions
    const rafId = requestAnimationFrame(() => {
      initKonva()
    })

    if (container.clientWidth === 0 && container.clientHeight === 0) {
      resizeObserver = new ResizeObserver(() => {
        if (container.clientWidth > 0 || container.clientHeight > 0) {
          initKonva()
        }
      })
      resizeObserver.observe(container)
    }

    return () => {
      cancelAnimationFrame(rafId)
      cancelled = true
      if (resizeObserver && container) {
        resizeObserver.disconnect()
      }
      if (container && wheelHandler) {
        container.removeEventListener("wheel", wheelHandler)
      }
      setHasInitialized(false)
    }
  }, [onEditorMount, initialState, darkMode, hasInitialized, readOnly])

  // Set up shape event listeners
  useEffect(() => {
    if (!hasInitialized || !layerRef.current || !stageRef.current || !KonvaRef.current) return

    const layer = layerRef.current
    const stage = stageRef.current
    const Konva = KonvaRef.current

    // Handle shape click to select
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNodeClick = (e: any) => {
      if (readOnly) return

      const target = e.target
      if (target === stage || target === layer) {
        layer.getChildren().forEach((node: KonvaLayerType) => {
          if (node instanceof Konva.Rect || node instanceof Konva.Circle) {
            node.stroke("transparent")
          }
        })
        selectedNodesRef.current = []
        onSelectionChange?.([])
        return
      }

      if (target instanceof Konva.Rect || target instanceof Konva.Circle) {
        const theme = getCanvasTheme(darkMode ?? true)

        layer.getChildren().forEach((node: KonvaLayerType) => {
          if ((node instanceof Konva.Rect || node instanceof Konva.Circle) && node.id() !== target.id()) {
            node.stroke("transparent")
          }
        })

        target.stroke(theme.colors.selectionStroke)
        target.strokeWidth(theme.shapes.selection.strokeWidth)
        selectedNodesRef.current = [target.id()]
        onSelectionChange?.([target.id()])
      }
    }

    // Handle shape updates (dragging, resizing)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNodeDragEnd = (e: any) => {
      const target = e.target
      if (target instanceof Konva.Rect || target instanceof Konva.Circle || target instanceof Konva.Image) {
        const shapeData: ShapeData = {
          id: target.id(),
          type: target.className.toLowerCase(),
          x: target.x(),
          y: target.y(),
          width: target.width?.(),
          height: target.height?.(),
          properties: {
            ...target.attrs,
          },
        }
        onUpdateShape?.(shapeData)
      }
    }

    stage.on("click tap", handleNodeClick)

    layer.getChildren().forEach((node: KonvaLayerType) => {
      if (node instanceof Konva.Rect || node instanceof Konva.Circle || node instanceof Konva.Image) {
        node.on("dragend", handleNodeDragEnd)
      }
    })

    return () => {
      stage.off("click tap", handleNodeClick)
      layer.getChildren().forEach((node: KonvaLayerType) => {
        if (node instanceof Konva.Rect || node instanceof Konva.Circle || node instanceof Konva.Image) {
          node.off("dragend", handleNodeDragEnd)
        }
      })
    }
  }, [hasInitialized, readOnly, onUpdateShape, onSelectionChange, darkMode])

  // Set up auto-save
  useEffect(() => {
    if (!autoSave || !hasInitialized || !stageRef.current || !layerRef.current) return

    const saveState = () => {
      const stage = stageRef.current
      const layer = layerRef.current

      if (!stage || !layer || !onSave) return

      const shapes = layer.getChildren().map((node: KonvaLayerType) => {
        const attrs = node.attrs
        return {
          id: node.id(),
          type: node.className.toLowerCase(),
          x: attrs.x || 0,
          y: attrs.y || 0,
          width: attrs.width || 0,
          height: attrs.height || 0,
          properties: { ...attrs },
        }
      })

      const viewport: ViewportState = {
        x: stage.x(),
        y: stage.y(),
        z: stage.scaleX() || 1,
      }

      const state: EditorState = {
        shapes,
        viewport,
        selectedIds: selectedNodesRef.current,
      }

      onSave(state)
    }

    autoSaveIntervalRef.current = setInterval(saveState, autoSaveInterval)

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [autoSave, autoSaveInterval, hasInitialized, onSave])

  // Clean up on unmount (clear refs so Strict Mode remount can create a new stage)
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
      if (stageRef.current) {
        stageRef.current.destroy()
        stageRef.current = null
        layerRef.current = null
      }
    }
  }, [])

  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    overflow: "hidden",
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full overflow-hidden bg-background", className)}
      style={containerStyle}
    />
  )
}

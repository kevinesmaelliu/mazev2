"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { Editor, Tldraw } from "tldraw"
import "tldraw/tldraw.css"
import { TLDrawCanvasProps, EditorState, ShapeData, ViewportState } from "./canvas-types"
import { getCanvasTheme } from "./canvas-theme"
import { cn } from "@/lib/utils"

export function TLDrawCanvas({
  width = "100%",
  height = "100%",
  className,
  initialState,
  onEditorMount,
  onCreateShape,
  onUpdateShape,
  onDeleteShape,
  onSelectionChange,
  readOnly = false,
  showUI = true,
  darkMode,
  onSave,
  autoSave = true,
  autoSaveInterval = 5000,
}: TLDrawCanvasProps) {
  const editorRef = useRef<Editor>(null)
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Handle editor initialization
  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor

    // Expose editor instance to parent component
    if (onEditorMount) {
      onEditorMount(editor)
    }

    // Load initial state if provided
    if (initialState?.shapes) {
      editor.createShapes(
        initialState.shapes.map((shape) => ({
          type: shape.type as unknown,
          id: shape.id as unknown,
          x: shape.x,
          y: shape.y,
          props: {
            w: shape.width,
            h: shape.height,
            ...shape.properties,
          },
        }))
      )
    }

    // Set initial viewport if provided
    if (initialState?.viewport) {
      const { x, y, z } = initialState.viewport
      editor.setCamera({ x, y, z })
    }

    // Set initial selection if provided
    if (initialState?.selectedShapeIds) {
      editor.selectAll() // Or use setSelectedShapeIds if available
    }

    setHasInitialized(true)
  }, [onEditorMount, initialState])

  // Set up event listeners for shape operations
  useEffect(() => {
    if (!hasInitialized || !editorRef.current) return

    const editor = editorRef.current

    // Listen for shape creation
    const unsubscribeCreate = editor.store.listen((changes: unknown) => {
      const changeObj = changes as Record<string, unknown>
      if (Array.isArray(changeObj.added)) {
        changeObj.added.forEach((record: unknown) => {
          const rec = record as Record<string, unknown>
          if (rec.typeName === "shape" && onCreateShape) {
            const shapeData: ShapeData = {
              id: String(rec.id),
              type: String(rec.type),
              x: Number(rec.x),
              y: Number(rec.y),
              width: (rec.props as Record<string, unknown>)?.w as number || 100,
              height: (rec.props as Record<string, unknown>)?.h as number || 100,
              properties: rec.props as Record<string, unknown>,
            }
            onCreateShape(shapeData)
          }
        })
      }

      // Listen for shape updates
      if (Array.isArray(changeObj.updated)) {
        changeObj.updated.forEach((record: unknown) => {
          const upd = record as unknown[]
          if (upd[1] && typeof upd[1] === "object") {
            const updated = upd[1] as Record<string, unknown>
            if (updated.typeName === "shape" && onUpdateShape) {
              const shapeData: ShapeData = {
                id: String(updated.id),
                type: String(updated.type),
                x: Number(updated.x),
                y: Number(updated.y),
                width: (updated.props as Record<string, unknown>)?.w as number || 100,
                height: (updated.props as Record<string, unknown>)?.h as number || 100,
                properties: updated.props as Record<string, unknown>,
              }
              onUpdateShape(shapeData)
            }
          }
        })
      }

      // Listen for shape deletion
      if (Array.isArray(changeObj.removed)) {
        changeObj.removed.forEach((record: unknown) => {
          const rec = record as Record<string, unknown>
          if (rec.typeName === "shape" && onDeleteShape) {
            onDeleteShape([String(rec.id)])
          }
        })
      }
    })

    return () => {
      unsubscribeCreate()
    }
  }, [hasInitialized, onCreateShape, onUpdateShape, onDeleteShape])

  // Listen for selection changes
  useEffect(() => {
    if (!hasInitialized || !editorRef.current) return

    const editor = editorRef.current

    const unsubscribeSelection = editor.store.listen(() => {
      if (onSelectionChange) {
        const selectedShapes = editor.getSelectedShapeIds()
        onSelectionChange(selectedShapes)
      }
    })

    return () => {
      unsubscribeSelection()
    }
  }, [hasInitialized, onSelectionChange])

  // Set up auto-save
  useEffect(() => {
    if (!autoSave || !hasInitialized || !editorRef.current) return

    const saveState = () => {
      if (onSave && editorRef.current) {
        const editor = editorRef.current
        const shapes = editor.getShapeIds().map((id) => {
          const shape = editor.getShape(id)
          if (!shape) return null
          const shapeWithProps = shape as unknown as Record<string, unknown>
          return {
            id: shape.id,
            type: shape.type,
            x: shape.x,
            y: shape.y,
            width: ((shapeWithProps.props as Record<string, unknown>)?.w as number) || 100,
            height: ((shapeWithProps.props as Record<string, unknown>)?.h as number) || 100,
            properties: shapeWithProps.props as Record<string, unknown>,
          }
        }).filter(Boolean) as ShapeData[]

        const camera = editor.getCamera()
        const viewport: ViewportState = {
          x: camera.x,
          y: camera.y,
          z: camera.z,
        }

        const state: EditorState = {
          shapes,
          viewport,
          selectedIds: editor.getSelectedShapeIds(),
        }

        onSave(state)
      }
    }

    autoSaveIntervalRef.current = setInterval(saveState, autoSaveInterval)

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [autoSave, autoSaveInterval, hasInitialized, onSave])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current)
      }
    }
  }, [])

  const theme = getCanvasTheme(darkMode)

  const containerStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  }

  return (
    <div
      className={cn("w-full h-full bg-background", className)}
      style={containerStyle}
    >
      <Tldraw
        onMount={handleMount}
        persistenceKey="tldraw-canvas"
        shareDB={false}
        snapshot={undefined}
        overrides={{
          ...theme,
          ui: {
            hideUi: !showUI,
          },
        }}
        autoFocus
        readOnly={readOnly}
      />
    </div>
  )
}

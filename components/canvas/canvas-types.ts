import type Konva from "konva"

export interface KonvaCanvasProps {
  // Dimensions and layout
  width?: string | number
  height?: string | number
  className?: string

  // Initialization
  initialState?: KonvaInitialState

  // Editor callbacks
  onEditorMount?: (stage: Konva.Stage) => void
  onCreateShape?: (shapeData: ShapeData) => void
  onUpdateShape?: (shapeData: ShapeData) => void
  onDeleteShape?: (shapeIds: string[]) => void
  onSelectionChange?: (selectedIds: string[]) => void

  // Configuration
  readOnly?: boolean
  showUI?: boolean
  darkMode?: boolean

  // Persistence
  onSave?: (state: EditorState) => void
  autoSave?: boolean
  autoSaveInterval?: number
}

// Backward compatibility alias
export type TLDrawCanvasProps = KonvaCanvasProps

export interface KonvaInitialState {
  shapes?: ShapeData[]
  selectedShapeIds?: string[]
  viewport?: ViewportState
}

// Backward compatibility alias
export type TLDrawInitialState = KonvaInitialState

export interface ShapeData {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  properties?: Record<string, unknown>
}

export interface EditorState {
  shapes: ShapeData[]
  viewport: ViewportState
  selectedIds: string[]
}

export interface ViewportState {
  x: number
  y: number
  z: number
}

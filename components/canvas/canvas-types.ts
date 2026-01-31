import { Editor } from "tldraw"

export interface TLDrawCanvasProps {
  // Dimensions and layout
  width?: string | number
  height?: string | number
  className?: string

  // Initialization
  initialState?: TLDrawInitialState

  // Editor callbacks
  onEditorMount?: (editor: Editor) => void
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

export interface TLDrawInitialState {
  shapes?: ShapeData[]
  selectedShapeIds?: string[]
  viewport?: ViewportState
}

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

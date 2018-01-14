/** TodoMVC model definitions **/

declare interface ToolsStoreState {
  activeTool: string
}

declare interface LayersStoreState {
  activeLayer: string
  visible: boolean[]
}

declare interface PaletteStoreState {
  selectedItem: PaletteItem,
  mode: string
}

declare interface PaletteItem {
  name: string
  type: string
}

declare interface RootState {
  tools: ToolsStoreState
  layers: LayersStoreState
  palette: PaletteStoreState
}



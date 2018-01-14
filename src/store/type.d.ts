/** TodoMVC model definitions **/

declare interface ToolsStoreState {
  activeTool: string
}

declare interface BuilderStoreState {
  selectedItem: PaletteItem
  lastSelectedItems: object
}

declare interface LayersStoreState {
  activeLayer: string
  visible: boolean[]
}

declare interface PaletteItem {
  name: string
  type: string
}

declare interface RootState {
  tools: ToolsStoreState
  layers: LayersStoreState
  builder: BuilderStoreState
}



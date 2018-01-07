/** TodoMVC model definitions **/

declare interface ToolsStoreState {
  activeTool: string
}

declare interface LayersStoreState {
  activeLayer: string
  visible: boolean[]
}

declare interface RootState {
  tools: ToolsStoreState;
  layers: LayersStoreState;
}



/** TodoMVC model definitions **/
import {LayoutStoreState} from "reducers/layout";
import {BuilderStoreState} from "reducers/builder";

declare interface ToolsStoreState {
  activeTool: string
}

declare interface PaletteItem {
  name: string
  type: string
}

declare interface RootState {
  tools: ToolsStoreState
  layout: LayoutStoreState
  builder: BuilderStoreState
}

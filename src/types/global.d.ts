/** Global definitions for developement **/
import Layer = paper.Layer;

// for style loader
declare module '*.css' {
  const styles: any;
  export default styles;
}

declare module '*.svg' {
  const data: any;
  export default data;
}

declare interface PathItem {
  id: string
  type: string
  layer: Layer
  pathData: string
  fillColor: string
}

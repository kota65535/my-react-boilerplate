// windowにグローバル変数をぶち込む
// TODO: 型指定入れる
declare interface Window {
  PAPER_SCOPE: any
  RAIL_COMPONENTS: {[key: string]: any}
  CANVAS: HTMLCanvasElement
}

import PaperScope = paper.PaperScope;

declare module "*.json"
declare module '*.jpg'

// for style loader
declare module '*.css' {
  const styles: any;
  export default styles;
}

declare module '*.svg' {
  const data: any;
  export default data;
}

declare var PAPER_SCOPE: PaperScope|any
declare var RAIL_COMPONENTS: any



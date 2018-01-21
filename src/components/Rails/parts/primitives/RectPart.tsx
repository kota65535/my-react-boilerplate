import * as React from "react";
import {Point} from "paper";
import {Path} from "react-paper-bindings";

export interface RectPartProps {
  width: number
  height: number
  position: Point
  angle: number
  fillColor?: string
  visible?: boolean
  opacity?: number
}

export default class RectPart extends React.Component<RectPartProps, {}> {

  constructor (props: RectPartProps) {
    super(props)
  }

  render() {
    const {position, angle, width, height, fillColor, visible, opacity} = this.props
    return <Path
      pathData={createRectPath(width, height)}
      position={position}
      rotation={angle}
      fillColor={fillColor}
      visible={visible}
      opacity={opacity}
    />
  }
}

export function createRectPath(width: number, height: number) {
  let pathData = `M 0 0 L 0 ${-height/2} ${width} ${-height/2} L ${width}} 0 L ${width} ${height/2} L 0 ${height/2} Z`
  return pathData
}

import * as React from "react";
import {Point} from "paper";
import {Path} from "react-paper-bindings";

export interface TrianglePartProps {
  position: Point
  angle: number
  width: number
  height: number
  fillColor: string
}

export default class TrianglePart extends React.Component<TrianglePartProps, {}> {

  constructor (props: TrianglePartProps) {
    super(props)
  }

  render() {
    return <Path
      pathData={createTrianglePath(this.props.width, this.props.height)}
      position={this.props.position}
      rotation={this.props.angle}
      fillColor={this.props.fillColor}
      name="unko"
    />
  }
}

export function createTrianglePath(width: number, height: number) {
  let pathData = `M 0 0 L ${width/2} ${height} L ${-width/2} ${height} Z`
  return pathData
}

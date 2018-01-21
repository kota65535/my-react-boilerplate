import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {BaseItemData} from "../hoc/withHistory";
import RectPart from "./parts/primitives/RectPart";


export interface StraightRailProps {
  position: Point
  angle: number
  length: number
}

export default class StraightRail extends React.Component<StraightRailProps, {}> {

  constructor (props: StraightRailProps) {
    super(props)
  }

  render() {
    // return <Rectangle
    //   center={this.props.position}
    //   size={[10, this.props.length]}
    //   rotation={this.props.angle}
    //   fillColor='black'
    // />
    return <RectPart
      position={this.props.position}
      angle={45}
      width={100}
      height={10}
      fillColor='black'
    />
  }
}

export type StraightRailItemData = BaseItemData & StraightRailProps

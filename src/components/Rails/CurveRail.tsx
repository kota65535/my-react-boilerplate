import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import {BaseItemData} from "../hoc/withHistory";


export interface CurveRailProps {
  position: Point
  angle: number
  radius: number
  centerAngle: number
}

export default class CurveRail extends React.Component<CurveRailProps, {}> {

  constructor (props: CurveRailProps) {
    super(props)
  }

  render() {
    return <Rectangle
      center={this.props.position}
      size={[10,10]}
      fillColor='red'
    />
  }
}

export type CurveRailItemData = BaseItemData & CurveRailProps

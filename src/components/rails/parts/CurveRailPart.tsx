import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import ArcPart, {ArcDirection} from "./primitives/ArcPart";
import {RAIL_PART_FILL_COLORS, RAIL_PART_WIDTH} from "constants/parts";
import {Pivot} from "components/rails/parts/primitives/PartBase";
import PartGroup from "components/rails/parts/primitives/PartGroup";
import RailPartBase, {RailPartBaseDefaultProps, RailPartBaseProps} from "components/rails/parts/RailPartBase";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

interface CurveRailPartProps extends RailPartBaseProps {
  radius: number
  centerAngle: number
  direction: ArcDirection
}


export default class CurveRailPart extends RailPartBase<CurveRailPartProps, {}> {
  public static defaultProps: RailPartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivotJointIndex: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  // Pivotにするジョイントの位置を指定するための情報
  pivots = [
    {pivotPartIndex: 0, pivot: Pivot.LEFT},
    {pivotPartIndex: 0, pivot: Pivot.RIGHT},
  ]

  // Pivotジョイントに応じて変わるレールの角度
  angles = [
    () => this.props.angle,
    () => {
      switch (this.props.direction) {
        case ArcDirection.RIGHT:
          return this.props.angle - this.props.centerAngle + 180
        case ArcDirection.LEFT:
          return this.props.angle + this.props.centerAngle - 180
      }
    }
  ]

  constructor(props: CurveRailPartProps) {
    super(props)
  }

  getPivot(jointIndex: number) {
    return this.pivots[jointIndex]
  }

  getAngle(jointIndex: number) {
    return this.angles[jointIndex]()
  }

  render() {
    const { radius, centerAngle, direction, pivotJointIndex, data } = this.props
    const {pivotPartIndex, pivot} = this.getPivot(pivotJointIndex)

    const part = (
      <PartGroup
        pivotPartIndex={pivotPartIndex}
        pivot={Pivot.LEFT}
        data={data}
      >
        <ArcPart
          pivot={Pivot.LEFT}
          direction={direction}
          radius={radius}
          centerAngle={centerAngle}
          width={RAIL_PART_WIDTH}
          data={{
            type: 'Part'
          }}
        />
      </PartGroup>
    )

    return this.createComponent(part, part)
  }
}

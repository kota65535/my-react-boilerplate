import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import DetectablePart from "./Parts/DetectablePart";
import {RAIL_PART_FILL_COLORS} from "constants/parts";
import {RailPartInfo} from "components/Rails/RailParts/types";
import {Pivot} from "components/Rails/RailParts/Parts/PartBase";


export interface RailPartBaseProps extends Partial<RailPartBaseDefaultProps> {
  name?: string
  data?: RailPartInfo
  onLeftClick?: (e: MouseEvent) => void
  onRightClick?: (e: MouseEvent) => void
  onFixed?: () => void
}

export interface RailPartBaseDefaultProps {
  position?: Point
  angle?: number
  pivotJointIndex?: number
  detectionEnabled?: boolean
  selected?: boolean
  opacity?: number
  fillColors?: string[]
}


export default abstract class RailPartBase<P extends RailPartBaseProps, S> extends React.Component<P, S> {
  public static defaultProps: RailPartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivotJointIndex: 0,
    detectionEnabled: false,
    selected: false,
    opacity: 1,
    fillColors: RAIL_PART_FILL_COLORS
  }

  public static RAIL_SPACE = 38

  detectablePart: DetectablePart

  constructor(props: P) {
    super(props)
  }

  /**
   * 指定のジョイントの位置を返す。
   * @param {number} jointIndex
   * @returns {paper.Point}
   */
  getJointPosition(jointIndex: number) {
    // 決まった階層構造を前提としている。どのように実装を矯正すべきか？
    const {pivotPartIndex, pivot} = this.getPivot(jointIndex)
    return this.detectablePart.mainPart.children[pivotPartIndex].getPublicPivotPosition(pivot)
  }

  /**
   * 指定のジョイントの角度を返す。
   * @param {number} jointIndex
   * @returns {number}
   */
  getJointAngle(jointIndex: number) {
    const {pivotPartIndex, pivot} = this.getPivot(jointIndex)
    // レールパーツのグローバルな角度を取得
    const globalAngle = this.detectablePart.angle
    // レールパーツ内部のGroupにおけるPartのPivotにおける角度を取得
    let localAngle = this.detectablePart.mainPart.children[pivotPartIndex].getPivotAngle(pivot)
    if (pivot === Pivot.LEFT) {
      // console.log(`Joint ${jointIndex} ${globalAngle} + ${localAngle} + 180`)
      return globalAngle + localAngle + 180
    } else {
      // console.log(`Joint ${jointIndex} ${globalAngle} + ${localAngle}`)
      return globalAngle + localAngle
    }
  }

  abstract getPivot(jointIndex: number)

  abstract getAngle(jointIndex: number)
}

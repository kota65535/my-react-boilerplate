import * as React from "react";
import {Point, Path} from "paper";
import {Path as PathComponent} from "react-paper-bindings";
import {AnchorPoint} from "./RectPart";

export interface ArcPartProps {
  width: number
  radius: number
  centerAngle: number
  position: Point
  angle: number
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
  anchor?: AnchorPoint
}


export default class ArcPart extends React.Component<ArcPartProps, {}> {
  public static defaultProps: Partial<ArcPartProps> = {
    position: new Point(0, 0),
    angle: 0,
    fillColor: 'black',
    anchor: AnchorPoint.LEFT
  }

  _path: Path

  constructor (props: ArcPartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  get path() {
    return this._path
  }

  moveRelatively(difference: Point) {
    this._path.position = this._path.position.add(difference);
  }

  move(position: Point, anchor: Point = this._path.position): void {
    let difference = position.subtract(anchor);
    this.moveRelatively(difference);
  }

  // ========== Private methods ==========

  getCenterOfLeft(): Point {
    return this._path.segments[0].point
  }

  getCenterOfRight(): Point {
    // 90度ごとに右端のセグメントのインデックスがインクリメントされているらしい
    let correction = Math.floor((Math.abs(this.props.centerAngle) + 1) / 90)
    return this._path.segments[3 + correction].point
  }

  componentDidMount() {
    this.fixPositionByAnchorPoint()
  }

  componentDidUpdate() {
    this.fixPositionByAnchorPoint()
  }

  fixPositionByAnchorPoint() {
    switch (this.props.anchor) {
      case AnchorPoint.LEFT:
        this.move(this.props.position, this.getCenterOfLeft())
        break
      case AnchorPoint.RIGHT:
        this.move(this.props.position, this.getCenterOfRight())
        break
      case AnchorPoint.CENTER:
        // noop
        break
      default:
        throw Error(`Invalid anchor for ArcPart ${this.props.anchor}`)
    }
  }


  render() {
    const {position, angle, width, radius, centerAngle, fillColor, visible, opacity, selected} = this.props
    return <PathComponent
      pathData={createArcPath(width, radius, centerAngle)}
      position={position}
      rotation={angle}
      fillColor={fillColor}
      visible={visible}
      opacity={opacity}
      selected={selected}
      ref={(Path) => this._path = Path}
    />
  }
}

export function createArcPath(width: number, radius: number, centerAngle: number) {
  // 曲線の始点・終点の座標を計算
  let outerEndX = (radius + width/2) * Math.sin(centerAngle / 180 * Math.PI);
  let outerEndY = (radius + width/2) * (1 - Math.cos(centerAngle / 180 * Math.PI)) - width/2;
  let innerEndX = (radius - width/2) * Math.sin(centerAngle / 180 * Math.PI);
  let innerEndY = (radius - width/2) * (1 - Math.cos(centerAngle / 180 * Math.PI)) + width/2;

  let pathData = `M 0 0 L 0 ${-width/2}
  A ${radius + width/2} ${radius + width/2}, 0, 0, 1, ${outerEndX} ${outerEndY}
  L ${(outerEndX + innerEndX) / 2} ${(outerEndY + innerEndY) / 2} 
  L ${innerEndX} ${innerEndY} 
  A ${radius - width/2} ${radius - width/2} 0, 0, 0, 0 ${ width/2} Z`
  return pathData
}

import * as React from "react";
import {Point} from "paper";
import {Path as PathComponent} from "react-paper-bindings";
import {default as PartBase, PartBaseProps, Pivot} from "components/Rails/parts/primitives/PartBase";

export enum ArcDirection {
  RIGHT,
  LEFT
}

export interface ArcPartProps extends PartBaseProps {
  width: number
  radius: number
  centerAngle: number
  direction: ArcDirection
}


export default class ArcPart extends PartBase<ArcPartProps, {}> {

  constructor (props: ArcPartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  getCenterOfLeft(): Point {
    return this._path.segments[0].point
  }

  getCenterOfRight(): Point {
    // 90度ごとに右端のセグメントのインデックスがインクリメントされているらしい
    let correction = Math.floor((Math.abs(this.props.centerAngle) + 1) / 90)
    return this._path.segments[3 + correction].point
  }

  // ========== Private methods ==========

  componentDidMount() {
    this.fixPositionByPivot()
  }

  componentDidUpdate() {
    this.fixPositionByPivot()
  }

  fixPositionByPivot() {
    switch (this.props.pivot) {
      case Pivot.LEFT:
        this.move(this.props.position, this.getCenterOfLeft())
        break
      case Pivot.RIGHT:
        this.move(this.props.position, this.getCenterOfRight())
        break
      case Pivot.CENTER:
        // noop
        break
      default:
        throw Error(`Invalid pivot ${this.props.pivot} for ${this.constructor.name}`)
    }
  }


  render() {
    const {width, radius, centerAngle, direction,
      position, angle, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave} = this.props
    return <PathComponent
      pathData={createArcPath(width, radius, centerAngle, direction)}
      position={position}
      rotation={angle}
      fillColor={fillColor}
      visible={visible}
      opacity={opacity}
      selected={selected}
      name={name}
      data={data}
      onFrame={onFrame}
      onMouseDown={onMouseDown}
      onMouseDrag={onMouseDrag}
      onMouseUp={onMouseUp}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={(Path) => this._path = Path}
    />
  }
}

export function createArcPath(width: number, radius: number, centerAngle: number, direction: ArcDirection) {
  switch (direction) {
    case ArcDirection.RIGHT:
      return createArcPathRight(width, radius, centerAngle)
    case ArcDirection.LEFT:
      return createArcPathLeft(width, radius, centerAngle)
  }
}

const createArcPathRight = (width: number, radius: number, centerAngle: number) => {
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
  console.log(pathData)
  return pathData
}

const createArcPathLeft = (width: number, radius: number, centerAngle: number) => {
  // 曲線の始点・終点の座標を計算
  let outerEndX = (radius + width/2) * Math.sin(centerAngle / 180 * Math.PI);
  let outerEndY = - (radius + width/2) * (1 - Math.cos(centerAngle / 180 * Math.PI)) + width/2;
  let innerEndX = (radius - width/2) * Math.sin(centerAngle / 180 * Math.PI);
  let innerEndY = - (radius - width/2) * (1 - Math.cos(centerAngle / 180 * Math.PI)) - width/2;

  let pathData = `M 0 0 L 0 ${width/2}
  A ${radius + width/2} ${radius + width/2}, 0, 0, 0, ${outerEndX} ${outerEndY}
  L ${(outerEndX + innerEndX) / 2} ${(outerEndY + innerEndY) / 2} 
  L ${innerEndX} ${innerEndY} 
  A ${radius - width/2} ${radius - width/2} 0, 0, 1, 0 ${-width/2} Z`
  console.log(pathData)
  return pathData

}

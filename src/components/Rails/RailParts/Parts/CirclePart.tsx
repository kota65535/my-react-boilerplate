import * as React from "react";
import {Path as PathComponent} from "react-paper-bindings";
import PartBase, {PartBaseProps, Pivot} from "components/Rails/RailParts/Parts/PartBase";
import {Point} from "paper";

interface CirclePartProps extends PartBaseProps {
  radius: number
}

export default class CirclePart extends PartBase<CirclePartProps, {}> {

  constructor(props: CirclePartProps) {
    super(props)
  }

  getPivotAngle(pivot: Pivot) {
    return this.angle
  }

  getPublicPivotPosition(pivot: Pivot) {
    switch (pivot) {
      case Pivot.LEFT:
        return this.path.getPointAt(0)
      case Pivot.TOP:
        return this.path.getPointAt(this.path.length / 8 * 2)
      case Pivot.RIGHT:
        return this.path.getPointAt(this.path.length / 8 * 4)
      case Pivot.BOTTOM:
        return this.path.getPointAt(this.path.length / 8 * 6)
      case Pivot.CENTER:
      default:
        return this.path.position
    }
  }

  getPrivatePivotPosition(pivot: Pivot) {
    const {radius} = this.props
    switch (pivot) {
      case Pivot.LEFT:
        return new Point(0, 0)
      case Pivot.TOP:
        return new Point(radius, -radius)
      case Pivot.RIGHT:
        return new Point(radius * 2, 0)
      case Pivot.BOTTOM:
        return new Point(radius, radius)
      case Pivot.CENTER:
      default:
        return new Point(radius, 0)
    }
  }

  render() {
    const {
      radius,
      position, angle, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave
    } = this.props

    const pivot = this.getPrivatePivotPosition(this.props.pivot)

    return <PathComponent
      pathData={createCirclePath(radius)}
      pivot={pivot}     // pivot parameter MUST proceed to position
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


function createCirclePath(radius: number) {
  const pathData = `M 0 0 A ${radius},${radius} 0 0,1 ${radius * 2} 0 A ${radius} ${radius} 0 0,1 0 0 Z`
  return pathData
}

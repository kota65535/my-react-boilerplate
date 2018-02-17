import * as React from "react";
import {Point} from "paper";
import {Path as PathComponent} from "react-paper-bindings";
import {default as PartBase, PartBaseProps, Pivot} from "components/Rails/parts/primitives/PartBase";

export interface TrianglePartProps extends PartBaseProps {
  width: number
  height: number
}

export default class TrianglePart extends PartBase<TrianglePartProps, {}> {

  constructor (props: TrianglePartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  getPublicPivotPosition(pivot: Pivot) {
    switch (pivot) {
      case Pivot.TOP:
        return this.path.getPointAt(0)
      case Pivot.BOTTOM:
        return this.path.getPointAt(this.path.length / 8 * 2)
      case Pivot.CENTER:
      default:
        return this.path.position
    }
  }

  // ========== Private methods ==========

  getPrivatePivotPosition(pivot: Pivot) {
    const {height} = this.props
    switch (pivot) {
      case Pivot.TOP:
        return new Point(0, 0)
      case Pivot.BOTTOM:
        return new Point(0, height)
      case Pivot.CENTER:
      default:
        return new Point(0, height / 3 * 2)
    }
  }

  render() {
    const {width, height,
      position, angle, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave} = this.props

    const pivot = this.getPrivatePivotPosition(this.props.pivot)

    return <PathComponent
      pathData={createTrianglePath(width, height)}
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

export function createTrianglePath(width: number, height: number) {
  let pathData = `M 0 0 L ${width/2} ${height} L ${-width/2} ${height} Z`
  return pathData
}

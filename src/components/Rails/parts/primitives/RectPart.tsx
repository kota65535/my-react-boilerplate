import * as React from "react";
import {Point} from "paper";
import {Path as PathComponent} from "react-paper-bindings";
import PartBase, {PartBaseProps, Pivot} from "components/Rails/parts/primitives/PartBase";


interface RectPartProps extends PartBaseProps {
  width: number
  height: number
}


export default class RectPart extends PartBase<RectPartProps, {}> {

  constructor (props: RectPartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  getCenterOfTop(): Point {
    return this._path.curves[1].getLocationAt(this._path.curves[1].length/2).point;
  }

  getCenterOfBottom(): Point {
    return this._path.curves[4].getLocationAt(this._path.curves[4].length/2).point;
  }

  getCenterOfLeft(): Point {
    return this._path.segments[0].point
  }

  getCenterOfRight(): Point {
    return this._path.segments[3].point
  }

  // ========== Private methods ==========
  
  componentDidMount() {
    this.fixPositionByAnchorPoint()
  }

  componentDidUpdate() {
    this.fixPositionByAnchorPoint()
  }

  fixPositionByAnchorPoint() {
    switch (this.props.pivot) {
      case Pivot.LEFT:
        this.move(this.props.position, this.getCenterOfLeft())
        break
      case Pivot.TOP:
        this.move(this.props.position, this.getCenterOfTop())
        break
      case Pivot.RIGHT:
        this.move(this.props.position, this.getCenterOfRight())
        break
      case Pivot.BOTTOM:
        this.move(this.props.position, this.getCenterOfBottom())
        break
      case Pivot.CENTER:
        // noop
        break
      default:
        throw Error(`Invalid pivot ${this.props.pivot} for ${this.constructor.name}`)
    }
  }

  render() {
    const {width, height,
      position, angle, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave} = this.props
    return <PathComponent
      pathData={createRectPath(width, height)}
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


function createRectPath(width: number, height: number) {
  let pathData = `M 0 0 L 0 ${-height/2} ${width} ${-height/2} L ${width}} 0 L ${width} ${height/2} L 0 ${height/2} Z`
  return pathData
}

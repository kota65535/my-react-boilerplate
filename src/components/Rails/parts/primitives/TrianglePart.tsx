import * as React from "react";
import {Point, Path} from "paper";
import {Path as PathComponent} from "react-paper-bindings";
import {AnchorPoint} from "./RectPart";

export interface TrianglePartProps {
  width: number
  height: number
  position: Point
  angle: number
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
  anchor?: AnchorPoint
  name?: string
}


export default class TrianglePart extends React.Component<TrianglePartProps, {}> {
  public static defaultProps: Partial<TrianglePartProps> = {
    position: new Point(0, 0),
    angle: 0,
    fillColor: 'black',
    anchor: AnchorPoint.LEFT
  }

  _path: Path

  constructor (props: TrianglePartProps) {
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

  getCenterOfTop(): Point {
    return this._path.segments[0].point;
  }

  getCenterOfBottom(): Point {
    return this._path.curves[1].getLocationAt(this._path.curves[1].length/2).point;
  }

  // ========== Private methods ==========

  componentDidMount() {
    this.fixPositionByAnchorPoint()
  }

  componentDidUpdate() {
    this.fixPositionByAnchorPoint()
  }

  fixPositionByAnchorPoint() {
    switch (this.props.anchor) {
      case AnchorPoint.TOP:
        this.move(this.props.position, this.getCenterOfTop())
        break
      case AnchorPoint.BOTTOM:
        this.move(this.props.position, this.getCenterOfBottom())
        break
      case AnchorPoint.CENTER:
        // noop
        break
      default:
        throw Error(`Invalid anchor for TrianglePart ${this.props.anchor}`)
    }
  }

  render() {
    const {position, angle, width, height, fillColor, visible, opacity, selected} = this.props
    return <PathComponent
      pathData={createTrianglePath(width, height)}
      position={position}
      rotation={angle}
      fillColor={fillColor}
      visible={visible}
      opacity={opacity}
      selected={selected}
      name={name}
      ref={(Path) => this._path = Path}
    />
  }
}

export function createTrianglePath(width: number, height: number) {
  let pathData = `M 0 0 L ${width/2} ${height} L ${-width/2} ${height} Z`
  return pathData
}

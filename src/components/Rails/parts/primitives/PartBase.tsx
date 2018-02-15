import * as React from "react";
import {Path, Point} from "paper";

export enum Pivot {
  CENTER = 'Center',
  LEFT = 'Left',
  TOP = 'Top',
  RIGHT = 'Right',
  BOTTOM = 'Bottom',
}

interface Props extends Partial<DefaultProps> {
  position?: Point
  angle?: number
  pivot?: Pivot
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
  name?: string
  data?: object
  onFrame?: any
  onMouseDown?: any
  onMouseDrag?: any
  onMouseUp?: any
  onClick?: any
  onDoubleClick?: any
  onMouseMove?: any
  onMouseEnter?: any
  onMouseLeave?: any
}

interface DefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
}

export type PartBaseProps = Props & DefaultProps

export default class PartBase<P extends PartBaseProps, S> extends React.Component<P, S> {
  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    fillColor: 'black',
    visible: true,
    opacity: 1,
    selected: false,
  }

  _path: Path
  _angle: number

  constructor (props: P) {
    super(props)
    this._angle = this.props.angle
  }

  // ========== Public APIs ==========

  get path() {
    return this._path
  }

  get position() {
    return this._path.position
  }

  get angle() {
    return this._angle
  }

  moveRelatively(difference: Point) {
    this._path.position = this._path.position.add(difference);
  }

  move(position: Point, pivot: Point = this.position): void {
    let difference = position.subtract(pivot);
    this.moveRelatively(difference);
  }

  rotateRelatively(difference: number, pivot: Point = this.position) {
    this._angle += difference
    this.path.rotate(difference, pivot);
  }

  rotate(angle: number, pivot: Point = this.position) {
    let relAngle = angle - this.angle
    this.rotateRelatively(relAngle, pivot);
  }
}


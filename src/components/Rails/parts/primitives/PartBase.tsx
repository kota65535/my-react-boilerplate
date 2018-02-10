import * as React from "react";
import {Path, Point} from "paper";

export enum Pivot {
  CENTER = 'Center',
  LEFT = 'Left',
  TOP = 'Top',
  RIGHT = 'Right',
  BOTTOM = 'Bottom',
}

export interface PartBaseProps {
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


export interface PartBaseProps extends Partial<PartBaseDefaultProps> {
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

export interface PartBaseDefaultProps {
  position?: Point
  angle?: number
  pivot?: Pivot
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
}


export default class PartBase<P, S> extends React.Component<P, S> {
  public static defaultProps: PartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    fillColor: 'black',
    visible: true,
    opacity: 1,
    selected: false,
  }

  _path: Path

  constructor (props: P) {
    super(props)
  }

  // ========== Public APIs ==========

  get path() {
    return this._path
  }

  get position() {
    return this._path.position
  }

  moveRelatively(difference: Point) {
    this._path.position = this._path.position.add(difference);
  }

  move(position: Point, anchor: Point = this._path.position): void {
    let difference = position.subtract(anchor);
    this.moveRelatively(difference);
  }
}


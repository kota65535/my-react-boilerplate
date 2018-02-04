import * as React from "react";
import {Point, Path} from "paper";
import {Path as PathComponent} from "react-paper-bindings";

export enum AnchorPoint {
  CENTER = 'Center',
  LEFT = 'Left',
  TOP = 'Top',
  RIGHT = 'Right',
  BOTTOM = 'Bottom',
}

interface Props extends Partial<DefaultProps> {
  width: number
  height: number
  name?: string
}

interface DefaultProps {
  position?: Point
  angle?: number
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
  anchor?: AnchorPoint
}

export type RectPartProps = Props & DefaultProps;


export default class RectPart extends React.Component<RectPartProps, {}> {

  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    fillColor: 'black',
    visible: true,
    opacity: 1,
    selected: false,
    anchor: AnchorPoint.LEFT
  }

  _path: Path

  constructor (props: RectPartProps) {
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
    switch (this.props.anchor) {
      case AnchorPoint.LEFT:
        this.move(this.props.position, this.getCenterOfLeft())
        break
      case AnchorPoint.TOP:
        this.move(this.props.position, this.getCenterOfTop())
        break
      case AnchorPoint.RIGHT:
        this.move(this.props.position, this.getCenterOfRight())
        break
      case AnchorPoint.BOTTOM:
        this.move(this.props.position, this.getCenterOfBottom())
        break
      case AnchorPoint.CENTER:
        // noop
        break
      default:
        throw Error(`Invalid anchor for RectPart ${this.props.anchor}`)
    }
  }

  render() {
    const {position, angle, width, height, fillColor, visible, opacity, selected, name} = this.props
    return <PathComponent
      pathData={createRectPath(width, height)}
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


function createRectPath(width: number, height: number) {
  let pathData = `M 0 0 L 0 ${-height/2} ${width} ${-height/2} L ${width}} 0 L ${width} ${height/2} L 0 ${height/2} Z`
  return pathData
}

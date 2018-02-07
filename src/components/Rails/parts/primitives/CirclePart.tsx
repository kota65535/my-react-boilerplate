import * as React from "react";
import {Point, Path} from "paper";
import {Path as PathComponent} from "react-paper-bindings";

interface Props extends Partial<DefaultProps> {
  radius: number
  name?: string
}

interface DefaultProps {
  position?: Point
  fillColor?: string
  visible?: boolean
  opacity?: number
  selected?: boolean
  name?: string
  data?: object
}

export type CirclePartProps = Props & DefaultProps;

export default class CirclePart extends React.Component<CirclePartProps, {}> {

  public static defaultProps: DefaultProps = {
    position: new Point(0, 0),
    fillColor: 'black',
    visible: true,
    opacity: 1,
    selected: false,
  }

  _path: Path

  constructor (props: CirclePartProps) {
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

  render() {
    const {radius, position, fillColor, visible, opacity, selected, name, data} = this.props
    return <PathComponent
      pathData={createCirclePath(radius)}
      position={position}
      fillColor={fillColor}
      visible={visible}
      opacity={opacity}
      selected={selected}
      name={name}
      data={data}
      ref={(Path) => this._path = Path}
    />
  }
}


function createCirclePath(radius: number) {
  const pathData = `M 0 0 A ${radius},${radius} 0 0,1 ${radius*2} 0 A ${radius} ${radius} 0 0,1 0 0 Z`
  return pathData
}

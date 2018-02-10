import * as React from "react";
import {Path as PathComponent} from "react-paper-bindings";
import PartBase, {PartBaseProps} from "components/Rails/parts/primitives/PartBase";

interface CirclePartProps extends PartBaseProps {
  radius: number
}

export default class CirclePart extends PartBase<CirclePartProps, {}> {

  constructor (props: CirclePartProps) {
    super(props)
  }

  render() {
    const {radius,
      position, angle, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave} = this.props
    return <PathComponent
      pathData={createCirclePath(radius)}
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
  const pathData = `M 0 0 A ${radius},${radius} 0 0,1 ${radius*2} 0 A ${radius} ${radius} 0 0,1 0 0 Z`
  return pathData
}

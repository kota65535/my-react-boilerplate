import * as React from "react";
import {Point} from "paper";
import {Path} from "react-paper-bindings";
import RectPart from "./RectPart";

export interface DetectablePartProps {
  position: Point
  angle: number
  width: number
  height: number
  widthMargin: number
  heightMargin: number
  fillColors: string[]    // DetectionState ごとの色
  opacities: number[]     // DetectionState ごとの透過率
  detectionState: DetectionState
}

/**
 * 当たり判定による検出状態。
 */
export enum DetectionState {
  BEFORE_DETECT = 0,  // 検出前
  DETECTING,          // 検出中（カーソルが当たっている）
  AFTER_DETECT        // 検出後（クリックなどにより選択された）
}


export default class DetectablePart extends React.Component<DetectablePartProps, {}> {

  constructor (props: DetectablePartProps) {
    super(props)
  }

  calculateDetectionPartProps() {
    let props: any = {}
    switch (this.props.detectionState) {
      case DetectionState.BEFORE_DETECT:
      case DetectionState.DETECTING:
        props.visible = true
        break
      case DetectionState.AFTER_DETECT:
        props.visible = false
        break
    }
    props.opacity = this.props.opacities[this.props.detectionState]
    props.fillColor = this.props.fillColors[this.props.detectionState]
    return props
  }

  calculateMainPartProps() {
    let props: any = {}
    props.fillColor = this.props.fillColors[this.props.detectionState]
    return props
  }

  render() {
    const {position, angle, width, height, widthMargin, heightMargin} = this.props

    const mainProps = this.calculateMainPartProps()
    const detectProps = this.calculateDetectionPartProps()

    return [
      <RectPart
        position={position}
        angle={angle}
        width={width}
        height={height}
        fillColor={mainProps.fillColor}
      />,
      <RectPart
        position={position}
        angle={angle}
        width={width + widthMargin}
        height={height + heightMargin}
        visible={detectProps.visible}
        opacity={detectProps.opacity}
        fillColor={detectProps.fillColor}
      />
    ]
  }
}

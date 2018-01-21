import * as React from "react";
import {Point} from "paper";
import {Group} from "react-paper-bindings";
import {Path} from "paper";
import RectPart, {AnchorPoint} from "./RectPart";

export interface DetectablePartProps {
  position: Point
  angle: number
  width: number
  height: number
  widthMargin: number
  heightMargin: number
  fillColors: string[]    // DetectionState ごとの本体、当たり判定の色
  opacities: number[]     // DetectionState ごとの当たり判定の透過率
  detectionState: DetectionState
  anchor?: AnchorPoint
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

  _mainPart: RectPart|null
  _detectionPart: RectPart|null

  constructor (props: DetectablePartProps) {
    super(props)
  }

  componentDidMount() {
    this.fixDetectionPartPosition()
  }

  componentDidUpdate() {
    this.fixDetectionPartPosition()
  }

  fixDetectionPartPosition() {
    this._detectionPart!._path.position = this._mainPart!._path.position
  }

  calculateMainPartProps() {
    let props: any = {}
    props.fillColor = this.props.fillColors[this.props.detectionState]
    return props
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

  render() {
    const {position, angle, width, height, widthMargin, heightMargin, anchor} = this.props

    const mainProps = this.calculateMainPartProps()
    const detectProps = this.calculateDetectionPartProps()

    return [
      <Group>
        <RectPart
          position={position}
          angle={angle}
          width={width}
          height={height}
          fillColor={mainProps.fillColor}
          anchor={anchor}
          ref={(rectPart) => this._mainPart = rectPart}
        />
        <RectPart
          position={position}
          angle={angle}
          width={width + widthMargin * 2}
          height={height + heightMargin * 2}
          visible={detectProps.visible}
          opacity={detectProps.opacity}
          fillColor={detectProps.fillColor}
          anchor={anchor}
          ref={(rectPart) => this._detectionPart = rectPart}
        />
      </Group>
    ]
  }
}

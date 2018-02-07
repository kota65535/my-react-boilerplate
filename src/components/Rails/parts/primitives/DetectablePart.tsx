import * as React from "react";
import {Group} from "react-paper-bindings";
import {ReactElement, ReactNode} from "react";
import Point = paper.Point;


export interface DetectablePartProps {
  mainPart: ReactElement<any>       // 本体のコンポーネント
  detectionPart: ReactElement<any>  // 当たり判定のコンポーネント
  fillColors: string[]    // DetectionState ごとの本体、当たり判定の色
  mainPartOpacity: number
  detectionPartOpacity: number
  detectionState: DetectionState
  name?: string
  data?: object
}

/**
 * 当たり判定による検出状態。
 */
export enum DetectionState {
  DISABLED = 0,
  BEFORE_DETECT,  // 検出前
  DETECTING,          // 検出中（カーソルが当たっている）
  AFTER_DETECT        // 検出後（クリックなどにより選択された）
}


export default class DetectablePart extends React.Component<DetectablePartProps, {}> {

  // TODO: 利用可能なコンポーネントクラスに型を限定したい
  _mainPart: any
  _detectionPart: any

  constructor (props: DetectablePartProps) {
    super(props)
  }

  // ========== Public APIs ==========

  get mainPart() {
    return this._mainPart
  }

  get detectionPart() {
    return this._detectionPart
  }

  moveRelatively(difference: Point) {
    this.mainPart.moveRelatively(difference)
    this.detectionPart.moveRelatively(difference)
  }

  move(position: Point, anchor: Point = this.mainPart.position): void {
    this.mainPart.move(position, anchor)
    this.detectionPart.move(position, anchor)
  }

  // ========== Private methods ==========

  componentDidMount() {
    this.fixDetectionPartPosition()
  }

  componentDidUpdate() {
    this.fixDetectionPartPosition()
  }

  // 本体と当たり判定の中心位置を合わせたいが、本体の位置が確定した後でないとそれができない。
  // そのため両インスタンスを直接参照して位置を変更する
  fixDetectionPartPosition() {
    this._detectionPart.path.position = this._mainPart.path.position
  }

  // MainPartに追加するProps。既に指定されていたら上書き
  additionalMainPartProps() {
    let props: any = {}
    props.fillColor = this.props.fillColors[this.props.detectionState]
    props.opacity = this.props.mainPartOpacity
    props.name = this.props.name
    props.data = this.props.data
    props.ref = (_mainPart) => this._mainPart = _mainPart
    return props
  }

  // DetectionPartに追加するProps。既に指定されていたら上書き
  additionalDetectionPartProps() {
    let props: any = {}
    switch (this.props.detectionState) {
      case DetectionState.BEFORE_DETECT:
      case DetectionState.DETECTING:
        props.visible = true
        break
      case DetectionState.DISABLED:
      case DetectionState.AFTER_DETECT:
        props.visible = false
        break
    }
    props.opacity = this.props.detectionPartOpacity
    props.fillColor = this.props.fillColors[this.props.detectionState]
    props.name = this.props.name
    props.data = this.props.data
    props.ref = (_detectionPart) => this._detectionPart = _detectionPart
    return props
  }

  render() {
    const {mainPart, detectionPart, name, data} = this.props

    const addedMainPartProps = this.additionalMainPartProps()
    const addedDetectionPartProps = this.additionalDetectionPartProps()

    let clonedMainPart = React.cloneElement(mainPart, Object.assign({}, mainPart.props, addedMainPartProps))
    let clonedDetectionPart = React.cloneElement(detectionPart, Object.assign({}, detectionPart.props, addedDetectionPartProps))

    return [
      <React.Fragment>
        {clonedMainPart}
        {clonedDetectionPart}
      </React.Fragment>
    ]
  }
}

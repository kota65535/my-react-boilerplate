import * as React from "react";
import {Group} from "react-paper-bindings";
import {ReactElement, ReactNode} from "react";

export interface DetectablePartProps {
  mainPart: ReactElement<any>       // 本体のコンポーネント
  detectionPart: ReactElement<any>  // 当たり判定のコンポーネント
  fillColors: string[]    // DetectionState ごとの本体、当たり判定の色
  opacities: number[]     // DetectionState ごとの当たり判定の透過率
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

  // TODO: 利用可能なコンポーネントクラスに型を限定したい
  _mainPart: any
  _detectionPart: any

  constructor (props: DetectablePartProps) {
    super(props)
  }

  componentDidMount() {
    this.fixDetectionPartPosition()
  }

  componentDidUpdate() {
    this.fixDetectionPartPosition()
  }

  // 本体と当たり判定の中心位置を合わせたいが、本体の位置が確定した後でないとそれができない。
  // そのため両インスタンスを直接参照して位置を変更する
  fixDetectionPartPosition() {
    this._detectionPart!._path.position = this._mainPart!._path.position
  }

  // MainPartに追加するProps。既に指定されていたら上書き
  additionalMainPartProps() {
    let props: any = {}
    props.fillColor = this.props.fillColors[this.props.detectionState]
    props.ref = (mainPart) => this._mainPart = mainPart
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
      case DetectionState.AFTER_DETECT:
        props.visible = false
        break
    }
    props.opacity = this.props.opacities[this.props.detectionState]
    props.fillColor = this.props.fillColors[this.props.detectionState]
    props.ref = (detectionPart) => this._detectionPart = detectionPart
    return props
  }

  render() {
    const {mainPart, detectionPart} = this.props

    const addedMainPartProps = this.additionalMainPartProps()
    const addedDetectionPartProps = this.additionalDetectionPartProps()

    let clonedMainPart = React.cloneElement(mainPart, Object.assign({}, mainPart.props, addedMainPartProps))
    let clonedDetectionPart = React.cloneElement(detectionPart, Object.assign({}, detectionPart.props, addedDetectionPartProps))

    return [
      <Group>
        {clonedMainPart}
        {clonedDetectionPart}
      </Group>
    ]
  }
}

import * as React from "react";
import {ReactElement} from "react";
import {Group} from "react-paper-bindings";
import {Point} from "paper";
import PartBase, {PartBaseProps} from "components/Rails/RailParts/Parts/PartBase";
import PartGroup from "components/Rails/RailParts/Parts/PartGroup";


export interface DetectablePartProps extends PartBaseProps {
  mainPart: ReactElement<PartBase<PartBaseProps, {}>>         // 本体のコンポーネント
  detectionPart: ReactElement<PartBase<PartBaseProps, {}>>    //  当たり判定のコンポーネント
  fillColors: string[]    // DetectionState ごとの本体、当たり判定の色
  onLeftClick?: (e: MouseEvent) => void
  onRightClick?: (e: MouseEvent) => void
  detectionEnabled: boolean
  pivotPartIndex?: number
  onFixed?: () => void
}

export interface DetectablePartState {
  detectionState: DetectionState
  detectionPartVisible: boolean
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


export default class DetectablePart extends React.Component<DetectablePartProps, DetectablePartState> {

  _partGroup: PartGroup

  constructor(props: DetectablePartProps) {
    super(props)
    if (this.props.detectionEnabled) {
      this.state = {
        detectionState: DetectionState.BEFORE_DETECT,
        detectionPartVisible: true
      }
    } else {
      this.state = {
        detectionState: DetectionState.DISABLED,
        detectionPartVisible: false
      }
    }
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onClick = this.onClick.bind(this)
  }

  // ========== Public APIs ==========

  get mainPart() {
    return this._partGroup._children[0]
  }

  get detectionPart() {
    return this._partGroup._children[1]
  }

  get position() {
    return this._partGroup.position
  }

  get angle() {
    return this._partGroup.angle
  }

  resetDetectionState() {
    this.setState({
      detectionState: DetectionState.BEFORE_DETECT
    })
  }

  moveRelatively(difference: Point) {
    this.mainPart.moveRelatively(difference)
    this.detectionPart.moveRelatively(difference)
  }

  move(position: Point, anchor: Point = this.mainPart.position): void {
    this.mainPart.move(position, anchor)
    this.detectionPart.move(position, anchor)
  }

  rotateRelatively(difference: number, pivot: Point = this.position) {
    this.mainPart.rotateRelatively(difference, pivot);
    this.detectionPart.rotateRelatively(difference, pivot);
  }

  rotate(angle: number, pivot: Point = this.position) {
    this.mainPart.rotate(angle, pivot);
    this.detectionPart.rotate(angle, pivot);
  }

  // ========== Private methods ==========

  isDetecting() {
    return this.props.detectionEnabled && this.state.detectionState == DetectionState.DETECTING
  }
  isBeforeDetect() {
    return this.props.detectionEnabled && this.state.detectionState == DetectionState.BEFORE_DETECT
  }

  // detectionEnabledが OFF -> ON になった場合は状態をリセットする
  componentWillReceiveProps(nextProps: DetectablePartProps) {
    if (!this.props.detectionEnabled && nextProps.detectionEnabled) {
      this.setState({
        detectionState: DetectionState.BEFORE_DETECT,
        detectionPartVisible: true
      })
    }
  }

  onMouseMove = (e: MouseEvent) => {
    // 検出中状態を他のPathに邪魔されないよう、前面に出し続ける
    if (this.isDetecting()) {
      this._partGroup.group.bringToFront()
    }
  }

  onMouseEnter = (e: MouseEvent) => {
    // 検出前状態なら検出中状態に移行し、コールバックを呼んでやる
    if (this.isBeforeDetect()) {
      this.setState({
        detectionState: DetectionState.DETECTING,
        detectionPartVisible: true
      })
      if (this.props.onMouseEnter) {
        this.props.onMouseEnter(e)
      }
    }
  }

  onMouseLeave = (e: MouseEvent) => {
    // 検出中状態なら検出前状態に移行し、コールバックを呼んでやる
    if (this.isDetecting()) {
      this.setState({
        detectionState: DetectionState.BEFORE_DETECT,
        detectionPartVisible: true
      })
      if (this.props.onMouseLeave) {
        this.props.onMouseLeave(e)
      }
    }
  }

  onClick = (e: MouseEvent | any) => {
    // TODO: 左クリックと右クリックでイベントを分ける
    switch (e.event.button) {
      case 0:
        this.setState({
          detectionState: DetectionState.AFTER_DETECT,
          detectionPartVisible: false
        })
        if (this.props.onLeftClick) {
          this.props.onLeftClick(e)
        }
        break
      case 2:
        if (this.props.onRightClick) {
          this.props.onRightClick(e)
        }
        break
    }
  }


  render() {
    const {
      position, angle, pivot, pivotPartIndex, fillColors, onFixed, name, data, detectionEnabled,
      mainPart, detectionPart
    } = this.props

    // 主パーツの色を変更
    let clonedMainPart = React.cloneElement(mainPart as any, {
      ...mainPart.props,
      visible: true,
      fillColor: fillColors[this.state.detectionState]
    })

    // 検出パーツの色を変更
    // 検出無効状態なら描画しない
    let clonedDetectionPart
    if (detectionEnabled) {
      clonedDetectionPart = React.cloneElement(detectionPart as any, {
        ...detectionPart.props,
        visible: detectionEnabled ? this.state.detectionState : false,
        fillColor: fillColors[this.state.detectionState]
      })
    }

    return (
      <PartGroup
        position={position}
        angle={angle}
        pivot={pivot}
        pivotPartIndex={pivotPartIndex}
        fillColor={undefined}
        name={name}
        data={data}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
        onClick={this.onClick}
        onFixed={onFixed}
        ref={(r) => this._partGroup = r}
      >
        {clonedMainPart}
        {detectionEnabled && clonedDetectionPart}
      </PartGroup>
    )
  }
}

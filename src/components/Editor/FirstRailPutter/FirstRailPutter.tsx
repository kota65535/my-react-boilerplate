import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import RectPart from "../../rails/parts/primitives/RectPart";
import {getClosest} from "constants/utils";
import {SettingsStoreState} from "reducers/settings";
import RailFactory from "components/rails/RailFactory";
import {PaletteItem} from "store/type";
import {TEMPORARY_RAIL_OPACITY} from "constants/tools";
import getLogger from "logging";
import {RailData} from "components/rails";
import {WithBuilderPublicProps} from "components/hoc/withBuilder";

const LOGGER = getLogger(__filename)


enum Phase {
  SET_POSITION,
  SET_ANGLE
}

export interface FirstRailPutterProps {
  mousePosition: Point
  paletteItem: PaletteItem
  temporaryRails: RailData[]
  nextRailId: number
  activeLayerId: number
  settings: SettingsStoreState

  setTemporaryRail: (item: RailData) => void
  deleteTemporaryRail: () => void
  addRail: (item: RailData, overwrite?: boolean) => void
}

export interface FirstRailPutterState {
  fixedPosition: Point
  phase: Phase
}

type FirstRailPutterComposedProps = FirstRailPutterProps & WithBuilderPublicProps


export default class FirstRailPutter extends React.Component<FirstRailPutterComposedProps, FirstRailPutterState> {

  constructor(props: FirstRailPutterComposedProps) {
    super(props)
    this.state = {
      fixedPosition: null,
      phase: Phase.SET_POSITION
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick = (e: MouseEvent|any) => {
    switch (e.event.button) {
      case 0:
        this.mouseLeftDown(e)
        break
      case 2:
        this.mouseRightDown(e)
        break
    }
  }

  mouseLeftDown = (e: MouseEvent) => {
    if (this.state.phase === Phase.SET_ANGLE) {
      // 位置が決定済みならば角度を決定する
      this.onSetAngle()
    } else {
      // そうでなければ位置を決定する
      this.onSetPosition()
    }
  }

  mouseRightDown = (e: MouseEvent) => {
    // 位置が決定済みならキャンセルする
    if (this.state.phase === Phase.SET_ANGLE) {
      this.props.deleteTemporaryRail()
      this.setState({
        phase: Phase.SET_POSITION
      })
    }
  }

  onSetPosition = () => {
    const position = this.getNearestGridPosition(this.props.mousePosition)
    this.setState({
      fixedPosition: position,
      phase: Phase.SET_ANGLE
    })
  }

  onSetAngle = () => {
    this.addRail()
  }

  onMouseMove = (e: MouseEvent) => {
    if (this.state.phase === Phase.SET_ANGLE) {
      this.setTemporaryRail()
    }
  }


  render() {
    let position
    // 位置が定まっていたらもう動かさない
    if (this.state.phase === Phase.SET_ANGLE) {
      position = this.state.fixedPosition
    } else {
      position = this.getNearestGridPosition(this.props.mousePosition)
    }

    return (
      <RectPart
        width={700}
        height={700}
        position={position}
        fillColor={'orange'}
        opacity={0.1}
        onClick={this.onClick}
        onMouseMove={this.onMouseMove}

      />
    )
  }


  private getNearestGridPosition = (pos) => {
    const {paperWidth, paperHeight, gridSize} = this.props.settings
    const xNums = _.range(0, paperWidth, gridSize);
    const xPos = getClosest(pos.x, xNums)
    const yNums = _.range(0, paperHeight, gridSize);
    const yPos = getClosest(pos.y, yNums)
    return new Point(xPos, yPos)
  }

  private setTemporaryRail = () => {
    // マウス位置から一本目レールの角度を算出し、マーカー位置に仮レールを表示させる
    const itemProps = RailFactory[this.props.paletteItem.name]()
    const angle = getFirstRailAngle(this.state.fixedPosition, this.props.mousePosition)
    LOGGER.debug(`FirstAngle: ${angle}`) // `
    this.props.setTemporaryRail({
      ...itemProps,
      id: -1,
      name: 'TemporaryRail',
      position: this.state.fixedPosition,
      angle: angle,
      opacity: TEMPORARY_RAIL_OPACITY,
      enableJoints: false,
      pivotJointIndex: 0,
    })
  }

  private addRail = () => {
    // // パレットで選択したレール生成のためのPropsを取得
    const itemProps = RailFactory[this.props.paletteItem.name]()
    // 仮レールの位置にレールを設置
    this.props.addRail({
      ...itemProps,
      id: this.props.nextRailId,
      position: this.props.temporaryRails[0].position,
      angle: this.props.temporaryRails[0].angle,
      layerId: this.props.activeLayerId,
      opposingJoints: {},
      pivotJointIndex: 0,
    })
    this.props.deleteTemporaryRail()
  }
}


/**
 * 指定の点からマウスカーソルの位置を結ぶ直線の角度をstep刻みで返す。
 * @param {paper.Point} anchor
 * @param {paper.Point} cursor
 * @param {number} step
 * @returns {number}
 */
const getFirstRailAngle = (anchor: Point, cursor: Point, step: number = 45) => {
  const diffX = cursor.x - anchor.x
  const diffY = cursor.y - anchor.y
  const angle = Math.atan2(diffY, diffX) * 180 / Math.PI
  // このやり方では 0~180度の範囲でしか分からない
  // const diff = cursor.subtract(anchor)
  // const unit = new Point(1,0)
  // const angle = Math.acos(unit.dot(diff) / (unit.length * diff.length))
  const candidates = _.range(-180, 180, step)
  return getClosest(angle, candidates)
}

import * as React from "react";
import {Point} from "paper";
import {Rectangle} from "react-paper-bindings";
import Joint from "./parts/Joint";
import {BaseItemData, ItemData} from "reducers/layout";
import {PaletteItem, RootState} from "store/type";
import {default as withHistory, WithHistoryProps} from "components/hoc/withHistory";
import {connect} from "react-redux";
import {compose} from "recompose";
import {setTemporaryItem} from "actions/builder";
import * as _ from "lodash";


interface Props extends Partial<DefaultProps> {
  position: Point
  angle: number
  id: number
  activeLayerId: number
  name?: string
  layerId: number    // このアイテムが所属するレイヤー
}

interface DefaultProps {
  type?: string    // アイテムの種類、すなわちコンポーネントクラス。この文字列がReactElementのタグ名として用いられる
  selected?: boolean
  pivotJointIndex?: number
  opacity?: number
  hasOpposingJoints?: boolean[]
}

export type RailBaseProps = Props & DefaultProps


export abstract class RailBase<P extends RailBaseProps, S> extends React.Component<P, S> {
  public static defaultProps: DefaultProps = {
    type: 'RailBase',
    selected: false,
    pivotJointIndex: 0,
    opacity: 1,
    hasOpposingJoints: [false, false]
  }

  railParts: Array<any>
  joints: Array<Joint>

  constructor(props: P) {
    super(props)

    // this.onJointClick = this.onJointClick.bind(this)
  }

  abstract getJointPosition(jointId: number)
  abstract getJointAngle(jointId: number)

  componentDidUpdate() {
    this.fixRailPartPosition()
    this.fixJointsPosition()
  }

  componentDidMount() {
    this.fixRailPartPosition()
    this.fixJointsPosition()
  }

  // レールパーツの位置・角度をPivotJointの指定に合わせる
  fixRailPartPosition() {
    // console.log(this.joints[0].angle, this.getJointPosition(this.props.pivotJointIndex))
    const jointPosition = _.cloneDeep(this.getJointPosition(this.props.pivotJointIndex))
    this.railParts.forEach(r => r.rotate(
      this.joints[0].props.angle - this.joints[this.props.pivotJointIndex as number].props.angle + r.props.angle, jointPosition))
    this.railParts.forEach(r => r.move(
      this.props.position, jointPosition))
  }

  // ジョイントの位置はレールパーツの位置が確定しないと合わせられないため、後から変更する
  fixJointsPosition() {
    this.joints.forEach((joint, i) => joint.move(this.getJointPosition(i)))
    this.joints.forEach((joint, i) => joint.rotate(this.getJointAngle(i)))
  }
}

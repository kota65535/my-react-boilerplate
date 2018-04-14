import * as React from "react";
import {Layer} from "react-paper-bindings";
import {
  anglesEqual,
  createRailComponent,
  createRailGroupComponent,
  createRailOrRailGroupComponent,
  getRailComponent,
  pointsEqual
} from "components/rails/utils";
import {RailData, RailGroupData} from "components/rails";
import getLogger from "logging";
import {LayoutData} from "reducers/layout";
import Combinatorics from "js-combinatorics"
import * as _ from "lodash";
import {JointPair} from "components/hoc/withBuilder";
import {DetectionState} from "components/rails/parts/primitives/DetectablePart";
import shallowEqualObjects from "shallow-equal/objects"

const LOGGER = getLogger(__filename)

export interface LayoutProps {
  layout: LayoutData
  temporaryRails: RailData[]
  temporaryRailGroup: RailGroupData
  builderDisconnectJoint: (railId: number) => void
  builderConnectJoints: (pairs: JointPair[]) => void
  builderChangeJointState: (pairs: JointPair[], state: DetectionState) => void
}


export default class Layout extends React.Component<LayoutProps, {}> {

  temporaryCloseJoints: JointPair[]

  constructor(props: LayoutProps) {
    super(props)
    this.temporaryCloseJoints = []
  }

  componentDidUpdate(prevProps: LayoutProps) {
    // レイアウトのレールが追加・削除されたら、近傍ジョイントを探して自動的に接続する
    if (this.props.layout.rails.length !== prevProps.layout.rails.length) {
      // まずジョイントを全解除する。ちょっと乱暴ではある
      // this.props.layout.rails.forEach(r => this.props.builderDisconnectJoint(r.id))
      // その後近接するジョイント同士を接続する
      const jointPairs = getAllCloseJoints(this.props.layout.rails)
      LOGGER.info("Unconnected close joints", jointPairs)
      this.props.builderConnectJoints(jointPairs)
    }

    // 仮レールが追加または可視状態に変わった場合、近傍ジョイントを探して検出状態にする
    // TODO: 右クリックに対応できない。仮レールが変更された場合、で決め打ちしたほうがよいかも
    if (temporaryRailHasChangedVisible(this.props, prevProps)) {
      this.temporaryCloseJoints = _.flatMap(this.props.temporaryRails, r => getCloseJointsOf(r.id, this.props.layout.rails))
      LOGGER.info("Temporary rail's close joints", this.temporaryCloseJoints)
      this.props.builderChangeJointState(this.temporaryCloseJoints, DetectionState.DETECTING)
    }

    // 仮レールが削除または不可視状態に変わった場合、近傍ジョイントを探して非検出状態にする
    if (temporaryRailHasChangedInvisible(this.props, prevProps)) {
      this.props.builderChangeJointState(this.temporaryCloseJoints, DetectionState.BEFORE_DETECT)
      this.temporaryCloseJoints = []
    }
  }



  render() {
    const {layout, temporaryRails, temporaryRailGroup} = this.props

    return (
      <React.Fragment>
        <Layer
          key={-1}
          data={{id: -1, name: 'TemporaryLayer'}}
        >
          {temporaryRails.length > 0 &&
          createRailOrRailGroupComponent(temporaryRailGroup, temporaryRails)}
        </Layer>

        {
          layout.layers.map(layer =>
            <Layer
              data={layer}
              visible={layer.visible}
              key={layer.id}
            >
              { // レールグループに所属していないレールを生成する
                layout.rails
                  .filter(r => r.layerId === layer.id)
                  .filter(r => ! r.groupId)
                  .map(item => createRailComponent(item))
              }
              { // レールグループに所属しているレールを生成する
                // レールグループ内のレールは同じレイヤーに所属していなくても良い
                layout.railGroups
                  .map(item => {
                    const children = layout.rails.filter(c => c.groupId === item.id)
                    return createRailGroupComponent(item, children)
                  })
              }
            </Layer>
          )
        }
      </React.Fragment>
    )
  }

}


const getCloseJointsBetween = (r1: number, r2: number) => {
  const r1Joints = getRailComponent(r1).joints
  const r2Joints = getRailComponent(r2).joints

  const combinations = Combinatorics.cartesianProduct(r1Joints, r2Joints).toArray()
  const closeJointPairs = []
  combinations.forEach(cmb => {
    // 両方が未接続でなければ抜ける
    if (cmb[0].props.hasOpposingJoint && cmb[1].props.hasOpposingJoint
      || (! cmb[0].props.visible || ! cmb[1].props.visible) ) {
      return
    }
    // if ( ! cmb[0].props.visible || ! cmb[1].props.visible ) {
    //   return
    // }
    // LOGGER.debug(cmb[0].props.data.railId, cmb[0].globalPosition, cmb[0].globalAngle, cmb[1].props.data.railId, cmb[1].globalPosition, cmb[1].globalAngle)
    // ジョイント同士が十分近く、かつ角度が一致していればリストに加える
    const isClose = pointsEqual(cmb[0].globalPosition, cmb[1].globalPosition, 5)
    const isSameAngle = anglesEqual(cmb[0].globalAngle, cmb[1].globalAngle + 180, 5)
    LOGGER.debug(isClose, isSameAngle)
    if (isClose && isSameAngle) {
      closeJointPairs.push({
        from: {
          railId: cmb[0].props.data.railId,
          jointId: cmb[0].props.data.partId
        },
        to: {
          railId: cmb[1].props.data.railId,
          jointId: cmb[1].props.data.partId
        }
      })
    }
  })
  return closeJointPairs
}


const getCloseJointsOf = (r1: number, rails: RailData[]) => {
  return _.flatMap(rails, r2 => getCloseJointsBetween(r1, r2.id))
}


const getAllCloseJoints = (rails: RailData[]) => {
  if (rails.length < 2) {
    return []
  } else {
    const combinations = Combinatorics.combination(rails.map(r => r.id), 2).toArray()
    return _.flatMap(combinations, cmb => getCloseJointsBetween(cmb[0], cmb[1]))
  }
}


const temporaryRailHasChangedVisible = (currentProps: LayoutProps, prevProps: LayoutProps) => {
  const currentOnes = currentProps.temporaryRails
  const prevOnes = prevProps.temporaryRails
  // レールが追加された時
  if (currentOnes.length > prevOnes.length) return true
  // レールが現在可視状態で、以前と状態が異なる場合
  if (currentOnes.length > 0 && prevOnes.length > 0 && currentOnes[0].visible
    && ! shallowEqualObjects(currentOnes[0], prevOnes[0])) return true
  return false
}


const temporaryRailHasChangedInvisible = (currentProps: LayoutProps, prevProps: LayoutProps) => {
  const currentOnes = currentProps.temporaryRails
  const prevOnes = prevProps.temporaryRails
  // レールが削除された時
  if (currentOnes.length < prevOnes.length) return true
  // レールが現在不可視状態で、以前と状態が異なる場合
  if (currentOnes.length > 0 && prevOnes.length > 0 && ! currentOnes[0].visible
    && ! shallowEqualObjects(currentOnes[0], prevOnes[0])) return true
  return false
}


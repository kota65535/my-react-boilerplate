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

const LOGGER = getLogger(__filename)

export interface LayoutProps {
  layout: LayoutData
  temporaryRails: RailData[]
  temporaryRailGroup: RailGroupData
  builderConnectJoints: (pairs: JointPair[]) => void
}


export default class Layout extends React.Component<LayoutProps, {}> {

  componentDidUpdate(prevProps: LayoutProps) {
    if (this.props.layout.rails.length !== prevProps.layout.rails.length) {
      const jointPairs = this.getAllCloseJoints()
      LOGGER.info(jointPairs)
      this.props.builderConnectJoints(jointPairs)
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



  private getCloseJointsBetween(r1: number, r2: number) {
    const r1Joints = getRailComponent(r1).joints
    const r2Joints = getRailComponent(r2).joints

    const combinations = Combinatorics.cartesianProduct(r1Joints, r2Joints).toArray()
    const closeJointPairs = []
    combinations.forEach(cmb => {
      // 両方が未接続でなければ抜ける
      if (cmb[0].props.hasOpposingJoint || cmb[1].props.hasOpposingJoint) {
        return
      }
      // LOGGER.debug(cmb[0].props.data.railId, cmb[0].globalPosition, cmb[0].angle, cmb[1].props.data.railId, cmb[1].globalPosition, cmb[1].angle)
      // ジョイント同士が十分近く、かつ角度が一致していればリストに加える
      const isClose = pointsEqual(cmb[0].globalPosition, cmb[1].globalPosition, 0.1)
      const isSameAngle = anglesEqual(cmb[0].angle, cmb[1].angle + 180, 0.1)
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


  private getAllCloseJoints() {
    if (this.props.layout.rails.length < 2) {
      return []
    } else {
      const combinations = Combinatorics.combination(this.props.layout.rails.map(r => r.id), 2).toArray()
      return _.flatMap(combinations, cmb => this.getCloseJointsBetween(cmb[0], cmb[1]))
    }
  }
}

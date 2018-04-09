import * as React from "react";
import {Layer} from "react-paper-bindings";
import {createRailComponent, createRailGroupComponent, createRailOrRailGroupComponent} from "components/rails/utils";
import {RailData, RailGroupData} from "components/rails";
import getLogger from "logging";
import {LayoutData} from "reducers/layout";

const LOGGER = getLogger(__filename)

export interface TemporaryLayerProps {
  layout: LayoutData
  temporaryRails: RailData[]
  temporaryRailGroup: RailGroupData
}


export default class Layout extends React.Component<TemporaryLayerProps, {}> {
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

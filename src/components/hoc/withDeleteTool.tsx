import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";
import * as _ from "lodash";
import {PaletteItem, RootState} from "store/type";
import {ItemData, LayoutData, LayoutStoreState} from "reducers/layout";
import {currentLayoutData} from "selectors";
import {HitResult, Point, ToolEvent} from "paper";
import {selectPaletteItem} from "actions/builder";
import getLogger from "logging";
import * as update from "immutability-helper";

const LOGGER = getLogger(__filename)

export interface WithDeleteToolPublicProps {
  deleteToolMouseDown: any
}

interface WithDeleteToolPrivateProps {
  layout: LayoutStoreState
  activeLayerId: number
  lastSelectedItems: object
  selectPaletteItem: (item: PaletteItem) => void
}

export type WithDeleteToolProps = WithDeleteToolPublicProps & WithDeleteToolPrivateProps & WithHistoryProps


/**
 * レールの削除モードを提供するHOC。
 * 依存: WithHistory
 */
export default function withDeleteTool(WrappedComponent: React.ComponentClass<WithDeleteToolPublicProps & WithHistoryProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: currentLayoutData(state),
      activeLayerId: state.builder.activeLayerId,
      lastSelectedItems: state.builder.lastSelectedItems
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      selectPaletteItem: (item: PaletteItem) => dispatch(selectPaletteItem(item))
    }
  }

  class WithDeleteToolComponent extends React.Component<WithDeleteToolProps, {}> {

    constructor (props: WithDeleteToolProps) {
      super(props)

      this.mouseDown = this.mouseDown.bind(this)
    }


    //==================== MouseDown Handlers ====================

    mouseDown(e: ToolEvent|any) {
      switch (e.event.button) {
        case 0:
          this.mouseLeftDown(e)
          break
        case 2:
          this.mouseRightDown(e)
          break
      }
    }


    mouseLeftDown(e: ToolEvent|any) {
      this.removeSelectedRails()
    }

    removeSelectedRails() {
      const selectedRails = _.flatMap(this.props.layout.layers, layer => layer.children)
        .filter(item => item.selected)
      LOGGER.info(`[Builder] Selected rail IDs: ${selectedRails.map(r => r.id)}`)

      selectedRails.forEach(item => {
        this.disconnectJoint(item)
        this.props.removeItem(item)
      })
    }


    mouseRightDown(e: ToolEvent|any) {
      // noop
    }

    keyDown(e: ToolEvent|any) {
      switch (e.key) {
        case 'backspace':
          LOGGER.info(`backspape pressed`)
          this.removeSelectedRails()
          break
        case 'c':
          break
      }
    }

    disconnectJoint(railData: ItemData) {
      railData.opposingJoints.forEach(joint => {
        if (joint) {
          const railData = getRailDataById(this.props.layout, joint.railId)
          this.props.updateItem(railData, update(railData, {
            opposingJoints: {
              [joint.jointId]: {$set: null}
            }
          }), false)
        }
      })
    }


    render() {
      return (
        <WrappedComponent
          {...this.props}
          deleteToolMouseDown={this.mouseDown}
        />
      )
    }
  }


  return connect(mapStateToProps, mapDispatchToProps)(WithDeleteToolComponent)
}



export const hitTestAll = (point: Point): HitResult[] => {
  let hitOptions :any = {
    // class: Path,
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 0,
    // match: (result: HitResult) => {
    //   return result.item instanceof Path
    // },


  };
  let hitResults = (paperScope.project as any).hitTestAll(point, hitOptions);
  // Groupがひっかかるとうざいので取り除く
  // let hitResultsPathOnly = hitResults.filter(r => r.item.data.type === "Path");
  // return hitResultsPathOnly;
  return hitResults;
}



/**
 * 指定のRailIDを持つレールをレイアウトから探して返す。
 * @param {LayoutData} layout
 * @param {number} id
 * @returns {ItemData | undefined}
 */
const getRailDataById = (layout: LayoutData, id: number) => {
  let found = _.flatMap(layout.layers, layer => layer.children)
    .find(item => item.id === id)
  return found
}


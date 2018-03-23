import * as React from 'react'
import {connect} from 'react-redux';
import {PaletteItem, RootState} from "store/type";
import {LayoutData} from "reducers/layout";
import {currentLayoutData} from "selectors";
import {HitResult, Point, ToolEvent} from "paper";
import {selectPaletteItem} from "actions/builder";
import getLogger from "logging";
import {removeRail, updateRail} from "actions/layout";
import {LastPaletteItems} from "reducers/builder";
import {RailData} from "components/Rails";
import {WithBuilderPublicProps} from "components/hoc/withBuilder";

const LOGGER = getLogger(__filename)

export interface WithDeleteToolPublicProps {
  deleteToolMouseDown: any
}

interface WithDeleteToolPrivateProps {
  layout: LayoutData
  activeLayerId: number
  lastPaletteItems: LastPaletteItems
  selectPaletteItem: (item: PaletteItem) => void

  updateRail: (item: RailData, overwrite?: boolean) => void
  removeRail: (item: RailData, overwrite?: boolean) => void
}

export type WithDeleteToolProps = WithDeleteToolPublicProps & WithDeleteToolPrivateProps & WithBuilderPublicProps


/**
 * レールの削除モードを提供するHOC。
 * 依存: WithBuilder
 */
export default function withDeleteTool(WrappedComponent: React.ComponentClass<WithDeleteToolPublicProps>) {

  const mapStateToProps = (state: RootState): Partial<WithDeleteToolPrivateProps> => {
    return {
      layout: currentLayoutData(state),
      activeLayerId: state.builder.activeLayerId,
      lastPaletteItems: state.builder.lastPaletteItems
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      selectPaletteItem: (item: PaletteItem) => dispatch(selectPaletteItem(item)),
      updateRail: (item: RailData, overwrite = false) => dispatch(updateRail({item, overwrite})),
      removeRail: (item: RailData, overwrite = false) => dispatch(removeRail({item, overwrite})),
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
      const selectedRails = this.props.layout.rails.filter(r => r.selected)
        .filter(item => item.selected)
      LOGGER.info(`[Builder] Selected rail IDs: ${selectedRails.map(r => r.id)}`)

      selectedRails.forEach(item => {
        this.props.builderDisconnectJoint(item.id)
        this.props.removeRail(item)
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
  let hitResults = (window.PAPER_SCOPE.project as any).hitTestAll(point, hitOptions);
  // Groupがひっかかるとうざいので取り除く
  // let hitResultsPathOnly = hitResults.filter(r => r.item.data.type === "Path");
  // return hitResultsPathOnly;
  return hitResults;
}




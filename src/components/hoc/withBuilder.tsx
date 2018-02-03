import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";
import * as _ from "lodash";
import RailFactory from "../Rails/RailFactory";
import {PaletteItem, RootState} from "store/type";
import {ItemData, LayoutStoreState} from "reducers/layout";

export interface WithBuilderPublicProps {
  builderMouseDown: any
  builderMouseMove: any
}

interface WithBuilderPrivateProps {
  layout: LayoutStoreState
  selectedItem: PaletteItem
  activeLayerId: number
}

export type WithBuilderProps = WithBuilderPublicProps & WithBuilderPrivateProps & WithHistoryProps


/**
 * レールを設置する機能を提供するHOC。このアプリの中核機能。
 */
export default function withBuilder(WrappedComponent: React.ComponentClass<WithBuilderProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: state.layout,
      selectedItem: state.builder.selectedItem,
      activeLayerId: state.builder.activeLayerId
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {}
  }

  class WithBuilderComponent extends React.Component<WithBuilderProps, {}> {

    constructor (props: WithBuilderProps) {
      super(props)
      this.mouseDown = this.mouseDown.bind(this)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseRightDown = this.mouseRightDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
    }

    mouseDown(e) {
      switch (e.event.button) {
        case 0:
          this.mouseLeftDown(e)
          break
        case 2:
          this.mouseRightDown(e)
          break
      }
    }

    mouseLeftDown(e) {
      // this.props.deselectItem()
      // Paperオブジェクトを取得
      const paper = e.tool._scope
      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.selectedItem.name]()
      // レイヤーにレールを追加
      const item = this.props.addItem(this.props.activeLayerId, {
          ...itemProps,
        position: e.point
        } as ItemData
      )
      console.log(item)
    }

    mouseRightDown(e) {

    }

    mouseMove(e: any) {
      const paper = e.tool._scope
      let results = hitTestAll(paper, e.point)
      console.log(results)

      // const items =
      // const target = items.find(item => item.name == 'unko')
      //
      // if (this.isLayoutEmpty()) {
      //
      // }

    }

    isLayoutEmpty = () => {
      return _.flatMap(this.props.layout.layers, (layer) => layer.children).length > 0
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          builderMouseDown={this.mouseDown}
          builderMouseMove={this.mouseMove}
        />
      )
    }

  }

  return connect(mapStateToProps, mapDispatchToProps)(WithBuilderComponent)
}



export function hitTestAll(paper, point) {
  let hitOptions :any = {
    // class: Path,
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
  };
  let hitResults = (paper.project as any).hitTestAll(point, hitOptions);
    // Groupがひっかかるとうざいので取り除く
    // let hitResultsPathOnly = hitResults.filter(r => r.item instanceof paper.Path);
    // return hitResultsPathOnly;
    return hitResults;
    }

import * as React from 'react'
import {connect} from 'react-redux';
import {ItemData, WithHistoryProps} from "./withHistory";
import * as paper from "paper"
import {Path, ToolEvent} from "paper";
import * as _ from "lodash";
import RailFactory from "../Rails/RailFactory";

export interface WithBuilderInjectedProps {
  builderLeftMouseDown: any
  builderMouseMove: any
  selectedItem: PaletteItem
}

export type WithBuilderProps = WithBuilderInjectedProps & WithHistoryProps


/**
 * レールを設置する機能を提供するHOC。このアプリの中核機能。
 */
export default function withBuilder(WrappedComponent: React.ComponentClass<WithBuilderProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      selectedItem: state.builder.selectedItem,
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {}
  }

  class WithBuilderComponent extends React.Component<WithBuilderProps, {}> {

    constructor (props: WithBuilderProps) {
      super(props)
      this.mouseLeftDown = this.mouseLeftDown.bind(this)
      this.mouseMove = this.mouseMove.bind(this)
    }

    mouseLeftDown(e) {
      // this.props.deselectItem()
      // Paperオブジェクトを取得
      const paper = e.tool._scope

      // パレットで選択したレール生成のためのPropsを取得
      const itemProps = RailFactory[this.props.selectedItem.name]()

      // レイヤーにレールを追加
      const item = this.props.addItem(paper.project.activeLayer, {
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

      const items = _.flatMap(this.props.data.layers, (layer) => layer.children)
      const target = items.find(item => item.name == 'unko')

    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          builderLeftMouseDown={this.mouseLeftDown}
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

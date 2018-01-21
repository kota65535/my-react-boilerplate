import * as React from 'react'
import {connect} from 'react-redux';
import {ItemData, WithHistoryProps} from "./withHistory";
import {CurveRailItemData} from "../Rails/CurveRail";

export interface WithCurveRailInjectedProps {
  curveRailMouseDown: any
  selectedItem: PaletteItem
}

export type WithCurveRailProps = WithCurveRailInjectedProps & WithHistoryProps


export default function withCurveRail(WrappedComponent: React.ComponentClass<WithCurveRailProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      selectedItem: state.builder.selectedItem,
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {}
  }

  class WithCurveRailComponent extends React.Component<WithCurveRailProps, {}> {

    constructor (props: WithCurveRailProps) {
      super(props)
    }

    mouseDown = (e) => {
      // this.props.deselectItem()
      // Paperオブジェクトを取得
      const paper = e.tool._scope

      // アイテム情報を登録
      const item = this.props.addItem(paper.project.activeLayer, {
        type: 'CurveRail',
        position: e.point,
        angle: 40,
        centerAngle: 45,
        radius: 280
      } as CurveRailItemData)
      console.log(item)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          curveRailMouseDown={this.mouseDown}
        />
      )
    }

  }

  return connect(mapStateToProps, mapDispatchToProps)(WithCurveRailComponent)
}

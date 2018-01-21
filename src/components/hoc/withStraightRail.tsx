import * as React from 'react'
import {connect} from 'react-redux';
import {ItemData, WithHistoryProps} from "./withHistory";

export interface WithStraightRailInjectedProps {
  straightRailsMouseDown: any
  selectedItem: PaletteItem
}

export type WithStraightRailProps = WithStraightRailInjectedProps & WithHistoryProps


export default function withStraightRail(WrappedComponent: React.ComponentClass<WithStraightRailProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      selectedItem: state.builder.selectedItem,
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {}
  }

  class WithStraightRailComponent extends React.Component<WithStraightRailProps, {}> {

    constructor (props: WithStraightRailProps) {
      super(props)
    }

    mouseDown = (e) => {
      // this.props.deselectItem()
      // Paperオブジェクトを取得
      const paper = e.tool._scope

      // アイテム情報を登録
      const item = this.props.addItem(paper.project.activeLayer, {
        type: 'Circle',
        fillColor: 'red',
        radius: 10,
        position: e.point
      } as ItemData)
      console.log(item)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          straightRailsMouseDown={this.mouseDown}
        />
      )
    }

  }

  return connect(mapStateToProps, mapDispatchToProps)(WithStraightRailComponent)
}

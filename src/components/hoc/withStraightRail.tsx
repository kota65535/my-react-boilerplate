import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";

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
      const paper = e.tool._scope

      const circle = new paper.Path.Circle({
        center: e.point,
        fillColor: 'red',
        radius: 10
      })
      const item = this.props.addItem(circle.layer, {
        type: 'Circle',
        pathData: circle.getPathData(),
        fillColor: circle.fillColor.toCSS(true),
      } as PathItem)
      console.log(circle)
      console.log(circle.getPathData())
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

import * as React from 'react'
import {connect} from 'react-redux';
import {WithHistoryProps} from "./withHistory";

export interface WithCurveRailInjectedProps {
  selectedItem: PaletteItem
  curveRailMouseDown: any
}

export interface WithCurveRailState {
  lastSelectedItem: PaletteItem
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

  class WithCurveRailComponent extends React.Component<WithCurveRailProps, WithCurveRailState> {

    constructor (props: WithCurveRailProps) {
      super(props)
      this.state = {
        lastSelectedItem: {type: 'Curve Rails', name: 'C280-45'}
      }
    }

    mouseDown = (e) => {
      // this.props.deselectItem()
      const paper = e.tool._scope

      const circle = new paper.Path.Circle({
        center: e.point,
        fillColor: 'blue',
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
          curveRailMouseDown={this.mouseDown}
        />
      )
    }

  }

  return connect(mapStateToProps, mapDispatchToProps)(WithCurveRailComponent)
}

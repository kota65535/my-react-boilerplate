import * as React from 'react'
import {connect} from 'react-redux';
import {setTool, updateLastSelectedItems} from "../../actions/tools";
import {WithHistoryProps} from "./withHistory";
import {WithToolsInjectedProps} from "./withTools";

export interface WithBuilderInjectedProps {
  selectedItem: PaletteItem
  lastSelectedItems: PaletteItem[]
  builderMouseDown: any
  updateLastSelectedItems: (item: PaletteItem) => void
}

export type WithBuilderProps = WithBuilderInjectedProps & WithHistoryProps & WithToolsInjectedProps


export default function withBuilder(WrappedComponent: React.ComponentClass<WithBuilderProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      selectedItem: state.builder.selectedItem,
      lastSelectedItems: state.builder.lastSelectedItems
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      updateLastSelectedItems: (item: PaletteItem) => dispatch(updateLastSelectedItems(item))
    }
  }

  class WithBuilderComponent extends React.Component<WithBuilderProps, {}> {

    constructor (props: WithBuilderProps) {
      super(props)
    }

    mouseDown = (e) => {
      // this.props.deselectItem()
      const paper = e.tool._scope

      if (this.props.selectedItem.type === 'Straight Rails') {
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

      } else if (this.props.selectedItem.type === 'Curve Rails') {
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
      // circle.remove()
      // this.props.selectItem(item)
    }

    activateBuilderTool = () => {
      this.props.updateLastSelectedItems(this.props.selectedItem)
      this.props.setTool('Builder')
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          selectedItem={this.props.selectedItem}
          builderMouseDown={this.mouseDown}
        />
      )
    }

  }

  return connect(mapStateToProps, mapDispatchToProps)(WithBuilderComponent)
}

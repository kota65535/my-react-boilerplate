import * as React from 'react'
import {connect} from 'react-redux';
import {setTool} from "../../actions/tools";
import {WithHistoryProps} from "./withHistory";

export interface WithBuilderInjectedProps {
  // activeTool: string
  // setTool: (tool: string) => void
  builderMouseDown: any
}

export type WithBuilderProps = WithBuilderInjectedProps & WithHistoryProps


export default function withTools(WrappedComponent: React.ComponentClass<WithBuilderProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      // activeTool: state.tools.activeTool
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      // setTool: (tool: string) => dispatch(setTool(tool))
    }
  }

  class WithBuilderComponent extends React.Component<WithBuilderProps, {}> {
    private _prevTool: string | null;

    constructor(props: WithBuilderProps) {
      super(props)
      this.state = {
        activeTool: 'select',
      }
      this._prevTool = null
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
        circle.remove()
        // this.props.selectItem(item)
      }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          builderMouseDown={this.mouseDown}
        />
      )
    }

  }

  return connect(mapStateToProps, mapDispatchToProps)(WithBuilderComponent)
}

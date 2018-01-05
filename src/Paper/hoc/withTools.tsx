import * as React from 'react'
import {connect} from 'react-redux';
import {setTool} from "../../actions/tools";

export interface WithToolsInjectedProps {
  activeTool: string
  setTool: (tool: string) => void
}


export default function withTools(WrappedComponent: React.ComponentClass<WithToolsInjectedProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      activeTool: state.tools.activeTool
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setTool: (tool: string) => dispatch(setTool(tool))
    }
  }

  class WithToolsComponent extends React.Component<WithToolsInjectedProps, {}> {
    private _prevTool: string | null;

    constructor(props: WithToolsInjectedProps) {
      super(props)
      this.state = {
        activeTool: 'select',
      }
      this._prevTool = null
    }

    setTool = (activeTool: string) => {
      this.setState({ activeTool })
    }

    keyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && this.props.activeTool !== 'move') {
        this._prevTool = this.props.activeTool
        this.props.setTool('move')
      } else if (e.key === 'v') {
        this.props.setTool('move')
      } else if (e.key === 'a') {
        this.props.setTool('select')
      } else if (e.key === 'p') {
        this.props.setTool('circle')
      } else if (e.key === 'r') {
        this.props.setTool('rectangle')
      } else if (e.key === 'd') {
        this.props.setTool('delete')
      }
    }

    keyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && this.props.activeTool === 'move' && this._prevTool !== 'move') {
        this.setTool(this._prevTool!)
        this._prevTool = null
      }
    }

    componentDidMount() {
      document.addEventListener('keydown', this.keyDown)
      document.addEventListener('keyup', this.keyUp)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.keyDown)
      document.removeEventListener('keyup', this.keyUp)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          // activeTool={this.props.activeTool}
          // setTool={this.setTool}
        />
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithToolsComponent)
}

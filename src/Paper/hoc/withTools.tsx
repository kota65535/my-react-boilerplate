import * as React from 'react'

interface WithToolsInjectedProps {
  activeTool: string
  setTool: (tool: string) => void
}

interface WithToolsNeededProps {
}

type WithToolsProps = WithToolsInjectedProps & WithToolsNeededProps

interface WithToolsState {
  activeTool: string
}

export default function withTools(WrappedComponent: React.ComponentClass<WithToolsProps>) {

  return class extends React.Component<WithToolsProps, WithToolsState> {
    private _prevTool: string | null;

    constructor(props: WithToolsProps) {
      super(props)
      this.state = {
        activeTool: 'move',
      }
      this._prevTool = null
    }

    setTool = (activeTool: string) => {
      this.setState({ activeTool })
    }

    keyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && this.state.activeTool !== 'move') {
        this._prevTool = this.state.activeTool
        this.setState({ activeTool: 'move' })
      } else if (e.key === 'v') {
        this.setState({ activeTool: 'move' })
      } else if (e.key === 'a') {
        this.setState({ activeTool: 'select' })
      } else if (e.key === 'p') {
        this.setState({ activeTool: 'pen' })
      } else if (e.key === 'c') {
        this.setState({ activeTool: 'circle' })
      } else if (e.key === 'r') {
        this.setState({ activeTool: 'rectangle' })
      } else if (e.key === 'd') {
        this.setState({ activeTool: 'delete' })
      }
    }

    keyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && this.state.activeTool === 'move' && this._prevTool !== 'move') {
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
          activeTool={this.state.activeTool}
          setTool={this.setTool}
        />
      )
    }

  }

}

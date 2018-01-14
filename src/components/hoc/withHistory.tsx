import * as React from 'react';
import Layer = paper.Layer;
import Item = paper.Item;
import * as update from 'immutability-helper';

function getInitialId(data: any, id = 1) {
  data.forEach((item: any) => {
    if (item.id > id) {
      id = item.id + 1
    }
    if (item.children) {
      id = getInitialId(item.children, id)
    }
  })
  return id
}

// export interface HistoryItem {
//   id: number
//   type: string
//   pathData: string
//   fillColor: string
// }

interface WithHistoryNeededProps {
  initialData: any[]
}

interface WithHistoryInjectedProps {
  data: any
  addItem: (layer: Layer, data: PathItem) => PathItem
  updateItem: (a: any, b: any) => void
  removeItem: (item: any) => void
  deselectItem: () => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

export type WithHistoryProps = WithHistoryNeededProps & WithHistoryInjectedProps

export default function withHistory(WrappedComponent: React.ComponentClass<WithHistoryProps>) {

  return class extends React.Component<WithHistoryProps, any> {
    private _id: number;

    constructor(props: WithHistoryProps) {
      super(props)
      this.state = {
        historyIndex: 0,
        history: [props.initialData],
      }
      this._id = getInitialId(props.initialData)
    }

    keyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        this.undo()
      } else if (e.key === 'ArrowRight') {
        this.redo()
      }
    }

    addItem = (layer: Layer, data: PathItem): PathItem => {
      const history = this.getPrevHistory()
      const layerIndex = history.findIndex((l: any) => l.id === layer.data.id)
      const nextItem = Object.assign(data, { id: this._id })
      const nextHistory = update(history, {
        [layerIndex]: { children: { $push: [nextItem] } }
      })
      this.addHistory(nextHistory)
      this._id++
      return nextItem
    }

    updateItem = (item: PathItem, data: any) => {
      const history = this.getPrevHistory()
      const layerIndex = history.findIndex((l: any)  => l.id === item.layer.data.id)
      const children = history[layerIndex].children
      const itemIndex = children.findIndex((i: any) => i.id === item.id)
      const nextItem = Object.assign({}, children[itemIndex], data)
      const nextHistory = update(history, {
        [layerIndex]: { children: { [itemIndex]: { $set: nextItem } } }
      })
      this.addHistory(nextHistory)
      return nextItem
    }

    removeItem = (item: PathItem) => {
      const history = this.getPrevHistory()
      const layerIndex = history.findIndex((l: any) => l.id === item.layer.data.id)
      const children = history[layerIndex].children
      const itemIndex = children.findIndex((i: any) => i.id === item.id)
      const nextHistory = update(history, {
        [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
      })
      this.addHistory(nextHistory)
    }

    addHistory = (nextHistory: any) => {
      const historyIndex = this.state.historyIndex+1
      const history = [
        ...this.state.history.slice(0, historyIndex),
        nextHistory,
      ]
      this.setState({ historyIndex, history })
    }

    getPrevHistory = () => {
      return this.state.history[this.state.historyIndex]
    }

    clearHistory = () => {
      this.setState({
        historyIndex: 0,
        history: [this.props.initialData],
      })
    }

    undo = () => {
      const { historyIndex, history } = this.state
      if (historyIndex <= 0) {
        return
      }
      this.setState({
        historyIndex: historyIndex - 1,
        items: history[historyIndex],
      })
    }

    redo = () => {
      const { historyIndex, history } = this.state
      if (historyIndex >= (history.length - 1)) {
        return
      }
      this.setState({
        historyIndex: historyIndex + 1,
        items: history[historyIndex + 1],
      })
    }

    componentDidMount() {
      document.addEventListener('keydown', this.keyDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.keyDown)
    }

    render() {
      const { historyIndex, history } = this.state
      return (
        <WrappedComponent
          {...this.props}
          data={history[historyIndex]}

          addItem={this.addItem}
          removeItem={this.removeItem}
          updateItem={this.updateItem}

          canUndo={historyIndex > 0}
          canRedo={history.length > 1 && historyIndex + 1 < history.length}

          undo={this.undo}
          redo={this.redo}
          clearHistory={this.clearHistory}
        />
      )
    }

  }

}

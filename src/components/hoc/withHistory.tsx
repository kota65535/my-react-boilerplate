import * as React from 'react';
import * as update from 'immutability-helper';
import {ItemData, LayerData, LayoutData} from "reducers/layout";
import {connect} from "react-redux";
import {RootState} from "store/type";
import {clearHistory, setHistoryIndex, setLayers, setLayersNoHistory} from "actions/layout";
import {currentLayoutData, nextRailId} from "selectors";
import getLogger from "logging";

const LOGGER = getLogger(__filename)




export interface WithHistoryPublicProps {
  addItem: (layerId: number, item: ItemData) => ItemData
  updateItem: (oldItem: ItemData, newItem: ItemData, addHistory?: boolean) => void
  removeItem: (item: ItemData) => void
  setLayers: (layers: LayerData[]) => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

export interface WithHistoryPrivateProps {
  histories: LayoutData[]
  historyIndex: number
  layout: LayoutData
  nextId: number
  setLayers: (layers: LayerData[]) => void
  setLayersNoHistory: (layers: LayerData[]) => void
  setHistoryIndex: (index: number) => void
  clearHistory: () => void
}

export type WithHistoryProps = WithHistoryPublicProps & WithHistoryPrivateProps


/**
 * ヒストリー機能を提供するHOC
 */
export default function withHistory(WrappedComponent: React.ComponentClass<WithHistoryPublicProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      histories: state.layout.histories,
      historyIndex: state.layout.historyIndex,
      layout: currentLayoutData(state),
      nextId: nextRailId(state)
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setLayers: (layers: LayerData[]) => dispatch(setLayers({layers})),
      setLayersNoHistory: (layers: LayerData[]) => dispatch(setLayersNoHistory({layers})),
      clearHistory: () => dispatch(clearHistory({})),
      setHistoryIndex: (index: number) => dispatch(setHistoryIndex(index)),
    }
  }

  class WithHistory extends React.Component<WithHistoryProps, {}> {

    constructor(props: WithHistoryProps) {
      super(props)

      this.addItem = this.addItem.bind(this)
      this.updateItem = this.updateItem.bind(this)
      this.removeItem = this.removeItem.bind(this)
      this.undo = this.undo.bind(this)
      this.redo = this.redo.bind(this)
    }

    /**
     * 追加されるキー操作。
     * @param {KeyboardEvent} e
     */
    keyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.undo()
          break;
        case 'ArrowRight':
          this.redo()
          break;
      }
    }

    componentDidMount() {
      document.addEventListener('keydown', this.keyDown)
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.keyDown)
    }

    //==============================
    // ヒストリ操作系API
    //==============================

    addItem = (layerId: number, item: ItemData) => {
      // IDを振る
      item.id = this.props.nextId
      // 対象のレイヤーを探す
      const layerIndex = this.props.layout.layers.findIndex(layer => layer.id === layerId)
      const newLayout = update(this.props.layout, {
        layers: {
          [layerIndex]: { children: { $push: [item] } }
        }
      })
      this.addHistory(newLayout)
      return item
    }

    updateItem = (oldItem: ItemData, newItem: any, addHistory = true) => {
      // 対象のレイヤー、アイテムを探す
      const layerIndex = this.props.layout.layers.findIndex(layer => layer.id === oldItem.layerId)
      const itemIndex = this.props.layout.layers[layerIndex].children.findIndex((item) => item.id === oldItem.id)
      const newLayout = update(this.props.layout, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1, newItem]] } }
        }
      })
      if (addHistory) {
        this.addHistory(newLayout)
      } else {
        this.updateHistory(newLayout)
      }
    }

    removeItem = (item: ItemData) => {
      // 対象のレイヤー、アイテムを探す
      const layerIndex = this.props.layout.layers.findIndex(layer => layer.id === item.layerId)
      const itemIndex = this.props.layout.layers[layerIndex].children.findIndex((c) => c.id === item.id)
      const newLayout = update(this.props.layout, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
        }
      })
      this.addHistory(newLayout)
    }

    addHistory = (layoutData: LayoutData) => {
      // レイアウトデータをヒストリの最後尾に追加し、ヒストリインデックスをインクリメントする
      const historyIndex = this.props.historyIndex + 1
      const histories = [
        ...this.props.histories.slice(0, historyIndex),
        layoutData,
      ]
      this.props.setLayers(histories[historyIndex].layers)
    }

    updateHistory = (layoutData: LayoutData) => {
      this.props.setLayersNoHistory(layoutData.layers)
    }

    clearHistory = () => {
      this.props.clearHistory()
    }

    //==============================
    // アンドゥ・リドゥAPI
    //==============================

    undo = () => {
      if (this.canUndo()) {
        const historyIndex = this.props.historyIndex - 1
        // this.props.setLayers(this.props.histories[historyIndex].layers)
        LOGGER.info(`historyIndex: ${this.props.historyIndex} -> ${historyIndex}`)
        this.props.setHistoryIndex(historyIndex)
      }
    }

    redo = () => {
      if (this.canRedo()) {
        const historyIndex = this.props.historyIndex + 1
        this.props.setLayers(this.props.histories[historyIndex].layers)
        this.props.setHistoryIndex(historyIndex)
      }
    }

    canUndo = () => {
      return this.props.historyIndex > 0
    }

    canRedo = () => {
      return this.props.histories.length > 1 && this.props.historyIndex + 1 < this.props.histories.length
    }



    render() {
      return (
        <WrappedComponent
          {...this.props}
          addItem={this.addItem}
          removeItem={this.removeItem}
          updateItem={this.updateItem}

          undo={this.undo}
          redo={this.redo}
          canUndo={this.canUndo()}
          canRedo={this.canRedo()}
          clearHistory={this.clearHistory}
        />
      )
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(WithHistory)
}

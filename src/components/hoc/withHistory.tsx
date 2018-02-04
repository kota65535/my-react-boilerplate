import * as React from 'react';
import * as update from 'immutability-helper';
import * as _ from "lodash"
import {ItemData, LayerData, LayoutStoreState} from "reducers/layout";
import {connect} from "react-redux";
import {RootState} from "store/type";
import {setLayers} from "actions/layout";


const getNextItemId = (layout: LayoutStoreState, id = 1) => {
  // 全レイヤーのアイテムの全てのIDを列挙する
  let ids = _.flatMap(layout.layers, layer => layer.children.map(itemData => itemData.id))
  return ids.length > 0 ? Math.max(...ids) + 1 : 1
}



export interface WithHistoryPublicProps {
  addItem: (layerId: number, item: ItemData) => void
  updateItem: (oldItem: ItemData, newItem: ItemData) => void
  removeItem: (item: ItemData) => void
  setLayers: (layers: LayerData[]) => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

export interface WithHistoryPrivateProps {
  layout: LayoutStoreState
  setLayers: (layers: LayerData[]) => void
}

export type WithHistoryProps = WithHistoryPublicProps & WithHistoryPrivateProps


/**
 * ヒストリー機能を提供するHOC
 */
export default function withHistory(WrappedComponent: React.ComponentClass<WithHistoryProps>) {

  const mapStateToProps = (state: RootState) => {
    return {
      layout: state.layout
    }
  }

  const mapDispatchToProps = (dispatch: any) => {
    return {
      setLayers: (layers: LayerData[]) => dispatch(setLayers({layers}))
    }
  }

  class WithHistory extends React.Component<WithHistoryProps, {}> {
    private historyIndex: number           // どのヒストリデータを指しているかのインデックス     private histories: Lay
    private histories: LayoutStoreState[]  // アンドゥ・リドゥ用に保持するヒストリデータのリスト
    private _id: number


    constructor(props: WithHistoryProps) {
      super(props)
      this.historyIndex = 0
      this.histories = [props.layout]
      this._id = getNextItemId(props.layout)
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
      item.id = this._id
      // 対象のレイヤーを探す
      const layerIndex = this.props.layout.layers.findIndex(layer => layer.id === layerId)
      const newLayout = update(this.props.layout, {
        layers: {
          [layerIndex]: { children: { $push: [item] } }
        }
      })
      this.addHistory(newLayout)
      this._id++
    }

    updateItem = (oldItem: ItemData, newItem: any) => {
      // 対象のレイヤー、アイテムを探す
      const layerIndex = this.props.layout.layers.findIndex(layer => layer.id === oldItem.layerId)
      const itemIndex = this.props.layout.layers[layerIndex].children.findIndex((item) => item.id === oldItem.id)
      const newLayout = update(this.props.layout, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1, newItem]] } }
        }
      })
      this.addHistory(newLayout)
    }

    removeItem = (item: ItemData) => {
      // 対象のレイヤー、アイテムを探す
      const layerIndex = this.props.layout.layers.findIndex(layer => layer.id === item.layerId)
      const itemIndex = this.props.layout.layers[layerIndex].children.findIndex((item) => item.id === item.id)
      const newLayout = update(this.props.layout, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
        }
      })
      this.addHistory(newLayout)
    }

    addHistory = (currentState: LayoutStoreState) => {
      this.historyIndex += 1
      this.histories = [
        ...this.histories.slice(0, this.historyIndex),
        currentState,
      ]
      this.props.setLayers(this.histories[this.historyIndex].layers)
    }

    clearHistory = () => {
      this.historyIndex = 0
      this.histories = [this.props.layout]
    }

    //==============================
    // アンドゥ・リドゥAPI
    //==============================

    undo = () => {
      if (this.canUndo()) {
        this.historyIndex = this.historyIndex - 1
        this.props.setLayers(this.histories[this.historyIndex].layers)
      }
    }

    redo = () => {
      if (this.canRedo()) {
        this.historyIndex = this.historyIndex + 1
        this.props.setLayers(this.histories[this.historyIndex].layers)
      }
    }

    canUndo = () => {
      return this.historyIndex > 0
    }

    canRedo = () => {
      return this.histories.length > 1 && this.historyIndex + 1 < this.histories.length
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

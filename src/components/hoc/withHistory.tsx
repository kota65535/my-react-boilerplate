import * as React from 'react';
import * as update from 'immutability-helper';
import * as _ from "lodash"
import getLogger from "../../logging";
import {Point} from "paper";
import {StraightRailItemData, StraightRailProps} from "../Rails/StraightRail";
import {CurveRailItemData, CurveRailProps} from "../Rails/CurveRail";

const logger = getLogger('withHistory')


const getNextItemId = (data: HistoryData, id = 1) => {
  // 全レイヤーのアイテムの全てのIDを列挙する
  let ids = _.flatMap(data.layers, layer => layer.children.map(itemData => itemData.id))
  return ids.length > 0 ? Math.max(...ids) + 1 : 1
}

// エディター全体のデータと言い換えたほうがいいかもしれない
export interface HistoryData {
  id: number
  userName: number
  layers: LayerData[]
}

// レイヤーデータ。ヒストリーの管理対象はこれ
export interface LayerData {
  id: number
  children: ItemData[]
  visible: boolean
}

// レイヤー下のアイテム
export interface BaseItemData {
  id: number
  type: string    // アイテム名。この文字列がReactElementのタグ名として用いられる
  layer: Layer    // このアイテムが所属するレイヤー
}

export type ItemData = StraightRailItemData | CurveRailItemData


interface WithHistoryNeededProps {
  initialData: HistoryData
}

interface WithHistoryInjectedProps {
  data: HistoryData
  addItem: (layer: Layer, data: ItemData) => ItemData
  updateItem: (a: any, b: any) => void
  removeItem: (item: any) => void
  deselectItem: () => void
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  clearHistory: () => void
}

interface WithHistoryState {
  historyIndex: number      // どのヒストリデータを指しているかのインデックス
  histories: HistoryData[]  // アンドゥ・リドゥ用に保持するヒストリデータのリスト
  items: any
}

export type WithHistoryProps = WithHistoryNeededProps & WithHistoryInjectedProps

/**
 * ヒストリー機能を提供するHOC
 */
export default function withHistory(WrappedComponent: React.ComponentClass<WithHistoryProps>) {

  return class extends React.Component<WithHistoryProps, WithHistoryState> {
    private _id: number;

    constructor(props: WithHistoryProps) {
      super(props)
      this.state = {
        historyIndex: 0,
        histories: [props.initialData],
        items: null
      }
      this._id = getNextItemId(props.initialData)
      logger.info(this._id)

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

    addItem = (layer: Layer, data: ItemData): ItemData => {
      const history = this.getPrevHistory()
      const layerIndex = history.layers.findIndex((l: any) => l.id === layer.data.id)
      const nextItem = Object.assign(data, { id: this._id })
      // レイヤーデータにアイテムを追加する
      const nextHistory = update(history, {
        layers: {
          [layerIndex]: { children: { $push: [nextItem] } }
        }
      })
      this.addHistory(nextHistory)
      this._id++
      return nextItem
    }

    updateItem = (item: ItemData, data: any) => {
      const history = this.getPrevHistory()
      // 更新すべきアイテムを探す
      const layerIndex = history.layers.findIndex((l: any)  => l.id === item.layer.data.id)
      const children = history.layers[layerIndex].children
      const itemIndex = children.findIndex((i: any) => i.id === item.id)
      const nextItem = Object.assign({}, children[itemIndex], data)
      // レイヤーデータのアイテムを更新する
      const nextHistory = update(history, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
        }
      })
      this.addHistory(nextHistory)
      return nextItem
    }

    removeItem = (item: ItemData) => {
      const history = this.getPrevHistory()
      const layerIndex = history.layers.findIndex((l: any) => l.id === item.layer.data.id)
      const children = history[layerIndex].children
      const itemIndex = children.findIndex((i: any) => i.id === item.id)
      const nextHistory = update(history, {
        layers: {
          [layerIndex]: { children: { $splice: [[itemIndex, 1]] } }
        }
      })
      this.addHistory(nextHistory)
    }

    addHistory = (nextHistory: HistoryData) => {
      const historyIndex = this.state.historyIndex+1
      const histories = [
        ...this.state.histories.slice(0, historyIndex),
        nextHistory,
      ]
      this.setState({ historyIndex, histories })
    }

    getPrevHistory = (): HistoryData => {
      return this.state.histories[this.state.historyIndex]
    }

    clearHistory = () => {
      this.setState({
        historyIndex: 0,
        histories: [this.props.initialData],
      })
    }

    //==============================
    // アンドゥ・リドゥAPI
    //==============================

    undo = () => {
      if (this.canUndo()) {
        this.setState({
          historyIndex: this.state.historyIndex - 1,
        })
      }
    }

    redo = () => {
      if (this.canRedo()) {
        this.setState({
          historyIndex: this.state.historyIndex + 1,
        })
      }
    }

    canUndo = () => {
      return this.state.historyIndex > 0
    }

    canRedo = () => {
      return this.state.histories.length > 1 && this.state.historyIndex + 1 < this.state.histories.length
    }



    render() {
      const { historyIndex, histories } = this.state
      return (
        <WrappedComponent
          {...this.props}
          data={histories[historyIndex]}

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

}

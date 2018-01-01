import * as React from 'react';
import ToolEvent = paper.ToolEvent;
import KeyEvent = paper.KeyEvent;
import {WithHistoryProps} from './withHistory';

const HIT_TEST_OPTIONS = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 12,
};

interface WithSelectToolInjectedProps {
  selectItem: (_: {id: number, type: string}) => void
  updateItem: (a: any, b: any) => void
  removeItem: (item: any) => void
  deselectItem: () => void
  selectToolKeyDown: (e: KeyEvent) => void
  selectToolKeyUp: (e: KeyEvent) => void
  selectToolMouseDown: (e: ToolEvent) => void
  selectToolMouseDrag: (e: ToolEvent) => void
  selectToolMouseUp: (e: ToolEvent) => void
}

interface WithSelectToolState {
  activeLayer: number
  selectedItem: number|null
}

// depends on withHistory
export type WithSelectToolProps = WithSelectToolInjectedProps & WithHistoryProps

export default function withSelectTool(WrappedComponent: React.ComponentClass<WithSelectToolProps>) {

  return class extends React.Component<WithSelectToolProps, WithSelectToolState> {

    state: WithSelectToolState;
    private _changed: boolean;
    private _item: any;
    private _point: any;
    private _updateTimeout: any;

    constructor(props: WithSelectToolProps) {
      super(props);
      const d = props.initialData;
      const id = d && d[0] && d[0].id;
      this.state = {
        activeLayer: id,
        selectedItem: id,
      }
      this._changed = false
      this._item = null
      this._point = null
    }

    selectItem = ({id, type}: { id: number, type: string}) => {
      if (id === this.state.selectedItem) {
        return
      }
      switch (type) {
        case 'Layer':
          this.setState({ activeLayer: id, selectedItem: id })
          break
        case 'Path':
        case 'Circle':
        case 'Rectangle':
          this.setState({ selectedItem: id })
          break
        default:
          break
      }
    }

    deselectItem = () => {
      this.setState({ selectedItem: null })
    }

    keyDown = (e: KeyEvent) => {
      if (this._item) {
        const { key, modifiers: { shift } } = e
        switch (key) {
          case 'delete':
            this.props.removeItem(this._item)
            this._changed = false
            this._item = null
            this._point = null
            break
          case 'up':
            this._item.translate(0, shift ? -10 : -1)
            this._changed = true
            break
          case 'down':
            this._item.translate(0, shift ? 10 : 1)
            this._changed = true
            break
          case 'left':
            this._item.translate(shift ? -10 : -1, 0)
            this._changed = true
            break
          case 'right':
            this._item.translate(shift ? 10 : 1, 0)
            this._changed = true
            break
          default:
            break
        }
      }
    }

    keyUp = (e: KeyEvent) => {
      const { key } = e
      if (this._item && this._changed && key !== 'shift') {
        // debounce keyup item update
        // when user preses some key multiple times
        // we don't immediately record history change
        // because we would end up with many small changes
        if (this._updateTimeout) {
          clearTimeout(this._updateTimeout)
        }
        this._updateTimeout = setTimeout(() => {
          this.props.updateItem(this._item, {
            pathData: this._item.getPathData(),
            selected: true,
          })
          this._changed = false
          this._updateTimeout = null
        }, 350)
      }
    }

    // TODO: update ToolEvent type?
    mouseDown = (e: ToolEvent|any) => {
      this.deselectItem()
      const hit = e.tool.view._project.hitTest(e.point, HIT_TEST_OPTIONS)
      if (hit && hit.item && !hit.item.locked) {
        this.selectItem(hit.item.data)
        hit.item.bringToFront()
        this._item = hit.item
        this._point = e.point
        console.log(this._item)
        console.log(this._item.getPathData && this._item.getPathData())
      } else {
        this._item = null
        this._point = null
      }
    }

    mouseDrag = (e: ToolEvent) => {
      if (this._item && this._point) {
        this._item.translate(e.point.subtract(this._point))
        this._changed = true
        this._point = e.point
      }
    }

    mouseUp = (e: ToolEvent) => {
      if (this._item && this._changed) {
        this.props.updateItem(this._item, {
          pathData: this._item.getPathData(),
          selected: true,
        })
      }
      this._changed = false
      this._point = null
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          selectItem={this.selectItem}
          deselectItem={this.deselectItem}
          selectToolKeyDown={this.keyDown}
          selectToolKeyUp={this.keyUp}
          selectToolMouseDown={this.mouseDown}
          selectToolMouseDrag={this.mouseDrag}
          selectToolMouseUp={this.mouseUp}
        />
      )
    }

  }

}

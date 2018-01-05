import * as React from 'react'
import Draggable from 'react-draggable'
import LayersIcon from 'material-ui-icons/Layers'

import Item from './Item'

import './Layers.css'

export interface LayersProps {
  activeLayer: number
  data: any[]
  selectedItem: number
  selectItem: any
}

export interface LayersState {
  expanded: object
}

export default class Layers extends React.Component<LayersProps, LayersState> {

  constructor(props: LayersProps) {
    super(props)
    this.state = {
      expanded: {},
    }
  }

  handleArrowClick = ({ id }) => {
    const { expanded } = this.state
    this.setState({
      expanded: Object.assign({}, expanded, {
        [id]: typeof expanded[id] === 'undefined' ? false : !expanded[id]
      })
    })
  }

  handleLabelClick = (item) => {
    if (typeof this.props.selectItem === 'function') {
      this.props.selectItem(item)
    }
  }

  render() {
    const { activeLayer, data, selectedItem } = this.props
    const { expanded } = this.state
    const itemProps = {
      activeLayer,
      expanded,
      selectedItem,
      onArrowClick: this.handleArrowClick,
      onLabelClick: this.handleLabelClick,
    }
    return (
      <Draggable
        handle={'.Layers__title'}
      >
        <div className={'Layers'}>
          <div className={'Layers__title'} style={{cursor: 'move'}}>
            <LayersIcon/>
            <b>Layers</b>
          </div>
          <div className={'Layers__body'}>
            {data.map(({ id, type, children }) =>
              <Item
                id={id}
                key={id}
                type={type}
                children={children}
                {...itemProps}
              />
            )}
          </div>
        </div>
      </Draggable>
    )
  }

}

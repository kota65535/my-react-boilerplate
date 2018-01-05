import * as React from 'react'
import Tree from 'react-treeview'
import LayersIcon from 'material-ui-icons/Layers'
import FolderIcon from 'material-ui-icons/Folder'
import TimelineIcon from 'material-ui-icons/Timeline'
import LensIcon from 'material-ui-icons/Lens'

import Label from './Label'

import './Item.global.css'
import './Item.css'

function getIcon(type) {
  switch (type) {
    case 'Layer':     return (<LayersIcon style={{height: '16px', lineHeight: '20px', verticalAlign: 'middle'}}/>)
    case 'Group':     return (<FolderIcon className={'LayersIcon'} />)
    case 'Path':      return (<TimelineIcon className={'LayersIcon'} />)
    case 'Circle':    return (<LensIcon className={'LayersIcon'} />)
    case 'Rectangle': return 'crop_square'
    case 'Raster':    return 'photo'
    default:          return 'insert_drive_file'
  }
}

export interface ItemProps {
  id: any
  type: string
  expanded: object
  activeLayer: number
  selectedItem: number
  onArrowClick: any
  onLabelClick: any

}


export default class Item extends React.Component<ItemProps, {}> {


  handleArrowClick = () => {
    if (this.props.onArrowClick) {
      this.props.onArrowClick(this.props)
    }
  }

  render() {
    const {
      id, type, expanded,
      activeLayer, selectedItem, onLabelClick,
    } = this.props
    let children = this.props.children as any[]
    const isGroup = type === 'Group' || type === 'Layer'
    const hasChildren = children && children.length > 0
    const labelProps = {
      id, type,
      icon: getIcon(type),
      onClick: onLabelClick,
      selected: id === selectedItem || (id === activeLayer && !selectedItem),
    }
    const treeProps = {
      collapsed: expanded[id] === false,
      onClick: this.handleArrowClick,
      nodeLabel: <Label {...labelProps}>{type}</Label>,
    }
    return (
      <Tree styleName="LayersIcon" {...treeProps}>
        {hasChildren && children.map(({ id, type }) =>
          <Label
            key={id}
            selected={id === selectedItem}
            icon={getIcon(type)}
            onClick={onLabelClick}>
            {type}
          </Label>
        )}
        {/*{!hasChildren && isGroup &&*/}
          {/*<Label icon={'insert_drive_file'}>Empty</Label>}*/}
      </Tree>
    )
  }

}

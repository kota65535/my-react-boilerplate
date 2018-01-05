import * as React from 'react'

import './Item.global.css'

export interface LabelProps {
  icon: React.ReactNode | string
  // onClick: React.MouseEventHandler<HTMLElement>
  onClick?: (p: LabelProps) => void
  selected?: boolean
}


export default class Label extends React.Component<LabelProps, {}> {

  handleLabelClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props)
    }
  }

  render() {
    const { children, icon, selected } = this.props
    const className = `tree-view_label ${selected ? ' tree-view_label-selected': ''}`
    return (
      <div className={className} onClick={this.handleLabelClick}>
        {icon}
        <span>{children}</span>
      </div>
    )
  }

}

import * as React from "react";
import {Group as GroupComponent, Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {RailBase, RailBaseProps} from "components/rails/RailBase";
import {Group, Point} from "paper";

const LOGGER = getLogger(__filename)


export interface RailGroupProps extends RailBaseProps, Partial<RailGroupDefaultProps> {
  position: Point
  pivotRailIndex: number
  pivotJointIndex: number
}

export interface RailGroupDefaultProps {
  type: string
  pivotRailIndex: number
}


export default class RailGroup extends React.Component<RailGroupProps, {}> {
  public static defaultProps: RailGroupDefaultProps = {
    type: 'RailGroup',
    pivotRailIndex: 0
  }

  _group: Group
  _children: RailBase<any, any>[]

  get children() { return this._children }
  get group() { return this._group }

  constructor(props: RailGroupProps) {
    super(props)
    this._children = this.props.children ? new Array((this.props.children as any[]).length) : []
  }


  componentDidMount() {
    this.group.pivot = this.getPivotPosition()
    this.group.position = this.props.position
    LOGGER.info(`pivot=${this.getPivotPosition()}`)
  }


  render() {
    const {position, angle, pivotRailIndex, pivotJointIndex} = this.props
    const pivotPosition = this.getPivotPosition()
    const children = this.getChildComponents()

    return (
      <GroupComponent
        position={position}
        rotation={angle}
        pivot={pivotPosition}
        ref={(group) => this._group = group}

      >
        {children}
      </GroupComponent>
    )
  }

  getPivotPosition() {
    const {pivotRailIndex, pivotJointIndex} = this.props
    if (this.children[pivotRailIndex]) {
      return this.children[pivotRailIndex].railPart.getJointPositionToParent(pivotJointIndex)
    } else {
      return undefined
    }
  }

  getChildComponents() {
    // 子要素のメソッドを呼び出す必要があるので、refをそれらのpropsに追加する
    // TODO: childrenが空の時のエラー処理
    return React.Children.map(this.props.children, (child: any, i) => {
      // 動的に子要素を削除された場合、nullが入ってくるので対処する
      if (child) {
        return React.cloneElement(child as any, {
          ...child.props,
          ref: (node) => {
            this._children[i] = node
          }
        })
      }
      return null
    })
  }
}


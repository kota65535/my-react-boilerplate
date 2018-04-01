import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import getLogger from "logging";
import {RailData} from "components/rails/index";
import {RailBaseProps} from "components/rails/RailBase";
import {createRailComponent} from "components/rails/utils";

const LOGGER = getLogger(__filename)


export interface RailGroupProps extends RailBaseProps, Partial<RailGroupDefaultProps> {
  rails: RailData[]
  name: string
  nextRailId: number
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

  constructor(props: RailGroupProps) {
    super(props)
  }


  /**
   * 各レールの位置を計算する
   * @returns {paper.Point[]}
   */
  getEachRailPosition = () => {
    const {rails, pivotRailIndex, position} = this.props
    const pivotRailPosition = rails[pivotRailIndex].position
    const diff = position.subtract(pivotRailPosition)

    return rails.map(r => {
      return r.position.add(diff)
    })
  }


  render() {
    const positions = this.getEachRailPosition()
    LOGGER.info(positions)
    const {visible} = this.props
    return (
      <React.Fragment>
        {this.props.rails.map((railProps, idx) => {
          const props = {
            ...railProps,
            id: this.props.nextRailId,
            position: positions[idx],
            visible: visible
          }
          return createRailComponent(props)
        })}
      </React.Fragment>
    )
  }
}


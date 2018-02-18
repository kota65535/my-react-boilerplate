import * as React from "react";
import {Group, Point} from "paper";
import {Group as GroupComponent} from "react-paper-bindings";
import PartBase, {PartBaseDefaultProps, PartBaseProps, Pivot} from "components/Rails/parts/primitives/PartBase";


interface MultiPartProps extends PartBaseProps {
  pivotPartIndex?: number
  onFixed?: () => void
}

interface PartGroupState {
  group: Group
  pivotPoint: Point
}

export default class PartGroup extends PartBase<MultiPartProps, PartGroupState> {
  public static defaultProps: PartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    fillColor: undefined,
    visible: true,
    opacity: 1,
    selected: false,
  }

  constructor(props: MultiPartProps) {
    super(props)
    this.state = {
      group: null,
      pivotPoint: null
    }
    this._children = new Array((this.props.children as any[]).length)
    this._isFixed = false
  }

  _children: any[]
  _isFixed: boolean

  // ========== Public APIs ==========

  get group() {
    return this.state.group
  }

  get position() {
    return this.state.group.position
  }

  get angle() {
    return this._angle
  }

  get children() {
    return this._children
  }

  moveRelatively(difference: Point) {
    this.state.group.position = this.state.group.position.add(difference);
  }

  move(position: Point, pivot: Point = this.position): void {
    let difference = position.subtract(pivot);
    this.moveRelatively(difference);
  }

  rotateRelatively(difference: number, pivot: Point = this.position) {
    this._angle += difference
    this.group.rotate(difference);
  }

  rotate(angle: number, pivot: Point = this.position) {
    let relAngle = angle - this.angle
    if (relAngle !== 0) {
      this.rotateRelatively(relAngle);
    }
  }

  componentDidUpdate() {
    // PivotPointが設定された状態でレンダリングが終わって初めて位置・回転が確定する
    // その時にonFixedコールバックを呼んでやる
    if (!this._isFixed && this.state.pivotPoint) {
      if (this.props.onFixed) {
        this.props.onFixed()
      }
      this._isFixed = true
    }
  }

  // TODO: BoundingBoxのPivotの座標を外から取れるようにする
  getPublicPivotPosition(pivot: Pivot) {
    if (this.props.pivotPartIndex !== undefined) {
      return this._children[this.props.pivotPartIndex].getPublicPivotPosition(pivot)
    }
  }

  getPrivatePivotPosition(pivot: Pivot) {
    // PivotPartIndexが指定されていたら、指定のパーツのPivotを使用する
    // そうでなければBoundingBoxのPivotを使用する
    // 注: BoundingBoxのPivotはあまり使い勝手は良くない
    if (this.props.pivotPartIndex !== undefined) {
      return this._children[this.props.pivotPartIndex].getPublicPivotPosition(pivot)
    } else {
      return this.state.pivotPoint
    }
  }

  getPivotPointFromBoundingBox(group: Group) {
    const {pivot} = this.props
    const {width, height} = group.bounds
    switch (pivot) {
      case Pivot.LEFT:
        return new Point(-width / 2, 0)
      case Pivot.TOP:
        return new Point(0, -height / 2)
      case Pivot.RIGHT:
        return new Point(width / 2, 0)
      case Pivot.BOTTOM:
        return new Point(0, height / 2)
      case Pivot.CENTER:
      default:
        return new Point(0, 0)
    }
  }

  render() {
    const {
      pivot, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave
    } = this.props

    // 子要素のメソッドを呼び出す必要があるので、refをそれらのpropsに追加する
    const children = React.Children.map(this.props.children, (child: any, i) => {
      return React.cloneElement(child as any, {
        ...child.props,
        ref: (node) => {
          this._children[i] = node
        }
      })
    })

    // Pivotの座標を計算するには角度0でのGroupのBoundingBoxが必要なため、
    // Pivotの影響を受ける position, rotation をいったん無指定にして描画する。
    // その後、refによってGroupオブジェクトが取れたら上記を計算し、改めて描画する。
    let pivotPoint, angle, position = new Point(0, 0)
    if (this.state.pivotPoint) {
      pivotPoint = this.getPrivatePivotPosition(this.props.pivot)
      angle = this.props.angle
      position = this.props.position
    }
    console.log(pivotPoint)

    return (
      <GroupComponent
        pivot={pivotPoint}
        position={position}
        rotation={angle}
        fillColor={fillColor}
        visible={visible}
        opacity={opacity}
        selected={selected}
        name={name}
        data={data}
        onFrame={onFrame}
        onMouseDown={onMouseDown}
        onMouseDrag={onMouseDrag}
        onMouseUp={onMouseUp}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={(group) => {
          if (!this.state.group) {
            this.setState({
              group: group,
              pivotPoint: this.getPivotPointFromBoundingBox(group)
            })
          }
        }}
      >
        {children}
      </GroupComponent>
    )
  }
}



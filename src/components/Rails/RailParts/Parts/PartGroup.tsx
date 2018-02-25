import * as React from "react";
import {Group, Point} from "paper";
import {Group as GroupComponent} from "react-paper-bindings";
import PartBase, {PartBaseDefaultProps, PartBaseProps, Pivot} from "components/Rails/RailParts/Parts/PartBase";
import {pointsEqual} from "components/Rails/utils";


interface PartGroupProps extends PartBaseProps {
  pivotPartIndex?: number
  onFixed?: () => void
}

interface PartGroupState {
  pivotPoint: Point
}

export default class PartGroup extends PartBase<PartGroupProps, PartGroupState> {
  public static defaultProps: PartBaseDefaultProps = {
    position: new Point(0, 0),
    angle: 0,
    pivot: Pivot.CENTER,
    fillColor: undefined,
    visible: true,
    opacity: 1,
    selected: false,
  }

  constructor(props: PartGroupProps) {
    super(props)
    this.state = {
      pivotPoint: null
    }
    this._children = this.props.children ? new Array((this.props.children as any[]).length) : []
    this._isFixed = false
  }

  _group: Group
  _children: any[]
  _isFixed: boolean

  // ========== Public APIs ==========

  get group() {
    return this._group
  }

  get position() {
    return this._group.position
  }

  get angle() {
    return this._angle
  }

  get children() {
    return this._children
  }

  // PivotPointが設定された状態でレンダリングが終わって初めて位置・回転が確定する
  componentDidUpdate() {
    // 位置確定状態なら何もしない
    if (! this._isFixed) {
      if (this.state.pivotPoint) {
        // Pivot計算を行った直後の状態。onFixedコールバックを呼んでやる
        this._isFixed = true
        if (this.props.onFixed) {
          this.props.onFixed()
        }
      } else {
        // Pivotリセットを行った直後の状態。Pivotを再計算する。
        this.setState({
          pivotPoint: this.getLocalPivotPosition(this.props.pivot)
        })
      }
    }
    console.log(`${this.props.name} updated: position=${this.group.position} pivot=${this.group.pivot}`)
  }

  componentWillReceiveProps(nextProps: PartGroupProps) {
    super.componentWillReceiveProps(nextProps)

    // 位置確定済みのレールパーツにposition, angleの変更があったらPivotを再計算する
    if (this._isFixed && this.props.data && this.props.data.partType === 'RailPart') {
      if (! pointsEqual(this.props.position, nextProps.position)
        || this.props.angle !==  nextProps.angle) {
        // 位置を未確定にし、Pivotをリセットする
        this._isFixed = false
        this.setState({
          pivotPoint: null
        })
      }
    }
  }

  componentDidMount() {
    // マウントされたらrefでGroupオブジェクトが取れているので、Pivotを計算して再描画する
    let pivotPoint = this.getLocalPivotPosition(this.props.pivot)

    console.log(`${this.props.name} mounted. Group: position=${this.group.position} pivot=${this.group.pivot}`)
    console.log(`${this.props.name} calc pivot: pivotIndex=${this.props.pivotPartIndex}, pivot=${pivotPoint}`)

    // Hackyだが、親がこのGroupの位置を使ってPivotを計算できるよう、ここで実際に移動をさせてしまう
    // TODO: より洗練された方法があるか考える
    this.group.pivot = pivotPoint
    this.group.position = this.props.position

    this.setState({
      pivotPoint: pivotPoint
    })
  }

  getPivotAngle(pivot: Pivot) {
    return this.angle
  }

  getPivotPositionForGlobal(pivot: Pivot) {
    //TODO: impl
    return new Point(0, 0)
  }

  getPivotPositionForParent(pivot: Pivot) {
    // PivotPartIndexが指定されていたら、指定のパーツのPivotを使用する
    // そうでなければBoundingBoxのPivotを使用する
    if (this.props.pivotPartIndex !== undefined) {
      return this.group.localToParent(this._children[this.props.pivotPartIndex].getPivotPositionForParent(pivot))
    } else {
      return this.getPivotPositionFromBounds(pivot)
    }
  }

  getLocalPivotPosition(pivot: Pivot) {
    // PivotPartIndexが指定されていたら、指定のパーツのPivotを使用する
    // そうでなければBoundingBoxのPivotを使用する
    if (this.props.pivotPartIndex !== undefined) {
      return this._children[this.props.pivotPartIndex].getPivotPositionForParent(pivot)
    } else {
      return this.getPivotPositionFromBounds(pivot)
    }
  }

  getPivotPositionFromBounds(pivot: Pivot) {
    switch (pivot) {
      case Pivot.LEFT:
        return this.group.bounds.leftCenter
      case Pivot.TOP:
        return this.group.bounds.topCenter
      case Pivot.RIGHT:
        return this.group.bounds.rightCenter
      case Pivot.BOTTOM:
        return this.group.bounds.bottomCenter
      case Pivot.CENTER:
      default:
        return this.group.bounds.center
    }
  }

  render() {
    const {
      pivot, fillColor, visible, opacity, selected, name, data,
      onFrame, onMouseDown, onMouseDrag, onMouseUp, onClick, onDoubleClick, onMouseMove, onMouseEnter, onMouseLeave
    } = this.props

    // 子要素のメソッドを呼び出す必要があるので、refをそれらのpropsに追加する
    // TODO: childrenが空の時のエラー処理
    const children = React.Children.map(this.props.children, (child: any, i) => {
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

    // Pivotの座標を計算するには角度0でのGroupのBoundingBoxが必要なため、
    // Pivotの影響を受ける position, rotation をいったん無指定にして描画する。
    // その後、refによってGroupオブジェクトが取れたら上記を計算し、改めて描画する。
    let pivotPoint, position, angle
    if (this.state.pivotPoint) {
      pivotPoint = this.state.pivotPoint
      position = this.props.position
      angle = this.props.angle
    } else {
      // undefinedは入れない。再描画時におかしくなる
      pivotPoint = new Point(0, 0)
      position = new Point(0, 0)
      angle = 0
      // pivotPoint = undefined
      // position = undefined
      // angle = undefined
    }

    console.log(`${name} rendering : position=${position}, pivot=${pivotPoint}`)

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
        // refには一瞬だけ引数にnullが入ってくることがある。(https://github.com/facebook/react/issues/4533)
        // 直後に再度呼ばれて本物が入ってくるが、あまり凝ったことはせずにシンプルに保つべき
        ref={(group) => this._group = group}
      >
        {children}
      </GroupComponent>
    )
  }
}



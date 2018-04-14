import StraightRail, {StraightRailProps} from "./StraightRail/StraightRail";
import StraightRailContainer from "components/rails/StraightRail";
import CurveRail, {CurveRailProps} from "components/rails/CurveRail/CurveRail";
import CurveRailContainer from "components/rails/CurveRail";
import DoubleStraightRail, {DoubleStraightRailProps} from "components/rails/DoubleStraightRail/DoubleStraightRail";
import DoubleStraightRailContainer from "components/rails/DoubleStraightRail";
import DoubleCrossTurnout, {DoubleCrossTurnoutProps} from "components/rails/DoubleCrossTurnout/DoubleCrossTurnout";
import DoubleCrossTurnoutContainer from "components/rails/DoubleCrossTurnout";
import SimpleTurnout, {SimpleTurnoutProps} from "components/rails/SimpleTurnout/SimpleTurnout";
import SimpleTurnoutContainer from "components/rails/SimpleTurnout";
import {JointInfo, RailBaseProps} from "components/rails/RailBase";
import EndRailContainer from "components/rails/EndRail";
import EndRail from "components/rails/EndRail/EndRail";
import CrossingRailContainer from "components/rails/CrossingRail";
import CrossingRail from "components/rails/CrossingRail/CrossingRail";
import RailGroup from "components/rails/RailGroup";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainerClasses = {
  'StraightRail': StraightRailContainer,
  'CurveRail': CurveRailContainer,
  'SimpleTurnout': SimpleTurnoutContainer,
  'DoubleStraightRail': DoubleStraightRailContainer,
  'DoubleCrossTurnout': DoubleCrossTurnoutContainer,
  'EndRail': EndRailContainer,
  'CrossingRail': CrossingRailContainer,
  'RailGroup': RailGroup
}

export const RailComponentClasses = {
  StraightRail,
  CurveRail,
  SimpleTurnout,
  DoubleStraightRail,
  DoubleCrossTurnout,
  EndRail,
  CrossingRail
}

export default RailContainerClasses


// TODO: RailProps の方がわかりやすい名前では？
export type RailData = RailBaseProps | StraightRailProps | CurveRailProps | SimpleTurnoutProps | DoubleStraightRailProps | DoubleCrossTurnoutProps


export interface RailGroupData extends RailBaseProps {
  pivotJointInfo: JointInfo
  rails: number[]
}

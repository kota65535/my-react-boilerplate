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
import {RailBaseProps} from "components/rails/RailBase";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainerClasses = {
  'StraightRail': StraightRailContainer,
  'CurveRail': CurveRailContainer,
  'SimpleTurnout': SimpleTurnoutContainer,
  'DoubleStraightRail': DoubleStraightRailContainer,
  'DoubleCrossTurnout': DoubleCrossTurnoutContainer
}

export const RailComponentClasses = {
  StraightRail,
  CurveRail,
  SimpleTurnout,
  DoubleStraightRail,
  DoubleCrossTurnout
}

export default RailContainerClasses


// TODO: RailProps の方がわかりやすい名前では？
export type RailData = RailBaseProps | StraightRailProps | CurveRailProps | SimpleTurnoutProps | DoubleStraightRailProps | DoubleCrossTurnoutProps

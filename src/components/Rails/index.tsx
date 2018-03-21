import StraightRail, {StraightRailProps} from "./StraightRail";
import StraightRailContainer from "components/Rails/StraightRailContainer";
import CurveRailContainer from "components/Rails/CurveRailContainer";
import CurveRail, {CurveRailProps} from "components/Rails/CurveRail";
import DoubleStraightRail, {DoubleStraightRailProps} from "components/Rails/DoubleStraightRail";
import DoubleCrossTurnout, {DoubleCrossTurnoutProps} from "components/Rails/DoubleCrossTurnout";
import SimpleTurnout, {SimpleTurnoutProps} from "components/Rails/SimpleTurnout";
import SimpleTurnoutContainer from "components/Rails/SimpleTurnoutContainer";
import DoubleStraightRailContainer from "components/Rails/DoubleStraightRailContainer";
import DoubleCrossTurnoutContainer from "components/Rails/DoubleCrossTurnoutContainer";
import {RailBaseProps} from "components/Rails/RailBase";

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

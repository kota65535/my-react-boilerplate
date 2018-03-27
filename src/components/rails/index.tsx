import StraightRail, {StraightRailProps} from "./StraightRail";
import StraightRailContainer from "components/rails/StraightRailContainer";
import CurveRailContainer from "components/rails/CurveRailContainer";
import CurveRail, {CurveRailProps} from "components/rails/CurveRail";
import DoubleStraightRail, {DoubleStraightRailProps} from "components/rails/DoubleStraightRail";
import DoubleCrossTurnout, {DoubleCrossTurnoutProps} from "components/rails/DoubleCrossTurnout";
import SimpleTurnout, {SimpleTurnoutProps} from "components/rails/SimpleTurnout";
import SimpleTurnoutContainer from "components/rails/SimpleTurnoutContainer";
import DoubleStraightRailContainer from "components/rails/DoubleStraightRailContainer";
import DoubleCrossTurnoutContainer from "components/rails/DoubleCrossTurnoutContainer";
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

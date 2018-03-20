import StraightRail from "./StraightRail";
import StraightRailContainer from "components/Rails/StraightRailContainer";
import CurveRailContainer from "components/Rails/CurveRailContainer";
import CurveRail from "components/Rails/CurveRail";
import DoubleStraightRail from "components/Rails/DoubleStraightRail";
import DoubleCrossTurnout from "components/Rails/DoubleCrossTurnout";
import SimpleTurnout from "components/Rails/SimpleTurnout";
import SimpleTurnoutContainer from "components/Rails/SimpleTurnoutContainer";
import DoubleStraightRailContainer from "components/Rails/DoubleStraightRailContainer";
import DoubleCrossTurnoutContainer from "components/Rails/DoubleCrossTurnoutContainer";

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



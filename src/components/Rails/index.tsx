import StraightRail, {StraightRail as StraightRailComponent} from "./StraightRail";
import CurveRail, {CurveRail as CurveRailComponent} from "./CurveRail";
import SimpleTurnout, {SimpleTurnout as SimpleTurnoutComponent} from "components/Rails/SimpleTurnout";
// import ThreeWayTurnout, {ThreeWayTurnout as ThreeWayTurnoutComponent} from "components/Rails/ThreeWayTurnout";
import {DoubleStraightRail as DoubleStraightRailComponent} from "components/Rails/DoubleStraightRail";
import DoubleCrossTurnout, {DoubleCrossTurnout as DoubleCrossTurnoutComponent} from "components/Rails/DoubleCrossTurnout";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainers = {
  StraightRail,
  // DoubleStraightRail,
  CurveRail,
  SimpleTurnout,
  DoubleCrossTurnout
}

export const RailComponents = {
  'StraightRail': StraightRailComponent,
  'DoubleStraightRail': DoubleStraightRailComponent,
  'CurveRail': CurveRailComponent,
  'SimpleTurnout': SimpleTurnoutComponent,
  // 'ThreeWayTurnout': ThreeWayTurnoutComponent,
  'DoubleCrossTurnout': DoubleCrossTurnoutComponent
}

export default RailContainers



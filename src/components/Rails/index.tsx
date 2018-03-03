import StraightRail, {StraightRail as StraightRailComponent} from "./StraightRail";
import CurveRail, {CurveRail as CurveRailComponent} from "./CurveRail";
import SimpleTurnout, {SimpleTurnout as SimpleTurnoutComponent} from "components/Rails/SimpleTurnout";
import DoubleStraightRail, {DoubleStraightRail as DoubleStraightRailComponent} from "components/Rails/DoubleStraightRail";
import DoubleCrossTurnout, {DoubleCrossTurnout as DoubleCrossTurnoutComponent} from "components/Rails/DoubleCrossTurnout";
// import ThreeWayTurnout, {ThreeWayTurnout as ThreeWayTurnoutComponent} from "components/Rails/ThreeWayTurnout";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainers = {
  StraightRail,
  CurveRail,
  SimpleTurnout,
  DoubleStraightRail,
  DoubleCrossTurnout
}

export const RailComponents = {
  'StraightRail': StraightRailComponent,
  'CurveRail': CurveRailComponent,
  'SimpleTurnout': SimpleTurnoutComponent,
  'DoubleStraightRail': DoubleStraightRailComponent,
  'DoubleCrossTurnout': DoubleCrossTurnoutComponent
  // 'ThreeWayTurnout': ThreeWayTurnoutComponent,
}

export default RailContainers



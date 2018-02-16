import StraightRail, {StraightRail as StraightRailComponent} from "./StraightRail";
import CurveRail, {CurveRail as CurveRailComponent} from "./CurveRail";
import SimpleTurnout, {SimpleTurnout as SimpleTurnoutComponent} from "components/Rails/SimpleTurnout";
import ThreeWayTurnout, {ThreeWayTurnout as ThreeWayTurnoutComponent} from "components/Rails/ThreeWayTurnout";
import CrossoverTurnout, {CrossoverTurnout as CrossoverTurnoutComponent} from "components/Rails/CrossoverTurnout";
import DoubleStraightRail, {DoubleStraightRail as DoubleStraightRailComponent} from "components/Rails/DoubleStraightRail";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainers = {
  StraightRail,
  DoubleStraightRail,
  CurveRail,
  SimpleTurnout,
  ThreeWayTurnout,
  CrossoverTurnout
}

export const RailComponents = {
  'StraightRail': StraightRailComponent,
  'DoubleStraightRail': DoubleStraightRailComponent,
  'CurveRail': CurveRailComponent,
  'SimpleTurnout': SimpleTurnoutComponent,
  'ThreeWayTurnout': ThreeWayTurnoutComponent,
  'CrossoverTurnout': CrossoverTurnoutComponent
}

export default RailContainers



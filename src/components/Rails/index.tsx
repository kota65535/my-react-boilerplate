import StraightRail, {StraightRail as StraightRailComponent} from "./StraightRail";
import CurveRail, {CurveRail as CurveRailComponent} from "./CurveRail";
import SimpleTurnout, {SimpleTurnout as SimpleTurnoutComponent} from "components/Rails/SimpleTurnout";
import ThreeWayTurnout, {ThreeWayTurnout as ThreeWayTurnoutComponent} from "components/Rails/ThreeWayTurnout";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainers = {
  StraightRail,
  CurveRail,
  SimpleTurnout,
  ThreeWayTurnout
}

export const RailComponents = {
  'StraightRail': StraightRailComponent,
  'CurveRail': CurveRailComponent,
  'SimpleTurnout': SimpleTurnoutComponent,
  'ThreeWayTurnout': ThreeWayTurnoutComponent
}

export default RailContainers



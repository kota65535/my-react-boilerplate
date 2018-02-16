import StraightRail, {StraightRail as StraightRailComponent} from "./StraightRail";
import CurveRail, {CurveRail as CurveRailComponent} from "./CurveRail";
import SimpleTurnout, {SimpleTurnout as SimpleTurnoutComponent} from "components/Rails/SimpleTurnout";

// クラス名の文字列とクラスオブジェクトを関連付ける連想配列
// 新しいレールクラスを作成したらここに追加する必要がある
const RailContainers = {
  StraightRail,
  CurveRail,
  SimpleTurnout
}

export const RailComponents = {
  'StraightRail': StraightRailComponent,
  'CurveRail': CurveRailComponent,
  'SimpleTurnout': SimpleTurnoutComponent
}

export default RailContainers



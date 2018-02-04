import {RootState} from "store/type";
import * as _ from "lodash";

export const isLayoutEmpty = (state: RootState) => _.flatMap(state.layout.layers, (layer) => layer.children).length === 0

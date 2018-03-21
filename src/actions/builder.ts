import {createAction} from 'redux-actions';
import * as Actions from "constants/actions";
import {PaletteItem} from "store/type";
import {Point} from "paper";
import {BuilderPhase} from "reducers/builder";
import {RailData} from "components/Rails";

export const selectPaletteItem = createAction<PaletteItem>(Actions.BUILDER_SELECT_PALETTE_ITEM);
export const setPaletteMode = createAction<string>(Actions.SET_PALETTE_MODE);
export const setActiveLayer = createAction<number>(Actions.BUILDER_SET_ACTIVE_LAYER);
export const setMousePosition = createAction<Point>(Actions.BUILDER_SET_MOUSE_POSITION);
export const setPaperViewLoaded = createAction<boolean>(Actions.BUILDER_SET_PAPER_VIEW_LOADED);
export const setTemporaryItem = createAction<RailData>(Actions.BUILDER_SET_TEMPORARY_ITEM);
export const setTemporaryPivotJoint = createAction<number>(Actions.BUILDER_SET_TEMPORARY_PIVOT_JOINT);
export const setPhase = createAction<BuilderPhase>(Actions.BUILDER_SET_PHASE);
export const setMarkerPosition = createAction<Point>(Actions.BUILDER_SET_MARKER_POSITION);

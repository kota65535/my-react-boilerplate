import {createAction} from 'redux-actions';
import * as Actions from "actions/constants";
import {PaletteItem} from "store/type";
import {Point} from "paper";
import {BuilderPhase, UserRailGroupData} from "reducers/builder";
import {RailData} from "components/rails";

export const selectPaletteItem = createAction<PaletteItem>(Actions.BUILDER_SELECT_PALETTE_ITEM);
export const setPaletteMode = createAction<string>(Actions.SET_PALETTE_MODE);
export const setActiveLayer = createAction<number>(Actions.BUILDER_SET_ACTIVE_LAYER);
export const setMousePosition = createAction<Point>(Actions.BUILDER_SET_MOUSE_POSITION);
export const setPaperViewLoaded = createAction<boolean>(Actions.BUILDER_SET_PAPER_VIEW_LOADED);
export const setTemporaryRail = createAction<RailData>(Actions.BUILDER_SET_TEMPORARY_ITEM);
export const updateTemporaryItem = createAction<Partial<RailData>>(Actions.BUILDER_UPDATE_TEMPORARY_ITEM);
export const setPhase = createAction<BuilderPhase>(Actions.BUILDER_SET_PHASE);
export const setMarkerPosition = createAction<Point>(Actions.BUILDER_SET_MARKER_POSITION);
export const addUserRailGroup = createAction<UserRailGroupData>(Actions.BUILDER_ADD_USER_RAIL_GROUP)

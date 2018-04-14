import {RootState} from "store/type";
import {connect} from "react-redux";
import {deleteTemporaryRail, setTemporaryRail} from "actions/builder";
import FirstRailPutter, {FirstRailPutterProps} from "components/Editor/FirstRailPutter/FirstRailPutter";
import {RailData} from "components/rails";
import {addRail} from "actions/layout";
import {compose} from "recompose";
import withBuilder from "components/hoc/withBuilder";
import {nextRailId} from "selectors";


const mapStateToProps = (state: RootState) => {
  return {
    mousePosition: state.builder.mousePosition,
    paletteItem: state.builder.paletteItem,
    temporaryRails: state.builder.temporaryRails,
    nextRailId: nextRailId(state),
    activeLayerId: state.builder.activeLayerId,
    settings: state.settings
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTemporaryRail: (item: RailData) => dispatch(setTemporaryRail(item)),
    addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
    deleteTemporaryRail: () => dispatch(deleteTemporaryRail({})),
  }
}



export default compose<FirstRailPutterProps, FirstRailPutterProps|any>(
  withBuilder,
  connect(mapStateToProps, mapDispatchToProps),
)(FirstRailPutter)

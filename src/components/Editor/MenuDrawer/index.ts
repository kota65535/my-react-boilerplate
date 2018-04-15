import {RootState} from "store/type";
import {connect} from "react-redux";
import {currentLayoutData} from "selectors";
import {MenuDrawer} from "components/Editor/MenuDrawer/MenuDrawer";

const mapStateToProps = (state: RootState) => {
  return {
    authData: state.tools.authData,
    layoutMeta: state.layout.meta,
    currentLayoutData: currentLayoutData(state),
    userRailGroups: state.builder.userRailGroups,
    userCustomRails: state.builder.userCustomRails,
  }
};

const mapDispatchToProps = dispatch => {
  return {
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuDrawer)

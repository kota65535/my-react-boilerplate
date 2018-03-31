import {RootState} from "store/type";
import {setLayoutMeta} from "actions/layout";
import {connect} from "react-redux";
import {NewLayoutDialog} from "components/Editor/ToolBar/NewLayoutDialog/NewLayoutDialog";
import {LayoutMeta} from "reducers/layout";
import {currentLayoutData} from "selectors";

const mapStateToProps = (state: RootState) => {
  return {
    authData: state.tools.authData,
    layoutMeta: state.layout.meta,
    currentLayoutData: currentLayoutData(state),
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setLayoutMeta: (meta: LayoutMeta) => dispatch(setLayoutMeta(meta)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewLayoutDialog)

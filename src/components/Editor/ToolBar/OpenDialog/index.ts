import {RootState} from "store/type";
import {setLayoutData, setLayoutMeta} from "actions/layout";
import {connect} from "react-redux";
import {LayoutData, LayoutMeta} from "reducers/layout";
import {OpenDialog} from "components/Editor/ToolBar/OpenDialog/OpenDialog";

const mapStateToProps = (state: RootState) => {
  return {
    authData: state.tools.authData
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setLayoutData: (data: LayoutData) => dispatch(setLayoutData(data)),
    setLayoutMeta: (meta: LayoutMeta) => dispatch(setLayoutMeta(meta)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenDialog)

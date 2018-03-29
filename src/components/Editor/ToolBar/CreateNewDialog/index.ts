import {RootState} from "store/type";
import {setLayoutName} from "actions/layout";
import {connect} from "react-redux";
import {CreateNewDialog} from "components/Editor/ToolBar/CreateNewDialog/CreateNewDialog";

const mapStateToProps = (state: RootState) => {
  return {}
};

const mapDispatchToProps = dispatch => {
  return {
    setLayoutName: (name: string) => dispatch(setLayoutName(name))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewDialog)

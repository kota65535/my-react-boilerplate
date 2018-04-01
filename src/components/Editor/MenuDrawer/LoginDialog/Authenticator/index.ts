import {RootState} from "store/type";
import {connect} from "react-redux";
import {withSnackbar} from 'material-ui-snackbar-provider'
import {setAuthData} from "actions/tools";
import {Authenticator} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/Authenticator";

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAuthData: (authData) => dispatch(setAuthData(authData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticator) as any

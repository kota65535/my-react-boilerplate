import * as React from "react";
import {Authenticator} from "aws-amplify-react";
import {connect} from "react-redux";
import {RootState} from "store/type";
import {setAuthData} from "actions/tools";
import Amplify from "aws-amplify";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_10DFniZdX',
    userPoolWebClientId: '6fau1t5lddlta25uc0mk7m0iok',
    identityPoolId: 'us-east-1:895aff62-7b42-42d5-ac83-776a7eff35fc'
  }
});

const FEDERATED = {
  google_client_id: '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com',
  facebook_app_id: '154268202060246'
};

const mapStateToProps = (state: RootState) => {
  return {}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setAuthData: (authData) => dispatch(setAuthData(authData))
  }
}

class AuthenticatorContainer extends React.Component<any, any> {

  constructor(props) {
    super(props)
    this.onStateChange = this.onStateChange.bind(this)
  }

  onStateChange(state, data) {
    this.props.setAuthData(data)
    if (state == 'signedIn' && this.props.onSignedIn) {
      LOGGER.info(data) //`
      this.props.onSignedIn(data)
    }
  }

  render() {
    return (
      <Authenticator
        federated={FEDERATED}
        onStateChange={this.onStateChange}
        hideDefault={this.props.hidden}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatorContainer) as any

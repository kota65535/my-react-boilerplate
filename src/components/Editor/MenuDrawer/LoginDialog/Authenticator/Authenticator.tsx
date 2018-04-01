import * as React from "react";
import {Authenticator as AmplifyAuthenticator} from "aws-amplify-react";
import getLogger from "logging";

const LOGGER = getLogger(__filename)

const FEDERATED = {
  google_client_id: '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com',
  facebook_app_id: '154268202060246'
};


export class Authenticator extends React.Component<any, any> {

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
      <AmplifyAuthenticator
        federated={FEDERATED}
        onStateChange={this.onStateChange}
        hideDefault={this.props.hidden}
      />
    )
  }
}


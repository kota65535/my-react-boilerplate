import * as React from "react";
import {Auth, JS, Logger} from 'aws-amplify';

import {Button, Grid, TextField} from "material-ui";
import AuthPiece, {AuthState} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/AuthPiece/AuthPiece";
// import { FederatedButtons } from './FederatedSignIn';

const logger = new Logger('SignIn');

export default class SignIn extends AuthPiece<any, any> {
  constructor(props) {
    super(props);

    this.checkContact = this.checkContact.bind(this);
    this.signIn = this.signIn.bind(this);

    this._validAuthStates = ['signIn', 'signedOut', 'signedUp'];
    this.state = {};
  }

  checkContact(user) {
    Auth.verifiedContact(user)
      .then(data => {
        if (!JS.isEmpty(data.verified)) {
          this.changeState(AuthState.SIGNED_IN, user);
        } else {
          user = Object.assign(user, data);
          this.changeState(AuthState.VERIFY_CONTACT, user);
        }
      });
  }

  signIn() {
    const { username, password } = this.state.inputs;
    Auth.signIn(username, password)
      .then(user => {
        logger.debug(user);
        if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
          logger.debug('confirm user with ' + user.challengeName);
          this.changeState(AuthState.CONFIRM_SIGNIN, user);
        } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          logger.debug('require new password', user.challengeParam);
          this.changeState(AuthState.REQUIRE_NEW_PASSWORD, user);
        } else if (user.challengeName === 'MFA_SETUP') {
          logger.debug('TOTP setup', user.challengeParam);
          this.changeState(AuthState.TOTP_SETUP, user);
        }
        else {
          this.checkContact(user);
        }
      })
      .catch(err => {
        this.error(err)
      });
  }

  showComponent() {
    const { authState, hide, federated, onStateChange } = this.props;
    if (hide && hide.includes(SignIn)) { return null; }

    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              onChange={this.handleInputChange}
              label="User Name"
              name="username"
              key="username"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              fullWidth
              onChange={this.handleInputChange}
              type="password"
              label="Password"
              name="password"
              key="password"
            />
          </Grid>
        </Grid>
        <Grid container spacing={8} style={{marginTop: '16px'}}>
          <Grid item xs={12}>
            <Button fullWidth variant="raised" color="primary" onClick={this.signIn}>Login</Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => this.changeState(AuthState.FORGOT_PASSWORD)}>
              I forgot my password
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => this.changeState(AuthState.SIGN_UP)}>
              I want to create new account
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

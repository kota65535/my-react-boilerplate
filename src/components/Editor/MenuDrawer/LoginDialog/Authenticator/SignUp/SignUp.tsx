import * as React from "react";
import {Auth} from 'aws-amplify';

import AuthPiece, {
  AuthPieceProps,
  AuthPieceState,
  AuthState
} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/AuthPiece/AuthPiece";
import {Button, Grid} from "material-ui";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';

export interface SignUpProps {
}


export default class SignUp extends AuthPiece<AuthPieceProps, AuthPieceState> {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {}
    }

    this._validAuthStates = [AuthState.SIGN_UP];
    this.signUp = this.signUp.bind(this);
  }

  componentWillMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => value === this.state.inputs.password );
  }

  signUp() {
    const { email, password } = this.state.inputs;
    Auth.signUp(email, password, email)
      .then(() => this.changeState(AuthState.CONFIRM_SIGNUP, email))
      .catch(err => this.error(err));
  }

  canSignUp() {
    return ['email', 'password', 'confirmPassword'].map(e => this.state.inputs[e]).every(e => ! _.isEmpty(e))
  }

  showComponent() {
    // const { hide } = this.props;
    // if (hide && hide.includes(SignUp)) { return null; }

    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <ValidatorForm
              onError={errors => console.log(errors)}
            >
              <TextValidator
                autoFocus
                label="Email"
                name="email"
                key="email"
                value={this.state.inputs.email}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
                onChange={this.handleInputChange}
                fullWidth
              />
              <br />
              <TextValidator
                label="Password"
                type="password"
                name="password"
                key="password"
                value={this.state.inputs.password}
                validators={['required']}
                errorMessages={['this field is required']}
                onChange={this.handleInputChange}
                fullWidth
              />
              <TextValidator
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                key="confirmPassword"
                value={this.state.inputs.confirmPassword}
                validators={['isPasswordMatch', 'required']}
                errorMessages={['password mismatch', 'this field is required']}
                onChange={this.handleInputChange}
                fullWidth
              />
            </ValidatorForm>
          </Grid>
        </Grid>
        <Grid container spacing={8} style={{marginTop: '16px'}}>
          <Grid item xs={12}>
            <Button fullWidth variant="raised" color="primary"
                    disabled={! this.canSignUp()} onClick={this.signUp}>Sign Up</Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => this.changeState(AuthState.SIGN_IN)}>
              Sign into an existing account
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

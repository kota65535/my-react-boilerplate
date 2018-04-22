import * as React from 'react';
import {Auth, Logger} from 'aws-amplify';
import AuthPiece, {
  AuthPieceState,
  AuthState
} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/AuthPiece/AuthPiece";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import Typography from "material-ui/Typography";

const logger = new Logger('ForgotPassword');


interface ForgotPasswordState extends AuthPieceState {
  delivery: any
}


export default class ForgotPassword extends AuthPiece<any, ForgotPasswordState> {

  constructor(props) {
    super(props);

    this._validAuthStates = [AuthState.FORGOT_PASSWORD]
    this._form = null
    this.state = {
      inputs: {},
      disabled: true,
      delivery: null
    }
  }

  sendEmail = (e) => {
    const { email } = this.state.inputs;
    Auth.forgotPassword(email)
      .then(data => {
        logger.debug(data)
        this.setState({ delivery: data.CodeDeliveryDetails });
      })
      .catch(err => this.error(err));
  }

  sendView() {
    return (
      <div>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <ValidatorForm
              ref={(form) => this._form = form}
            >
              <TextValidator
                autoFocus
                label="Email"
                name="email"
                key="email"
                value={this.state.inputs.email}
                onChange={this.handleInputChange}
                validatorListener={this.handleValidation}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
                fullWidth
              />
            </ValidatorForm>
          </Grid>
        </Grid>
        <Grid container spacing={8} style={{marginTop: '16px'}}>
          <Grid item xs={12}>
            <Button fullWidth variant="raised" color="primary"
                    disabled={this.state.disabled} onClick={this.sendEmail}>
              Send Email
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={() => this.changeState(AuthState.SIGN_IN)}>
              Back to Sign In
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }

  submitView() {
    return (
      <div>
        <Grid container spacing={8}>
          <Typography>
            Please open the sent email and follow the link.
          </Typography>
        </Grid>
        <Grid container spacing={8} style={{marginTop: '16px'}}>
          <Grid item xs={12}>
            <Button onClick={() => this.changeState(AuthState.SIGN_IN)}>
              Back to Sign In
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }

  showComponent() {
    return (
      <div>
        { this.state.delivery? this.submitView() : this.sendView() }
      </div>
    )
  }
}

import * as React from 'react';
import {Logger} from 'aws-amplify';
import AuthPiece, {AuthState} from "components/common/Authenticator/AuthPiece/AuthPiece";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import Typography from "material-ui/Typography";

const logger = new Logger('ForgotPassword');


export default class ConfirmEmail extends AuthPiece<any, any> {

  constructor(props) {
    super(props);

    this._validAuthStates = [AuthState.CONFIRM_EMAIL]
    this.state = {
      inputs: {},
      disabled: true,
    }
  }

  showComponent() {
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
}

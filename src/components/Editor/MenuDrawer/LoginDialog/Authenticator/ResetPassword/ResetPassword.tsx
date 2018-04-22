import * as React from 'react';
import {Auth, Logger} from 'aws-amplify';
import AuthPiece, {
  AuthPieceProps,
  AuthPieceState,
  AuthState
} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/AuthPiece/AuthPiece";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import {CenteredGrid} from "components/Editor/MenuDrawer/LoginDialog/Authenticator/ResetPassword/styles";
import Typography from "material-ui/Typography";
import {RouteComponentProps, withRouter} from "react-router";

const logger = new Logger('ResetPassword');


interface ResetPasswordProps extends AuthPieceProps {
  code: string
  userName: string
}

interface ResetPasswordState extends AuthPieceState {
  success: boolean
}


export class ResetPassword extends AuthPiece<ResetPasswordProps & RouteComponentProps<{}>, ResetPasswordState> {
  public static defaultProps: Partial<ResetPasswordProps> = {
    authState: AuthState.FORGOT_PASSWORD
  }

  _form: any

  constructor(props) {
    super(props);

    this._form = null
    this._validAuthStates = [AuthState.FORGOT_PASSWORD]
    this.state = {
      inputs: {},
      success: false
    }
  }

  componentWillMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => value === this.state.inputs.password );
  }

  onSubmit = () => {
    const { code, userName } = this.props
    const { password } = this.state.inputs
    Auth.forgotPasswordSubmit(userName, code, password)
      .then(data => {
        this.setState({success: true})
        setTimeout(() => {
          this.props.history.push('/')
        }, 3000)
      })
      .catch(err => this.error(err));
  }

  handleInputChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    const check_type = ['radio', 'checkbox'].includes(type);
    this.setState({
      inputs: {
        ...this.state.inputs as any,
        [name]: check_type ? checked : value
      }
    })
  }

  canSubmit = () => {
    if (! this._form) return false

    return this._form.errors.length === 0
      && ['password', 'confirmPassword'].map(e => this.state.inputs[e]).every(e => ! _.isEmpty(e))
  }


  successView = () => {
    return (
      <div>
        <CenteredGrid container>
          <Grid item xs={12}>
            <Typography>Successfully reset password!</Typography>
            <Typography>Automatically jump to editor after 3 sec.</Typography>
          </Grid>
        </CenteredGrid>
      </div>
    )
  }

  inputView = () => {
    return (
      <div>
        <CenteredGrid container>
          <Grid item xs={12}>
            <ValidatorForm
              ref={(form) => this._form = form}
            >
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
              <br />
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
        </CenteredGrid>
        <CenteredGrid container spacing={8} style={{marginTop: '16px'}}>
          <Grid item xs={12}>
            <Button variant="raised" color="primary"
                    disabled={! this.canSubmit()} onClick={this.onSubmit}>
              Change Password
            </Button>
          </Grid>
        </CenteredGrid>
      </div>
    )
  }


  showComponent() {
    return (
      <div>
        {this.state.success ? this.successView() : this.inputView()} )
      </div>
    )
  }
}


export default withRouter(ResetPassword) as any

import * as React from 'react';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import lightBlue from 'material-ui/colors/lightBlue';
import cyan from 'material-ui/colors/cyan';
import green from 'material-ui/colors/green';
import {Provider} from "react-redux";
import {configureStore} from "./store";
import {SnackbarProvider} from 'material-ui-snackbar-provider'
import CssBaseline from "material-ui/CssBaseline";

// A theme with custom primary and secondary color.
// It's optional.
export const theme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: green,
  },
  // ボタンの文字を勝手に大文字にするのをやめる
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});


const snackbarProps = {
  autoHideDuration: 4000,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  }
  // style: {
  //   width: theme.spacing.unit * 4,
  //   height: theme.spacing.unit * 4,
  // }
}


const store = configureStore();

function withRoot(Component: React.ComponentType) {
  function WithRoot(props: object) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline>
            <SnackbarProvider snackbarProps={snackbarProps}>
              {/* the rest of your app belongs here, e.g. the router */}
              <Component {...props} />
            </SnackbarProvider>
          </CssBaseline>
        </MuiThemeProvider>
      </Provider>
    );
  }

  return WithRoot;
}

export default withRoot;

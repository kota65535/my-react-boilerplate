import * as React from 'react';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import lightBlue from 'material-ui/colors/lightBlue';
import cyan from 'material-ui/colors/cyan';
import green from 'material-ui/colors/green';
import Reboot from 'material-ui/Reboot';
import {Provider} from "react-redux";
import {configureStore} from "./store";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: green,
  },
});


const store = configureStore();

function withRoot(Component: React.ComponentType) {
  function WithRoot(props: object) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
          <Reboot>
            <Component {...props} />
          </Reboot>
        </MuiThemeProvider>
      </Provider>
    );
  }

  return WithRoot;
}

export default withRoot;

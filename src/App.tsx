import * as React from 'react'
import Editor from 'components/Editor/Editor'

import './App.css'

import {BrowserRouter as Router, Route} from "react-router-dom";
import {StyleRulesCallback, WithStyles} from 'material-ui/styles'
import withStyles from "material-ui/styles/withStyles";
import withRoot from './withRoot';
import Amplify from "aws-amplify";
import aws_exports from './aws-exports';
import TestCases from "components/cases/TestCases";
import 'typeface-roboto'

Amplify.configure(aws_exports)

const muiStyles: StyleRulesCallback<'root'> = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

class App extends React.Component<WithStyles<'root'>, {}> {
  private _request: any;

  constructor(props: any) {
    super(props)
    this.state = {
      imageSize: 720,
      mounted: false,
    }
    this._request = null
  }

  resizeWindow = () => {
    this._request = requestAnimationFrame(this.resizePaper)
  }

  resizePaper = () => {
    this.forceUpdate()
    this._request = null
  }

  componentDidMount() {
    this.setState({ mounted: true })
    window.addEventListener('resize', this.resizeWindow)
  }

  componentWillUnmount() {
    if (this._request) {
      cancelAnimationFrame(this._request)
      this._request = null
    }
    window.removeEventListener('resize', this.resizeWindow)
  }

  // コンテキストメニュー無効
  render() {
    return (
      <div className='App'
           onContextMenu={(e) => {
             e.preventDefault()
             return false;
           }}
      >
        <Router>
          <div>
            <Route exact path="/" render={() => <Editor width={6000} height={4000} /> }/>
            <Route path="/tests" component={TestCases}/>
          </div>
        </Router>
      </div>
    )
  }
}

export default withRoot(withStyles(muiStyles)<{}>(App));

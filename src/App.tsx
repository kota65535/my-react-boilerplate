import * as React from 'react'
import Editor from './components/Editor'

import './App.css'

import { WithStyles, StyleRulesCallback } from 'material-ui/styles'
import withStyles from "material-ui/styles/withStyles";
import withRoot from './withRoot';
import INITIAL_DATA from './mr-bubbles.json'

const IMAGE_WIDTH = 1920
const IMAGE_HEIGHT = 870

const muiStyles: StyleRulesCallback<'root'> = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit * 20,
    },
});

class App extends React.Component<WithStyles<'root'>, {}> {
    private _box: any;
    private _request: any;

    constructor(props: any) {
        super(props)
        this.state = {
            imageSize: 720,
            mounted: false,
        }
        this._box = null
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

    render() {
        const box = this._box && this._box.getBoundingClientRect()
        return (
            <div className='App' ref={ref => this._box = ref}>
                <Editor
                    initialData={INITIAL_DATA}
                    width={6000}
                    height={4000}
                    activeLayer={null}
                    selectedItem={null}
                />
            </div>
        )
    }

}

export default withRoot(withStyles(muiStyles)<{}>(App));

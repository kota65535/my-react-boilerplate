import * as React from 'react'
import Editor from './components/Editor'

import './App.css'

import MR_BUBBLES_JSON from './mr-bubbles.json'
import MR_BUBBLES_IMAGE_480 from './mr-bubbles-480.jpg'
import MR_BUBBLES_IMAGE_720 from './mr-bubbles-720.jpg'
import MR_BUBBLES_IMAGE_1080 from './mr-bubbles-1080.jpg'
import { WithStyles, StyleRulesCallback } from 'material-ui/styles'
import withStyles from "material-ui/styles/withStyles";
import withRoot from './withRoot';

const IMAGE_WIDTH = 1920
const IMAGE_HEIGHT = 870

const IMAGES = {
    480: MR_BUBBLES_IMAGE_480,
    720: MR_BUBBLES_IMAGE_720,
    1080: MR_BUBBLES_IMAGE_1080,
}

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
        if (!this._request) {
            this._request = requestAnimationFrame(this.resizePaper)
        }
    }

    resizePaper = () => {
        this.forceUpdate()
        this._request = null
    }

    setImageSize = ({ size }: { size: number }) => {
        this.setState({ imageSize: size })
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
        const { imageSize, mounted } = this.state as any
        const box = this._box && this._box.getBoundingClientRect()
        return (
            <div className='App' ref={ref => this._box = ref}>
                {mounted &&
                <Editor
                    initialData={MR_BUBBLES_JSON}
                    image={IMAGES[imageSize]}
                    imageWidth={IMAGE_WIDTH}
                    imageHeight={IMAGE_HEIGHT}
                    imageSize={imageSize}
                    width={box.width}
                    height={box.height}
                    setImageSize={this.setImageSize}
                    activeLayer={null}
                    selectedItem={null}
                />}
            </div>
        )
    }

}

export default withRoot(withStyles(muiStyles)<{}>(App));

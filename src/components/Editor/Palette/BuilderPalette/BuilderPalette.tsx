import * as React from 'react'
import {ReactNode} from 'react'
import {HideableDiv,} from "./BuilderPalette.style";
import Selector from "./Selector/Selector"
import {TitleDiv} from "../../LayerPalette/styles";
import Paper from "material-ui/Paper";
import {PaletteItem} from "store/type";

export interface BuilderPaletteProps {
  className?: string
  active: boolean
  title: string
  icon: ReactNode
  items: PaletteItem[]
  paletteItem: PaletteItem
  selectItem: (item: PaletteItem) => void
}


export default class BuilderPalette extends React.Component<BuilderPaletteProps, {}> {

  constructor(props: BuilderPaletteProps) {
    super(props)
  }

  render() {
    return (
      // styleを上書きするために必要
      <div className={this.props.className}>
        <HideableDiv className={`${this.props.active ? '' : 'hidden'}`}>
          <Paper>
            <TitleDiv className='Palette__title'>
              {this.props.icon}
              {this.props.title}
            </TitleDiv>
            <Selector
              items={this.props.items}
              selectItem={this.props.selectItem}
              paletteItem={this.props.paletteItem}
            />
          </Paper>
        </HideableDiv>
      </div>
    )
  }
}


import Palette from "./Palette";
import styled from "styled-components";
import ToolBar from "./ToolBar";


export const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: #363636;
`

export const EditorBody = styled.div`
  top: 64px;
  bottom: 0px;
  width: 100%;
`



export const StyledPalette = styled(Palette as any)`
  top: 56px;
  left: 0px;
`

export const StyledToolBar = styled(ToolBar as any)`
  flex: 1
`
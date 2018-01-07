import styled from "styled-components";
import {theme} from "../../withRoot";
import Rnd from 'react-rnd'


export const StyledRnd = styled(Rnd as any)`
  //position: absolute;
  z-index: 50;
  // workaround to override top:0, left:0 inline styles
  //right: 10px;
  top: 56px!important;
  left: auto!important;
`


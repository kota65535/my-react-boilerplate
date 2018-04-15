import styled from "styled-components";
import Button from "material-ui/Button";


export const SmallButton = styled(Button as any)`
  && {
    min-width: 50px;
    width: 50px;
    display: block;   // for centerize to parent div
    margin: 0 auto;   // for centerize to parent div
  }
`


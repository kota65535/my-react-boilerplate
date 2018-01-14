import styled from "styled-components";
import ActiveListItem from "../../common/ActiveListItem";
import {theme} from "../../../withRoot";


export const TitleDiv = styled.div`
  display: flex;
  margin: 0;
  padding: 6px;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  border-bottom: 1px solid #eee;
  border-bottom: 1px solid #292929;
  cursor: move
`

export const StyledListItem = styled(ActiveListItem)`
  && {
    background-color: ${props => props.active ? theme.palette.primary[400] : theme.palette.background.default};
    :hover {
      background-color: ${props => props.active ? theme.palette.primary[500] : theme.palette.grey[200]};
    }
  }
`



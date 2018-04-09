import * as React from 'react'
import {connect} from "react-redux";
import {RootState} from "store/type";
import Layout from 'components/Editor/Layout/Layout';
import {currentLayoutData} from "selectors";

const mapStateToProps = (state: RootState) => {
  return {
    layout: currentLayoutData(state),
    temporaryRails: state.builder.temporaryRails,
    temporaryRailGroup: state.builder.temporaryRailGroup,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)

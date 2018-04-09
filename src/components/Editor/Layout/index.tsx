import * as React from 'react'
import {connect} from "react-redux";
import {RootState} from "store/type";
import Layout, {LayoutProps} from 'components/Editor/Layout/Layout';
import {currentLayoutData} from "selectors";
import withBuilder from "components/hoc/withBuilder";
import {compose} from "recompose";

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

export default compose<LayoutProps, LayoutProps|any>(
  withBuilder,
  connect(mapStateToProps, mapDispatchToProps)
)(Layout)

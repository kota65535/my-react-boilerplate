import * as React from 'react'
import {connect} from "react-redux";
import {RootState} from "store/type";
import {TemporaryLayer} from "components/Editor/TemporaryLayer/TemporaryLayer";

const mapStateToProps = (state: RootState) => {
  return {
    temporaryRails: state.builder.temporaryRails,
    temporaryRailGroup: state.builder.temporaryRailGroup,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // addRail: (item: RailData, overwrite = false) => dispatch(addRail({item, overwrite})),
    // updateRail: (item: RailData, overwrite = false) => dispatch(updateRail({item, overwrite})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryLayer)

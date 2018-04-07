import * as React from 'react'
import {connect} from "react-redux";
import {RootState} from "store/type";
import {Palette} from "components/Editor/Palette/Palette";

const mapStateToProps = (state: RootState) => {
  return {
    tool: state.tools.activeTool,
    railGroups: state.builder.railGroups,
  }
};

const mapDispatchToProps = dispatch => {
  return {
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Palette)
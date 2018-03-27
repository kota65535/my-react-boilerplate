import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import withRailBase from "components/rails/withRailBase";
import DoubleCrossTurnout, {DoubleCrossTurnoutProps} from "components/rails/DoubleCrossTurnout";


export default compose<DoubleCrossTurnoutProps, DoubleCrossTurnoutProps>(
  defaultProps(DoubleCrossTurnout.defaultProps),
  withBuilder,
  withRailBase
)(DoubleCrossTurnout)


import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import withRailBase from "components/Rails/withRailBase";
import DoubleCrossTurnout, {DoubleCrossTurnoutProps} from "components/Rails/DoubleCrossTurnout";


export default compose<DoubleCrossTurnoutProps, DoubleCrossTurnoutProps>(
  defaultProps(DoubleCrossTurnout.defaultProps),
  withBuilder,
  withRailBase
)(DoubleCrossTurnout)


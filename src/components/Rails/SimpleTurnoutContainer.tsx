import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import withRailBase from "components/Rails/withRailBase";
import SimpleTurnout, {SimpleTurnoutProps} from "components/Rails/SimpleTurnout";


export default compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  defaultProps(SimpleTurnout.defaultProps),
  withBuilder,
  withRailBase
)(SimpleTurnout)


import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import withRailBase from "components/rails/withRailBase";
import SimpleTurnout, {SimpleTurnoutProps} from "components/rails/SimpleTurnout";


export default compose<SimpleTurnoutProps, SimpleTurnoutProps>(
  defaultProps(SimpleTurnout.defaultProps),
  withBuilder,
  withRailBase
)(SimpleTurnout)


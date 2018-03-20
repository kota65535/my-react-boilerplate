import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import StraightRail, {StraightRailProps} from "components/Rails/StraightRail";
import withRailBase from "components/Rails/withRailBase";


export default compose<StraightRailProps, StraightRailProps>(
  defaultProps(StraightRail.defaultProps),
  withBuilder,
  withRailBase
)(StraightRail)


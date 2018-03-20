import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import withRailBase from "components/Rails/withRailBase";
import DoubleStraightRail, {DoubleStraightRailProps} from "components/Rails/DoubleStraightRail";


export default compose<DoubleStraightRailProps, DoubleStraightRailProps>(
  defaultProps(DoubleStraightRail.defaultProps),
  withBuilder,
  withRailBase
)(DoubleStraightRail)


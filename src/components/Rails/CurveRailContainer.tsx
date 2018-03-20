import * as React from "react";
import {Rectangle} from "react-paper-bindings";
import {compose, defaultProps} from "recompose";
import {default as withBuilder} from "components/hoc/withBuilder";
import withRailBase from "components/Rails/withRailBase";
import {CurveRailProps, default as CurveRail} from "components/Rails/CurveRail";


export default compose<CurveRailProps, CurveRailProps>(
  defaultProps(CurveRail.defaultProps),
  withBuilder,
  withRailBase
)(CurveRail)


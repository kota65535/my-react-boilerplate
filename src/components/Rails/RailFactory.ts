import {ArcDirection} from "components/Rails/parts/primitives/ArcPart";

class RailFactory {

  // ========== Straight Rails ==========

  ['S280']() {
    return {
      type: 'StraightRail',
      length: 280
    }
  }

  ['S158.5']() {
    return {
      type: 'StraightRail',
      length: 158.5
    }
  }

  ['S140']() {
    return {
      type: 'StraightRail',
      length: 140
    }
  }

  ['S99']() {
    return {
      type: 'StraightRail',
      length: 90
    }
  }

  ['S70']() {
    return {
      type: 'StraightRail',
      length: 70
    }
  }

  ['S33']() {
    return {
      type: 'StraightRail',
      length: 33
    }
  }

  ['S18.5']() {
    return {
      type: 'StraightRail',
      length: 18.5
    }
  }

  ['DS280']() {
    return {
      type: 'DoubleStraightRail',
      length: 280
    }
  }

  // ========== Curve Rails ==========

  ['C280-45']() {
    return {
      type: 'CurveRail',
      radius: 280,
      centerAngle: 45
    }
  }

  ['C280-15']() {
    return {
      type: 'CurveRail',
      radius: 280,
      centerAngle: 15
    }
  }

  ['C317-45']() {
    return {
      type: 'CurveRail',
      radius: 317,
      centerAngle: 45
    }
  }

  ['C317-15']() {
    return {
      type: 'CurveRail',
      radius: 317,
      centerAngle: 15
    }
  }

  ['C541-15']() {
    return {
      type: 'CurveRail',
      radius: 541,
      centerAngle: 15
    }
  }

  ['PL541-15']() {
    return {
      type: 'SimpleTurnout',
      length: 140,
      radius: 541,
      centerAngle: 15,
      branchDirection: ArcDirection.LEFT
    }
  }

  ['PR541-15']() {
    return {
      type: 'SimpleTurnout',
      length: 140,
      radius: 541,
      centerAngle: 15,
      branchDirection: ArcDirection.RIGHT
    }
  }

  ['PRL541/280-15']() {
    return {
      type: 'ThreeWayTurnout',
      length: 140,
      // leftStart: 70,
      // leftRadius: 280,
      leftStart: 0,
      leftRadius: 541,
      leftCenterAngle: 15,
      rightStart: 0,
      rightRadius: 541,
      rightCenterAngle: 15,
    }
  }

  ['N-PX280']() {
    return {
      type: 'CrossoverTurnout',
      length: 280,
    }
  }
  // PL280_30() {
  //   return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 280, 30, TurnoutDirection.LEFT);
  // }
  // PR280_30() {
  //   return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 280, 30, TurnoutDirection.RIGHT);
  // }
  // PY280_15() {
  //   return new SymmetricalTurnout(DEFAULT_POSITION, 0, 280, 15);
  // }
  // CPR317_280_45() {
  //   return new CurvedTurnout(DEFAULT_POSITION, 0, 317, 280, 45, TurnoutDirection.RIGHT);
  // }
  // CPL317_280_45() {
  //   return new CurvedTurnout(DEFAULT_POSITION, 0, 317, 280, 45, TurnoutDirection.LEFT);
  // }
}


export default new RailFactory()


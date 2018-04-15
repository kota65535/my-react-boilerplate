import {ArcDirection} from "components/rails/parts/primitives/ArcPart";

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

  ['PL280-30']() {
    return {
      type: 'SimpleTurnout',
      length: 140,
      radius: 280,
      centerAngle: 30,
      branchDirection: ArcDirection.LEFT
    }
  }

  ['PR280-30']() {
    return {
      type: 'SimpleTurnout',
      length: 140,
      radius: 280,
      centerAngle: 30,
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
      type: 'DoubleCrossTurnout',
      length: 280,
    }
  }

  // ========== Special Rails ==========

  ['End Rail']() {
    return {
      type: 'EndRail',
      length: 70,
    }
  }

  ['XR140-15']() {
    return {
      type: 'CrossingRail',
      length: 140,
      crossAngle: 15
    }
  }

  ['XR72.5-30']() {
    return {
      type: 'CrossingRail',
      length: 72.5,
      crossAngle: 30
    }
  }

  ['XR37-90']() {
    return {
      type: 'CrossingRail',
      length: 37,
      crossAngle: 90
    }
  }
  // CPR317_280_45() {
  //   return new CurvedTurnout(DEFAULT_POSITION, 0, 317, 280, 45, TurnoutDirection.RIGHT);
  // }
  // CPL317_280_45() {
  //   return new CurvedTurnout(DEFAULT_POSITION, 0, 317, 280, 45, TurnoutDirection.LEFT);
  // }

}


export default new RailFactory()



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
  // PL541_15() {
  //   return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 541, 15, TurnoutDirection.LEFT);
  // }
  // PR541_15() {
  //   return new SimpleTurnout(DEFAULT_POSITION, 0, 140, 541, 15, TurnoutDirection.RIGHT);
  // }
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

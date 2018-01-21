import * as React from "react";
import {shallow} from 'enzyme';
import RectPart from './RectPart';
import renderer from 'react-test-renderer';

import Point = paper.Point;


it('subtracts 5 - 1 to equal 4 in TypeScript', () => {
  const rect = shallow(
    <RectPart width={100} height={100} position={new Point(100, 100)} angle={0}/>
  )

  // rect
  // expect(checkbox.text()).toEqual('On');oBe(4);
});
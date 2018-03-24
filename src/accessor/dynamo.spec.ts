import {DynamoDBAccessor} from "accessor/dynamo";

const LAYOUT = {
  layers: [
    {
      id: 1,
      name: 'Layer 1',
      visible: true,
    }
  ],
  rails: []
}


describe('DynamoDBAccessor', () => {
  it('save & load layout', async () => {
    const accessor = new DynamoDBAccessor()
    let result = await accessor.saveLayout('12', '23', LAYOUT)
    expect(result).toEqual({})

    result = await accessor.loadLayout('12', '23')
    expect(result).toEqual(LAYOUT)
  })
})

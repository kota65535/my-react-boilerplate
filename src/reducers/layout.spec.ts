import reducer from './layout'
import {addRail, removeRail, setLayerVisible, updateRail} from "actions/layout";


const createRail = (id, layerId) => {
  return {
    id: id,
    name: 'hoge',
    type: 'test',
    layerId: layerId,
    selected: false,
    opposingJoints: [null, null]
  }
}

describe('layout reducer', () => {
  it('adds, updates, removes a rail of the layout', () => {
      //========== When ========== 1個目のアイテムを追加
      let item = createRail(1, 1)
      let item2 = createRail(2, 1)
      let state = reducer(undefined, addRail({
        item: item,
      }))
      state = reducer(state, addRail({
        item: item2
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: []
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item]
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item, item2]
            },
          ],
          historyIndex: 2,
        }
      )

      //========== When ========== 1個目のアイテムを更新
      let item3 = createRail(1, 2)
      state = reducer(state, updateRail({
        item: item3
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: []
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item]
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item, item2]
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item3, item2]
            }
          ],
          historyIndex: 3,
        }
      )

      //========== When ========== 1個目のアイテムを削除
      state = reducer(state, removeRail({
        item: item3,
      }))
      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: []
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item]
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item, item2]
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item3, item2]
            },
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item2]
            }
          ],
          historyIndex: 4,
        }
      )
    }
  )

  it('adds, updates, removes a rail of the layout without adding histories', () => {
      //========== When ========== 1個目のアイテムを追加
      let item = createRail(1, 1)
      let item2 = createRail(2, 1)
      let state = reducer(undefined, addRail({
        item: item,
        overwrite: true
      }))
      state = reducer(state, addRail({
        item: item2,
        overwrite: true
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item, item2]
            },
          ],
          historyIndex: 0,
        }
      )

      //========== When ========== 1個目のアイテムを更新
      let item3 = createRail(1, 2)
      state = reducer(state, updateRail({
        item: item3,
        overwrite: true
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item3, item2]
            },
          ],
          historyIndex: 0,
        }
      )

      //========== When ========== 1個目のアイテムを削除
      state = reducer(state, removeRail({
        item: item3,
        overwrite: true
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [{id: 1, name: 'Layer 1', visible: true}],
              rails: [item2]
            }
          ],
          historyIndex: 0,
        }
      )
    }
  )


  it('set layer visible', () => {
    //========== Given ==========
    const item = createRail(1, 1)
    let state = reducer(undefined, setLayerVisible({
      layerId: 1,
      visible: false
    }))

    expect(state).toEqual({
      histories: [
        {
          layers: [
            {
              id: 1,
              name: 'Layer 1',
              visible: false
            }
          ],
          rails: []
        }
      ],
      historyIndex: 0,
    })
  })
})

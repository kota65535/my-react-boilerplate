import reducer, {LayerData} from './layout'
import {addLayer, addRail, deleteLayer, removeRail, updateLayer, updateRail} from "actions/layout";
// import {Point} from "paper";
import {RailData} from "components/rails";


const createRail = (id, layerId): RailData => {
  return {
    id: id,
    position: {x:0, y:0} as any,
    angle: 0,
    name: 'hoge',
    type: 'test',
    layerId: layerId,
    selected: false,
    opposingJoints: {},
    length: 10
  }
}

const createLayer = (id, name): LayerData => {
  return {
    id: id,
    name: name,
    visible: true
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
          name: 'Untitled'
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
          name: 'Untitled'
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
          name: 'Untitled'
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
          name: 'Untitled'
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
          name: 'Untitled'
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
          name: 'Untitled'
        }
      )
    }
  )


  it('adds, updates, removes a layer of the layout', () => {
      //========== When ========== 1個目のアイテムを追加
      let item = createLayer(2, 'Layer 2')
      let state = reducer(undefined, addLayer({
        item: item,
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [
                {id: 1, name: 'Layer 1', visible: true}
              ],
              rails: []
            },
            {
              layers: [
                {id: 1, name: 'Layer 1', visible: true},
                {id: 2, name: 'Layer 2', visible: true},
              ],
              rails: []
            },
          ],
          historyIndex: 1,
          name: 'Untitled'
        }
      )

      //========== When ========== 1個目のアイテムを更新
      let item3 = createLayer(1, 'Layer first')
      state = reducer(state, updateLayer({
        item: item3
      }))

      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [
                {id: 1, name: 'Layer 1', visible: true}
              ],
              rails: []
            },
            {
              layers: [
                {id: 1, name: 'Layer 1', visible: true},
                {id: 2, name: 'Layer 2', visible: true},
              ],
              rails: []
            },
            {
              layers: [
                {id: 1, name: 'Layer first', visible: true},
                {id: 2, name: 'Layer 2', visible: true},
              ],
              rails: []
            },
          ],
          historyIndex: 2,
          name: 'Untitled'
        }
      )

      //========== When ========== 1個目のアイテムを削除
      state = reducer(state, deleteLayer({
        id: item3.id,
      }))
      //========== Then ==========
      expect(state).toEqual({
          histories: [
            {
              layers: [
                {id: 1, name: 'Layer 1', visible: true}
              ],
              rails: []
            },
            {
              layers: [
                {id: 1, name: 'Layer 1', visible: true},
                {id: 2, name: 'Layer 2', visible: true},
              ],
              rails: []
            },
            {
              layers: [
                {id: 1, name: 'Layer first', visible: true},
                {id: 2, name: 'Layer 2', visible: true},
              ],
              rails: []
            },
            {
              layers: [
                {id: 2, name: 'Layer 2', visible: true},
              ],
              rails: []
            },
          ],
          historyIndex: 3,
          name: 'Untitled'
        }
      )
    }
  )
})

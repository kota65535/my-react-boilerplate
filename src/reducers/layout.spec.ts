import reducer from './layout'
import {setLayers, setLayerVisible} from "actions/layout";


const createItem = (id, layerId, name='Test') => {
  return {
    id: id,
    name: name,
    type: 'Test',
    layerId: layerId,
    selected: false,
    opposingJoints: [null, null]
  }
}

describe('layout reducer', () => {
  it('set layout', () => {
    //========== When ==========
    const item = createItem(1, 1)
    let state = reducer(undefined, setLayers({
      layers: [
        {
          id: 1,
          name: 'A',
          visible: true,
          children: [item]
        }
      ]
    }))

    //========== Then ==========
    expect(state).toEqual({
      layers: [
        {
          id: 1,
          visible: true,
          children: [item]
        }
      ]
    })
  })

  it('set layer visible', () => {
    //========== Given ==========
    const item = createItem(1, 1)
    let state = reducer(undefined, setLayers({
      layers: [
        {
          id: 1,
          name: 'A',
          visible: true,
          children: [item]
        }
      ]
    }))

    //========== When ==========
    state = reducer(state, setLayerVisible({
      layerId: 1,
      visible: false
    }))

    //========== Then ==========
    expect(state).toEqual({
      layers: [
        {
          id: 1,
          name: 'A',
          visible: false,
          children: [item]
        }
      ]
    })
  })

  // it('add, update, remove item to the layer', () => {
  //   //========== When ========== 1個目のアイテムを追加
  //   const item = createItem(1, 1)
  //   let state = reducer(undefined, addItem({
  //     layerId: 1,
  //     item: item
  //   }))
  //
  //   //========== Then ==========
  //   expect(state).toEqual({
  //     layers: [
  //       {
  //         id: 1,
  //         visible: true,
  //         children: [item]
  //       }
  //     ]
  //   })
  //
  //   //========== When ========== 2個目のアイテムを追加
  //   const item2 = createItem(2, 1)
  //   state = reducer(state, addItem({
  //     layerId: 1,
  //     item: item2
  //   }))
  //   //========== Then ==========
  //   expect(state).toEqual({
  //     layers: [
  //       {
  //         id: 1,
  //         visible: true,
  //         children: [item, item2]
  //       }
  //     ]
  //   })
  //
  //   //========== When ========== 1個目のアイテムを更新
  //   const item3 = createItem(3, 1)
  //   state = reducer(state, updateItem({
  //     oldItem: item,
  //     newItem: item3
  //   }))
  //   //========== Then ==========
  //   expect(state).toEqual({
  //     layers: [
  //       {
  //         id: 1,
  //         visible: true,
  //         children: [item3, item2]
  //       }
  //     ]
  //   })
  //
  //   //========== When ========== 2個目のアイテムを更新
  //   const item4 = createItem(4, 1)
  //   state = reducer(state, updateItem({
  //     oldItem: item2,
  //     newItem: item4
  //   }))
  //   //========== Then ==========
  //   expect(state).toEqual({
  //     layers: [
  //       {
  //         id: 1,
  //         visible: true,
  //         children: [item3, item4]
  //       }
  //     ]
  //   })
  //
  //   //========== When ========== 2個目のアイテムを削除
  //   state = reducer(state, removeItem({
  //     item: item3,
  //   }))
  //   //========== Then ==========
  //   expect(state).toEqual({
  //     layers: [
  //       {
  //         id: 1,
  //         visible: true,
  //         children: [item4]
  //       }
  //     ]
  //   })
  //
  //   //========== When ========== 1個目のアイテムを削除
  //   state = reducer(state, removeItem({
  //     item: item3,
  //   }))
  //   //========== Then ==========
  //   expect(state).toEqual({
  //     layers: [
  //       {
  //         id: 1,
  //         visible: true,
  //         children: []
  //       }
  //     ]
  //   })
  // })
})

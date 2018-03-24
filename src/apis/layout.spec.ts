import LayoutAPI from "./layout"

const LAYOUT = {
  layers: [
    {
      id: 2,
      name: 'Layer 10',
      visible: true,
    }
  ],
  rails: []
}


describe('Layout API', () => {
  it('saveLayout', async () => {

    let response = await LayoutAPI.saveLayoutData('hoge', 'test1', LAYOUT)
    console.log(response)
    response = await LayoutAPI.saveLayoutData('hoge', 'test2', LAYOUT)
    console.log(response)

    response = await LayoutAPI.fetchLayoutList('hoge')
    console.log(response)

    response = await LayoutAPI.fetchLayoutData('hoge', 'test2')
    console.log(response)

    response = await LayoutAPI.deleteLayoutData('hoge', 'test2')
    console.log(response)
  })
})

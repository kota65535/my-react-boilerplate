import {ItemData, LayoutData} from "reducers/layout";
import * as _ from "lodash";

/**
 * 指定のRailIDを持つレールをレイアウトから探して返す。
 * @param {LayoutData} layout
 * @param {number} id
 * @returns {ItemData | undefined}
 */
export const getRailDataById = (layout: LayoutData, id: number) => {
  return getAllRails(layout).find(item => item.id === id)
}

/**
 * レイアウトの全てのレールを返す。
 * @param {LayoutData} layout
 * @returns {ItemData[]}
 */
export const getAllRails = (layout: LayoutData) => {
  return _.flatMap(layout.layers, layer => layer.children)
}

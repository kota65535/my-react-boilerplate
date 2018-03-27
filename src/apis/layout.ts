import {API} from "aws-amplify";
import {LayoutData} from "reducers/layout";

export const fetchLayoutList = async (userId: string) => {
  return await API.get('Layout', `/users/${userId}/layouts`, {headers: {}})
}

export const fetchLayoutData = async (userId: string, layoutId: string) => {
  return await API.get('Layout', `/users/${userId}/layouts/${layoutId}`, {headers: {}})
}

export const saveLayoutData = async (userId: string, layoutId: string, layoutData: LayoutData) => {
  return await API.put('Layout', `/users/${userId}/layouts/${layoutId}`, {
    headers: {},
    body: layoutData
  })
}

export const deleteLayoutData = async (userId: string, layoutId: string) => {
  return await API.del('Layout', `/users/${userId}/layouts/${layoutId}`, {headers: {}})
}

// export default {
//   fetchLayoutList,
//   fetchLayoutData,
//   saveLayoutData,
//   deleteLayoutData
// }

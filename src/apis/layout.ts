import {LayoutData} from "reducers/layout";

const ENDPOINT = 'https://mfj162c8f7.execute-api.us-east-1.amazonaws.com/prod'

const fetchLayoutList = async (userId: string) => {
  const response = await fetch(`${ENDPOINT}/users/${userId}/layouts`)
  return await response.json()
}

const fetchLayoutData = async (userId: string, layoutId: string) => {
  const response = await fetch(`${ENDPOINT}/users/${userId}/layouts/${layoutId}`)
  return await response.json()
}

const saveLayoutData = async (userId: string, layoutId: string, layoutData: LayoutData) => {
  const response = await fetch(`${ENDPOINT}/users/${userId}/layouts/${layoutId}`, {
    method: 'PUT',
    body: JSON.stringify(layoutData)
  })
  return response
}

const deleteLayoutData = async (userId: string, layoutId: string) => {
  const response = await fetch(`${ENDPOINT}/users/${userId}/layouts/${layoutId}`, {
    method: 'DELETE',
  })
  return response
}

export default {
  fetchLayoutList,
  fetchLayoutData,
  saveLayoutData,
  deleteLayoutData
}

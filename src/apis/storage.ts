import {Storage} from "aws-amplify";


export const saveCurrentLayoutImage = async (userId: string, layoutId: string) => {
  const dataUrl = window.CANVAS.toDataURL('image/png')
  const blobData = dataURItoBlob(dataUrl);
  return await Storage.put(getFileName(userId, layoutId), blobData, {level: 'private'})
}

export const fetchlayoutImage =  async (userId: string, layoutId: string) => {
  return await Storage.get(getFileName(userId, layoutId), {level: 'private'})
}

const getFileName = (userId: string, layoutId: string) => {
  return `${userId}-${layoutId}.png`  //`
}


const dataURItoBlob = (dataURI) => {
  let binary = atob(dataURI.split(',')[1]);
  let array = [];
  for(let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}


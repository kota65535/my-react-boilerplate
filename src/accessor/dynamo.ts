import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {LayoutData} from "reducers/layout";

const TABLE = 'layouts'
const CONFIG = {'region': 'us-east-1'}

export class DynamoDBAccessor {
  private client: DocumentClient

  constructor() {
    this.client = new DocumentClient(CONFIG)
  }

  saveLayout(userId: string, layoutId: string, layoutData: LayoutData) {
    return new Promise((resolve, reject) => {
      this.client.put({
        TableName: TABLE,
        Item: {
          userId: userId,
          layoutId: layoutId,
          layoutData: JSON.stringify(layoutData)
        }
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  loadLayout(userId: string, layoutId: string) {
    return new Promise((resolve, reject) => {
      this.client.get({
        TableName: TABLE,
        Key:{
          userId: userId,
          layoutId: layoutId,
        }
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          const ret = JSON.parse(data.Item.layoutData)
          resolve(ret)
        }
      })
    })
  }
}
export interface MongoDBConfig {
  uri?: string
  dbName?: string
  options?: {
    maxPoolSize?: number
    minPoolSize?: number
    maxIdleTimeMS?: number
    connectTimeoutMS?: number
    socketTimeoutMS?: number
  }
}

export interface MongoDBClient {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  getDb: (name?: string) => any
  isConnected: () => boolean
}

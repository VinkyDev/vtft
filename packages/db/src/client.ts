import type { Db } from 'mongodb'
import type { MongoDBClient, MongoDBConfig } from './types'
import process from 'node:process'
import { MongoClient } from 'mongodb'

class MongoDBManager implements MongoDBClient {
  private client: MongoClient | null = null
  private config: Required<MongoDBConfig>
  private connected = false

  constructor(private userConfig?: MongoDBConfig) {
    this.config = {
      uri: '',
      dbName: '',
      options: {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        ...userConfig?.options,
      },
    }
  }

  async connect(): Promise<void> {
    if (this.connected && this.client) {
      return
    }

    this.config.uri = this.userConfig?.uri || process.env.MONGODB_URI || ''
    this.config.dbName = this.userConfig?.dbName || process.env.MONGODB_DB_NAME || ''

    try {
      this.client = new MongoClient(this.config.uri, this.config.options)
      await this.client.connect()
      this.connected = true
      await this.client.db(this.config.dbName).admin().ping()
    }
    catch (error) {
      this.connected = false
      this.client = null
      console.error('MongoDB connection failed:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return
    }

    try {
      await this.client.close()
      this.connected = false
      this.client = null
    }
    catch (error) {
      console.error('MongoDB disconnection failed:', error)
      throw error
    }
  }

  getDb(name?: string): Db {
    if (!this.client || !this.connected) {
      throw new Error('MongoDB not connected. Call connect() first.')
    }

    return this.client.db(name || this.config.dbName)
  }

  isConnected(): boolean {
    return this.connected && this.client !== null
  }

  getClient(): MongoClient | null {
    return this.client
  }
}

let mongoInstance: MongoDBManager | null = null

export function getMongoClient(config?: MongoDBConfig): MongoDBManager {
  if (!mongoInstance) {
    mongoInstance = new MongoDBManager(config)
  }
  return mongoInstance
}

export { MongoDBManager }

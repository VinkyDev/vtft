import type { Db } from 'mongodb'
import type { MongoDBClient, MongoDBConfig } from './types'
import process from 'node:process'
import { Logger } from 'logger'
import { MongoClient } from 'mongodb'

const logger = new Logger({ namespace: 'db', scope: 'mongodb' })

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

    // 验证环境变量
    if (!this.config.uri) {
      throw new Error('MongoDB URI is not configured. Set MONGODB_URI environment variable or provide uri in config.')
    }

    if (!this.config.dbName) {
      throw new Error('MongoDB database name is not configured. Set MONGODB_DB_NAME environment variable or provide dbName in config.')
    }

    try {
      this.client = new MongoClient(this.config.uri, this.config.options)
      await this.client.connect()
      this.connected = true
      await this.client.db(this.config.dbName).admin().ping()
      logger.success(`✓ Connected to MongoDB: ${this.config.dbName}`)
    }
    catch (error) {
      this.connected = false
      this.client = null
      logger.error('MongoDB connection failed', error as Error)
      throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`)
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
      logger.error('MongoDB disconnection failed', error as Error)
      throw error
    }
  }

  getDb(name?: string): Db {
    if (!this.client || !this.connected) {
      throw new Error('MongoDB not connected. Call connect() first.')
    }

    try {
      const dbName = name || this.config.dbName
      if (!dbName) {
        throw new Error('Database name not specified')
      }
      return this.client.db(dbName)
    }
    catch (error) {
      logger.error('Failed to get database instance', error as Error)
      throw new Error(`Failed to get database: ${error instanceof Error ? error.message : String(error)}`)
    }
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

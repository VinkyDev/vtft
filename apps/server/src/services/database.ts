import type { MongoDBManager, TFTDatabase } from 'db'
import { createTFTDatabase, getMongoClient } from 'db'
import { Logger } from 'logger'

const logger = new Logger({ namespace: 'service', scope: 'database', withTime: true })

class DatabaseService {
  private mongo: MongoDBManager
  private tftDb: TFTDatabase | null = null
  private connected = false

  constructor() {
    this.mongo = getMongoClient()
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return
    }

    await this.mongo.connect()
    this.tftDb = createTFTDatabase(this.mongo)
    this.connected = true
    logger.success('✓ Connected to MongoDB')
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return
    }

    await this.mongo.disconnect()
    this.tftDb = null
    this.connected = false
    logger.info('✓ Disconnected from MongoDB')
  }

  getTFTDatabase(): TFTDatabase {
    if (!this.tftDb) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.tftDb
  }

  isConnected(): boolean {
    return this.connected
  }
}

export const databaseService = new DatabaseService()

import type { MongoDBManager, TFTDatabase } from 'db'
import { createTFTDatabase, getMongoClient } from 'db'

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
    console.log('✓ Connected to MongoDB')
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return
    }

    await this.mongo.disconnect()
    this.tftDb = null
    this.connected = false
    console.log('✓ Disconnected from MongoDB')
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

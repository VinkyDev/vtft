import type { DeleteResult, UpdateResult, WithId } from 'mongodb'
import type { Lookups } from 'types'
import type { LookupsDocument } from '../models/lookups'
import { COLLECTION_NAME } from '../models/lookups'
import { BaseRepository } from './BaseRepository'

export class LookupsRepository extends BaseRepository<LookupsDocument, LookupsDocument> {
  protected getCollectionName(): string {
    return COLLECTION_NAME
  }

  async createIndexes(): Promise<void> {
    const collection = this.getCollection()
    await collection.createIndex({ key: 1 }, { unique: true })
    await collection.createIndex({ season: 1 })
    await collection.createIndex({ queue: 1 })
    await collection.createIndex({ updatedAt: -1 })
  }

  async upsert(season: string, queue: string, data: Lookups): Promise<UpdateResult<LookupsDocument> | null> {
    const key = `${season}:${queue}`
    const now = new Date()
    return await this.getCollection().updateOne(
      { key },
      {
        $set: { key, season, queue, data, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    )
  }

  async clearByQueue(queue: string): Promise<DeleteResult> {
    return await this.getCollection().deleteMany({ queue })
  }

  async findBySeason(season: string): Promise<WithId<LookupsDocument> | null> {
    return await this.getCollection().findOne({ season })
  }

  async findByQueue(queue: string): Promise<WithId<LookupsDocument> | null> {
    return await this.getCollection().findOne({ queue })
  }

  async get(season?: string, queue?: string): Promise<Lookups | null> {
    let doc: WithId<LookupsDocument> | null = null
    if (season)
      doc = await this.find({ season }, { sort: { updatedAt: -1 }, limit: 1 }).then(d => d[0] || null)
    else if (queue)
      doc = await this.find({ queue }, { sort: { updatedAt: -1 }, limit: 1 }).then(d => d[0] || null)
    else
      doc = await this.find({}, { sort: { updatedAt: -1 }, limit: 1 }).then(d => d[0] || null)
    return doc?.data ?? null
  }
}

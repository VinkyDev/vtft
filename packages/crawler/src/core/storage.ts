import type { AugmentMeta, ChampionMeta, CompData, ItemMeta } from 'types'
import { createTFTDatabase, getMongoClient } from 'db'
import { logger } from '../core/logger'

/**
 * 数据验证结果
 */
interface ValidationResult {
  isValid: boolean
  reason?: string
}

/**
 * 验证数据是否有效
 * 规则：数据数量必须 > 10
 */
function validateData<T>(data: T[], dataType: string): ValidationResult {
  if (!Array.isArray(data)) {
    return {
      isValid: false,
      reason: `${dataType} 数据不是数组`,
    }
  }

  if (data.length === 0) {
    return {
      isValid: false,
      reason: `${dataType} 数据为空`,
    }
  }

  if (data.length <= 10) {
    return {
      isValid: false,
      reason: `${dataType} 数据量过少 (${data.length} <= 10)，可能爬取不完整`,
    }
  }

  return { isValid: true }
}

/**
 * 原子更新操作
 * 在事务中执行删除旧数据和插入新数据
 */
async function atomicUpdate<T>(
  dataType: string,
  data: T[],
  updateFn: (tftDb: ReturnType<typeof createTFTDatabase>) => Promise<void>,
) {
  // 1. 验证数据
  const validation = validateData(data, dataType)
  if (!validation.isValid) {
    logger.error(`数据验证失败: ${validation.reason}`)
    throw new Error(validation.reason)
  }

  const mongo = getMongoClient()

  try {
    await mongo.connect()
    const tftDb = createTFTDatabase(mongo)

    logger.info(`准备保存 ${data.length} 个${dataType}...`)

    // 2. 使用 MongoDB session 实现事务（确保原子性）
    const client = mongo.getClient()
    if (!client) {
      throw new Error('MongoDB 客户端未连接')
    }

    const session = client.startSession()

    try {
      await session.withTransaction(async () => {
        await updateFn(tftDb)
      })

      logger.success(`✓ 成功保存 ${data.length} 个${dataType}`)
    }
    finally {
      await session.endSession()
    }
  }
  catch (error) {
    logger.error(`保存${dataType}失败:`, error)
    throw error
  }
}

/**
 * 保存强化符文到数据库
 * 策略：先验证数据 -> 删除旧数据 -> 插入新数据（原子操作）
 */
export async function saveAugments(augments: AugmentMeta[]) {
  await atomicUpdate('强化符文', augments, async (tftDb) => {
    logger.info('清空旧的强化符文数据...')
    await tftDb.augments.deleteAll()

    logger.info('插入新的强化符文数据...')
    await tftDb.augments.upsertMany(augments)
  })
}

/**
 * 保存英雄到数据库
 * 策略：先验证数据 -> 删除旧数据 -> 插入新数据（原子操作）
 */
export async function saveChampions(champions: ChampionMeta[]) {
  await atomicUpdate('英雄', champions, async (tftDb) => {
    logger.info('清空旧的英雄数据...')
    await tftDb.champions.deleteAll()

    logger.info('插入新的英雄数据...')
    await tftDb.champions.upsertMany(champions)
  })
}

/**
 * 保存装备到数据库
 * 策略：先验证数据 -> 删除旧数据 -> 插入新数据（原子操作）
 */
export async function saveItems(items: ItemMeta[]) {
  await atomicUpdate('装备', items, async (tftDb) => {
    logger.info('清空旧的装备数据...')
    await tftDb.items.deleteAll()

    logger.info('插入新的装备数据...')
    await tftDb.items.upsertMany(items)
  })
}

/**
 * 保存阵容到数据库（包括详情）
 * 策略：先验证数据 -> 删除旧数据 -> 插入新数据（原子操作）
 */
export async function saveComps(comps: CompData[]) {
  await atomicUpdate('阵容', comps, async (tftDb) => {
    // 统计有详情的阵容
    const compsWithDetails = comps.filter(c => c.details)

    // 删除旧的阵容数据
    logger.info('清空旧的阵容数据...')
    await tftDb.comps.deleteAll()

    // 删除旧的阵容详情数据
    if (compsWithDetails.length > 0) {
      logger.info('清空旧的阵容详情数据...')
      await tftDb.compDetails.deleteAll()
    }

    // 插入新的阵容数据
    logger.info('插入新的阵容数据...')
    await tftDb.comps.upsertMany(comps)

    // 插入新的阵容详情数据
    if (compsWithDetails.length > 0) {
      logger.info(`插入 ${compsWithDetails.length} 个阵容详情...`)
      await tftDb.compDetails.upsertMany(compsWithDetails)
      logger.success(`✓ 成功保存 ${compsWithDetails.length} 个阵容详情`)
    }
  })
}

/**
 * 初始化数据库索引
 */
export async function initializeDatabase() {
  const mongo = getMongoClient()

  try {
    await mongo.connect()
    const tftDb = createTFTDatabase(mongo)

    logger.info('初始化数据库索引...')
    await tftDb.initializeIndexes()
    logger.success('✓ 数据库索引初始化完成')
  }
  catch (error) {
    logger.error('初始化数据库失败:', error)
    throw error
  }
  finally {
    await mongo.disconnect()
  }
}

import logger from 'logger'
import pkg from 'node-machine-id'

const { machineIdSync } = pkg

let cachedDeviceId: string | null = null

/**
 * 获取设备唯一标识符
 */
export function getDeviceId(): string {
  if (cachedDeviceId) {
    return cachedDeviceId
  }

  try {
    const machineId = machineIdSync(true)
    cachedDeviceId = `device_${machineId}`
    logger.info(`Device ID initialized: ${cachedDeviceId.substring(0, 15)}...`)
    return cachedDeviceId
  }
  catch (error) {
    logger.error({ message: 'Failed to get device ID', error })
    const fallbackId = `device_temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    cachedDeviceId = fallbackId
    return fallbackId
  }
}

import { Logger } from './logger'

// 服务端 logger 实例，默认携带时间戳
export default new Logger({
  withTime: true,
})

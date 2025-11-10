import readline from 'node:readline'
import { styleText } from 'node:util'

/**
 * 创建交互式输入界面
 * @param {string} question - 问题
 * @returns {Promise<string>} 用户输入
 */
export function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

/**
 * 确认提示（y/n）
 * @param {string} question - 问题
 * @param {boolean} [defaultValue=false] - 默认值
 * @returns {Promise<boolean>}
 */
export async function confirm(question, defaultValue = false) {
  const hint = defaultValue ? '[Y/n]' : '[y/N]'
  const answer = await prompt(`${question} ${hint}: `)

  if (!answer) {
    return defaultValue
  }

  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

/**
 * 选择提示
 * @param {string} question - 问题
 * @param {Array<{label: string, value: any, description?: string}>} choices - 选项
 * @returns {Promise<any>} 选中的值
 */
export async function select(question, choices) {
  console.log(styleText('bold', `\n${question}\n`))

  choices.forEach((choice, index) => {
    const num = styleText('cyan', `${index + 1}.`)
    const label = styleText('bold', choice.label)
    const desc = choice.description ? styleText('gray', ` - ${choice.description}`) : ''
    console.log(`  ${num} ${label}${desc}`)
  })

  console.log()

  while (true) {
    const answer = await prompt(`请选择 (1-${choices.length}): `)
    const index = Number.parseInt(answer, 10) - 1

    if (Number.isNaN(index) || index < 0 || index >= choices.length) {
      console.log(styleText('red', '无效的选项，请重新输入'))
      continue
    }

    return choices[index].value
  }
}

/**
 * 输入验证
 * @param {string} question - 问题
 * @param {(value: string) => boolean | string} validator - 验证函数，返回 true 或错误消息
 * @returns {Promise<string>}
 */
export async function input(question, validator) {
  while (true) {
    const answer = await prompt(question)

    if (!validator) {
      return answer
    }

    const result = validator(answer)

    if (result === true) {
      return answer
    }

    console.log(styleText('red', typeof result === 'string' ? result : '输入无效，请重新输入'))
  }
}

/**
 * 多选提示
 * @param {string} question - 问题
 * @param {Array<{label: string, value: any, description?: string}>} choices - 选项
 * @returns {Promise<any[]>} 选中的值数组
 */
export async function multiSelect(question, choices) {
  console.log(styleText('bold', `\n${question}\n`))
  console.log(styleText('gray', '（输入多个序号，用逗号或空格分隔）\n'))

  choices.forEach((choice, index) => {
    const num = styleText('cyan', `${index + 1}.`)
    const label = styleText('bold', choice.label)
    const desc = choice.description ? styleText('gray', ` - ${choice.description}`) : ''
    console.log(`  ${num} ${label}${desc}`)
  })

  console.log()

  while (true) {
    const answer = await prompt(`请选择 (1-${choices.length}): `)
    const indices = answer
      .split(/[,\s]+/)
      .map(s => Number.parseInt(s.trim(), 10) - 1)
      .filter(i => !Number.isNaN(i) && i >= 0 && i < choices.length)

    if (indices.length === 0) {
      console.log(styleText('red', '无效的选项，请重新输入'))
      continue
    }

    return indices.map(i => choices[i].value)
  }
}

/**
 * 密码输入（隐藏输入）
 * @param {string} question - 问题
 * @returns {Promise<string>}
 */
export async function password(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    // 隐藏输入
    const stdin = process.stdin
    const onData = () => {}

    stdin.on('data', onData)

    rl.question(question, (answer) => {
      stdin.removeListener('data', onData)
      rl.close()
      console.log() // 换行
      resolve(answer.trim())
    })

    // 设置为原始模式以隐藏输入
    if (stdin.isTTY) {
      stdin.setRawMode(true)
    }
  })
}

/**
 * 暂停等待用户按回车继续
 * @param {string} [message='按回车键继续...'] - 提示消息
 */
export async function pause(message = '按回车键继续...') {
  await prompt(styleText('gray', message))
}

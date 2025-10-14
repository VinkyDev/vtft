export function sleep(delay: number): Promise<void> {
  let resolve: (value: void | PromiseLike<void>) => void

  const promise = new Promise<void>((res) => {
    resolve = res
  })

  setTimeout(() => {
    resolve?.()
  }, delay)

  return promise
}

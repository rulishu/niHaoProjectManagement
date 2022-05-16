/**
 * 防抖
 *
 * @param func    功能函数(即要防抖的函数)
 * @param delay   延时时间
 * @param ...args func的参数
 */
const debounce = () => {
  let timer = null
  const newDebounce = function (func, delay, ...args) {
    return new Promise((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout((_) => {
        try {
          resolve(func(...args))
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }
  return newDebounce
}
const newDebounce = debounce()

export default newDebounce

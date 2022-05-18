/**
 * 这是一个 计算之前时间距离之后时间 的方法 timeDistance()
 * @param {date} beforeTime 之前时间
 * @param {date} afterTime? 之后时间
 * @returns 时间 + 单位
 */
const timeDistance = (beforeTime, afterTime = new Date()) => {
  beforeTime = Date.parse(beforeTime)
  afterTime = Date.parse(afterTime)
  // 计算两个日期之间相差的毫秒数的绝对值
  const ms = Math.abs(afterTime - beforeTime)
  const type = afterTime - beforeTime >= 0

  // 毫秒数除以一天的毫秒数,就得到了天数
  let time = Math.floor(ms / (24 * 3600 * 1000))
  let unit = '天'
  if (time > 30) {
    time = Math.floor(ms / (30 * 24 * 3600 * 1000))
    unit = '月'
  }
  if (time < 1) {
    time = Math.floor(ms / (3600 * 1000))
    unit = '小时'
    if (time < 1) {
      time = Math.floor(ms / (60 * 1000))
      unit = '分钟'
    }
  }
  return { time: time + unit, status: type }
}

export default timeDistance

/**
 * 这是一个 计算之前时间距离之后时间 的方法 timeDistance()
 * @param {date} beforeTime 之前时间
 * @param {date} afterTime? 之后时间
 * @returns 时间 + 单位
 */
const timeDistance = (beforeTime, afterTime = new Date()) => {
  const date_str = beforeTime
  const date_number = Date.parse(date_str.replace(/-/g, '/'))
  afterTime = Date.parse(afterTime)
  // 计算两个日期之间相差的毫秒数的绝对值
  const ms = Math.abs(afterTime - date_number)
  const type = afterTime - date_number >= 0

  // 毫秒数除以一天的毫秒数,就得到了天数
  let time = Math.floor(ms / (24 * 3600 * 1000))
  let unit = '天'
  if (time > 30) {
    time = Math.floor(ms / (30 * 24 * 3600 * 1000))
    unit = '月'
  }

  if (time > 6 && time < 30 && time % 7 === 0) {
    time = Math.floor(ms / (7 * 24 * 3600 * 1000))
    unit = '周'
  }

  if (time < 1) {
    time = Math.floor(ms / (3600 * 1000))
    unit = '小时'
    if (time < 1) {
      time = Math.floor(ms / (60 * 1000))
      unit = '分钟'
      if (time < 1) {
        time = Math.floor(ms / 1000)
        unit = '秒'
      }
    }
  }
  return { time: time + unit, status: type }
}

export default timeDistance

// 时间转化 年-月-日 时分秒
export function changeTimeFormat(str) {
  if (!(str instanceof Date)) return str
  const clock = (str + '').split(' ')[4]
  if ((str + '').indexOf('-') !== -1) {
    str = str.replace(new RegExp(/-/gm), '/')
  }
  const d = new Date(str)
  const newDateYear = d.getFullYear()
  const newDateMonth =
    d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  const newDateDay =
    d.getDate() < 10 ? '0' + d.getDate() + '' : d.getDate() + ''
  return newDateYear + '-' + newDateMonth + '-' + newDateDay + ' ' + clock
}

// 时间转化 年-月-日
export function changeTime(str) {
  if (!(str instanceof Date)) return str
  if ((str + '').indexOf('-') !== -1) {
    str = str.replace(new RegExp(/-/gm), '/')
  }
  const d = new Date(str)
  const newDateYear = d.getFullYear()
  const newDateMonth =
    d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  const newDateDay =
    d.getDate() < 10 ? '0' + d.getDate() + '' : d.getDate() + ''
  return newDateYear + '-' + newDateMonth + '-' + newDateDay + ' '
}

// 获取当前时间
export function ThisTime() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  // let mytime = date.toLocaleTimeString()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }
  let time = year + '-' + month + '-' + day + ' '
  return time
}

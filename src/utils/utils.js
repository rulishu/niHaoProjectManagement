// 拼接url参数
function splitUrl(url, options) {
  let urlNew = url
  const paramsArray = []
  // Object.keys(options).forEach(key => paramsArray.push(key + '=' + options[key]));
  Object.keys(options).forEach((key) =>
    paramsArray.push(`${key}=${options[key]}`)
  )
  if (Object.keys(options).length === 0) {
    return url
  }
  if (/\?/.test(urlNew) === false) {
    urlNew = `${urlNew}?${paramsArray.join('&')}`
  } else {
    urlNew += `&${paramsArray.join('&')}`
  }
  return urlNew
}

const projectStatus = {
  0: '未开始',
  1: '进行中',
  2: '已完成',
  3: '已延期',
}

const issueStatus = [
  { status: 1, name: '未开始', type: 'primary' },
  { status: 2, name: '进行中', type: 'success' },
  { status: 3, name: '已完成', type: 'light' },
  { status: 4, name: '已逾期', type: 'danger' },
]

// 用户模糊查询数据
const selectOption = (data, value, name) => {
  if (data && data.length > 0) {
    if (value && name) {
      return data.map((item) => ({
        value: item[value],
        label: item[name],
      }))
    } else {
      return data.map((item) => ({
        value: item.id,
        label: item.userName,
      }))
    }
  } else {
    return []
  }
}

/** 菜单 转换成 渲染面包屑导航  */
class BreadcrumbMap {
  breadcrumb = new Map([])
  flat = []
  constructor(routeData) {
    this.init(routeData)
  }
  init(route, parent) {
    route.forEach((item) => {
      let par = (parent || []).concat([item])
      /** 始终把自己加载最后 */
      if (item.routes) {
        this.init(item.routes, par)
      }
      if (item.path && item.path !== '*') {
        this.breadcrumb.set(item.path, par)
      }
      this.flat.push(item)
    })
  }
}

const routesArr = (item) => {
  let newArr = []
  if (item && item.length > 0) {
    item?.forEach(function (e) {
      newArr.push(e.path)
    })
  }

  return Array.from(new Set(newArr))
}

//校验重复
const checkArrayObjectValueRepeat = (dataArr, key, checkVoid = false) => {
  let arr = []
  dataArr.some((item) => {
    if (arr.includes(item[key])) return (checkVoid = true)
    arr.push(item[key])
    return false
  })
  return checkVoid
}

//百分比(不带%)（已完成/总数）*100
export function NumColor(value, inx) {
  if (value === 0 || inx === 0 || value === undefined || inx === undefined) {
    return 0
  }
  if (value === inx) {
    return 100
  }
  let division = value / inx
  let realVal = parseFloat(division).toFixed(2) * 100
  return realVal
}
//百分比(带%)（已完成/总数）*100
export function NumFilter(value, inx) {
  if (value === 0 || inx === 0) {
    return 0
  }
  if (value === inx) {
    return `${100}%`
  }
  let division = value / inx
  let realVal = parseFloat(division).toFixed(2) * 100
  return `${realVal}%`
}

// 里程碑模糊查询数据
export const milepostOption = (data, value, name) => {
  if (data && data.length > 0) {
    if (value && name) {
      return data.map((item) => ({
        key: item[value],
        title: item[name],
      }))
    } else {
      return data.map((item) => ({
        key: item.id,
        title: item.userName,
      }))
    }
  } else {
    return []
  }
}

// 初始化 CompDropdown 组件数据
// initData: 初始数据 resultData:结果数据 key: 唯一值 renderData: 渲染数据对象
const initListData = (initData = [], resultData, key, renderData) => {
  const dataTypes = Array.isArray(resultData)
  const useful =
    Array.isArray(resultData) &&
    resultData?.map((item) => (item[key] ? item[key] : item))
  return initData
    ?.map((item) => {
      if (!item[key]) return undefined
      let resultObj = {
        key: item[key],
        check: dataTypes
          ? useful?.includes(item[key])
          : resultData === item[key],
      }
      Object.keys(renderData)?.forEach(
        (keyItem) =>
          (resultObj = {
            ...resultObj,
            [keyItem]: item[renderData[keyItem]],
          })
      )
      return resultObj
    })
    ?.filter((s) => s)
}

export {
  splitUrl,
  projectStatus,
  issueStatus,
  selectOption,
  BreadcrumbMap,
  routesArr,
  checkArrayObjectValueRepeat,
  initListData,
}
//时间转化
export function changeDate(date) {
  if (date) {
    const d = new Date(date)
    return (
      d.getFullYear() +
      '年' +
      changeStr(d.getMonth() + 1) +
      '月' +
      changeStr(d.getDate()) +
      '日' +
      changeStr(d.getHours()) +
      ':' +
      changeStr(d.getMinutes()) +
      ':' +
      changeStr(d.getSeconds())
    )
  }
}
export function changeTime(date) {
  if (date) {
    const d = new Date(date)
    return (
      d.getFullYear() +
      '-' +
      changeStr(d.getMonth() + 1) +
      '-' +
      changeStr(d.getDate())
    )
  }
}

function changeStr(data) {
  if (data < 10) {
    return '0' + data
  } else {
    return data
  }
}

export const guid = () => {
  function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4()
  )
}

//十六进制颜色正则
export function isColor(iDCard) {
  let cPattern = /^#[0-9a-fA-F]{6}$/ // /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
  return cPattern.test(iDCard)
}

//密码校验
export function verifyPwd(phone) {
  const phoneReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
  return phoneReg.test(phone)
}

//邮箱校验
export function isEmail(email) {
  const isReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return isReg.test(email)
}

// 不能输入中文/空格
export function isChina(value) {
  let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g
  if (reg.test(value)) {
    return '不能有中文！！'
  }
  if (/\s/g.test(value)) {
    return '不能有空格！！'
  }
  return true
}

// yyyy-MM-dd转换成yyyy/MM/dd
export function convertToString(s) {
  // eslint-disable-next-line no-useless-escape
  return s?.replace(/\-/g, '/')
}

// @查找
export function findall(a, x) {
  let results = [],
    len = a.length,
    pos = 0
  while (pos < len) {
    // eslint-disable-next-line no-const-assign
    pos = a.indexOf(x, pos)
    if (pos === -1) {
      //未找到就退出循环完成搜索
      break
    }
    results.push(pos) //找到就存储索引
    // eslint-disable-next-line no-const-assign
    pos += 1 //并从下个位置开始搜索
  }
  return results
}

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

export {
  splitUrl,
  projectStatus,
  issueStatus,
  selectOption,
  BreadcrumbMap,
  routesArr,
  checkArrayObjectValueRepeat,
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

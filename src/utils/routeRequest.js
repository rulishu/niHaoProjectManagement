const noRoutes = ['dashboard', 'projectList', 'todoList']

// 判断路由是否存在
export const isRouteExist = (pathName, userAccount) => {
  let result = true
  const pathArr = pathName.split('/').filter((s) => s)
  if (pathArr.length >= 2) {
    if (noRoutes.includes(pathArr[1]) && pathArr[0] !== userAccount) {
      result = false
    }
  }
  return result
}

// 盘导是否需要路由请求
export const isNeedRouteRequest = (pathName, userName) => {
  let result = true
  const pathArr = pathName.split('/').filter((s) => s)
  if (noRoutes.includes(pathArr[1])) {
    result = false
  }
  return result
}

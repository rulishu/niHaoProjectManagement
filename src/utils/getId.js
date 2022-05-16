import { Notify } from 'uiw'
import newDebounce from './debounce'

const getId = (config, param) => {
  const { jump, path } = config
  const { typeId, defPath } = param
  const id = sessionStorage.getItem(typeId) || undefined

  const promise = new Promise(function (resolve, reject) {
    if (id === undefined || id === 'undefined') {
      config?.jump !== undefined && jump(path || defPath)
      resolve('')
    }
  })
  promise
    .then(async () => {
      if (config?.jump !== undefined) {
        await newDebounce(Notify.warning, 500, {
          title: '警告',
          description: `警告：进入该页面需先选择一个${
            typeId === 'companyId' ? '公司' : '项目'
          }`,
        })
      }
    })
    .catch((err) => {
      console.warn('警告', err)
    })
  if (id !== 'undefined' && !!id) return true
  else return false
}

const getCompanyID = (config) => {
  return getId(config, { typeId: 'companyId', defPath: '/company' })
}
const getProjectID = (config) => {
  return (
    getId(config, { typeId: 'companyId', defPath: '/company' }) &&
    getId(config, { typeId: 'id', defPath: '/projectList' })
  )
}

export { getCompanyID, getProjectID }

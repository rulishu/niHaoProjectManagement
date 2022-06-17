/**
 * 表单验证
 * @param {*} props
 * @returns
 */
import { verifyPwd } from '@/utils/utils'

// 成员管理表单验证
export const memberForm = (props) => {
  const { current } = props
  const errorObj = {}
  const pattern = /^[1][3,4,5,7,8,9][0-9]{9}$/
  const reg =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (!current.userName) errorObj.userName = '姓名不能为空！'
  if (!current.nickName) errorObj.nickName = '帐号不能为空！'
  if (props.type === 3) {
    if (!current.password) errorObj.password = '密码不能为空！'
    if (!verifyPwd(current.password)) {
      errorObj.password = `必须含有字母跟数字且大于六位`
    }
  }
  if (!current.email) errorObj.email = 'Email不能为空！'
  if (!current.phonenumber) errorObj.phonenumber = '电话号码不能为空！'
  if (!current.roleIds) errorObj.roleIds = '角色不能为空！'
  // if (!current.roleIds) errorObj.roleIds = '角色不能为空！'
  // if (!current.deptId) errorObj.deptId = '部门不能为空！'
  // if (current.sex === '') errorObj.sex = '性别不能为空！'
  if (props.type === 3 || props.type === 2) {
    if (!current.postIds) errorObj.postIds = '职位不能为空！'
    if (current.postIds.length === 0) errorObj.postIds = '职位不能为空！'
  }
  if (!pattern.test(current.phonenumber))
    errorObj.phonenumber = '请输入正确的电话号码格式！'
  // if (current.status === '') errorObj.status = '状态不能为空！'
  if (!reg.test(current.email)) errorObj.email = '请输入正确的Email格式!'
  return errorObj
}

/**
 * 表单验证
 * @param {*} props
 * @returns
 */

// 成员管理表单验证
export const memberForm = (props) => {
  const { current } = props
  const errorObj = {}
  const pattern = /^[1][3,4,5,7,8,9][0-9]{9}$/
  const reg =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (!current.userAccount) errorObj.userAccount = '账号不能为空！'
  if (!current.userPassword) errorObj.userPassword = '密码不能为空！'
  if (!current.roleId) errorObj.roleId = '角色不能为空！'
  if (!current.userName) errorObj.userName = '姓名不能为空！'
  if (current.userEmail !== '' && !reg.test(current.userEmail))
    errorObj.userEmail = '请输入正确的Email！'
  if (current.userPhone !== '' && !pattern.test(current.userPhone))
    errorObj.userPhone = '请输入正确的电话号码！'
  return errorObj
}

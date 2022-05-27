// import styles from './index.module.less'
import { Button, Empty, Input, Divider } from 'uiw'
// import { Exceptions404 } from '@uiw-admin/exceptions'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const ErrorPage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: 'routeManagement/getInfo',
      payload: {
        callback: '',
      },
    })
  }, [dispatch])

  const {
    routeManagement: { userInfoName },
  } = useSelector((state) => state)
  console.log('userInfoName', userInfoName)
  return (
    <div>
      <Empty
        style={{ margin: '4%' }}
        size={200}
        description={
          <>
            <h1>404</h1>
            <p>页面未找到</p>
            <p>请确认您访问的地址是否正确并且页面未被移动</p>
            <p>如果您觉得这是一个错误的提示信息，请联系您的管理员</p>
          </>
        }>
        <Input
          style={{ width: 550, marginLeft: '30%' }}
          preIcon="search"
          size="large"
          placeholder="搜索项目、任务等等..."
          addonAfter={
            <Button size="small" type="primary">
              搜索
            </Button>
          }
        />
      </Empty>
      <div style={{ marginBottom: -100, textAlign: 'center' }}>
        <Divider />
        <Button
          basic
          style={{ margin: 10 }}
          type="primary"
          onClick={() => {
            window.location.href = `#/${userInfoName}/dashboard`
          }}>
          返回工作台
        </Button>
        <Button
          basic
          style={{ margin: 10 }}
          type="primary"
          onClick={() => {
            window.location.href = `#/login`
          }}>
          退出并登陆其他账号
        </Button>
        <Button
          basic
          style={{ margin: 10 }}
          type="primary"
          onClick={() => {
            console.log('123')
          }}>
          帮助
        </Button>
      </div>
    </div>
  )
}
export default ErrorPage

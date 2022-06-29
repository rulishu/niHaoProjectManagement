import UserLogin from '@uiw-admin/user-login'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Form, Row, Col, Button } from 'uiw'
import ThridLogin from './ThridLogin'
import { useState } from 'react'

export let navigate
const Login = () => {
  const [isOk, setIsOk] = useState(true)
  navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    login: { isLogin, isRegister, submitLoading },
  } = useSelector((state) => state)

  //注册功能开启设置
  useEffect(() => {
    dispatch({ type: 'login/getRegisterSwitch' })
  }, [dispatch])

  const returnLogin = () => {
    dispatch({
      type: 'login/updateState',
      payload: { isLogin: !isLogin },
    })
  }
  return (
    <UserLogin
      projectName={'尼好程序开发测试项目管理软件'}
      styleContainer={{ backgroundSize: '100% 100%' }}>
      <Form
        onSubmit={({ current }) => {
          const errorObj = {}
          if (!current.username) errorObj.username = `账号不能为空！`
          if (!current.password) errorObj.password = `密码不能为空！`
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }
          if (isOk) {
            dispatch({
              type: 'login/updateState',
              payload: { submitLoading: !submitLoading },
            })
            dispatch({
              type: 'login/submitLogin',
              payload: { ...current, navigate, setIsOk },
            })
          }
        }}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          username: {
            label: `账号`,
            labelFor: 'username',
            children: (
              <input
                type="text"
                id="username"
                placeholder={`请输入账号`}
                className="form-field"
              />
            ),
          },
          password: {
            label: `密码`,
            labelFor: 'password',
            children: (
              <input
                id="password1"
                type="password"
                placeholder={`请输入密码`}
                className="form-field"
              />
            ),
          },
        }}>
        {({ fields, canSubmit }) => {
          return (
            <div>
              <Row>
                <Col style={{ color: '#555' }}>{fields.username}</Col>
              </Row>
              <Row>
                <Col style={{ color: '#555' }}>{fields.password}</Col>
              </Row>
              <Row>
                <Button
                  disabled={!canSubmit()}
                  className="btns"
                  block
                  htmlType="submit"
                  loading={submitLoading}
                  type="primary">
                  登录
                </Button>
                {/* 注册功能是否开启 */}
                {isRegister ? (
                  <Button className="btns" type="link" onClick={returnLogin}>
                    注册
                  </Button>
                ) : (
                  ''
                )}
              </Row>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  <ThridLogin />
                </Col>
              </Row>
            </div>
          )
        }}
      </Form>
    </UserLogin>
  )
}

export default Login

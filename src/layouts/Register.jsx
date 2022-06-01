import UserLogin from '@uiw-admin/user-login'
import { Form, Row, Col, Button } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'

const Register = () => {
  const dispatch = useDispatch()

  const {
    login: { isLogin, registerLoading },
  } = useSelector((state) => state)

  const returnLogin = () => {
    dispatch({
      type: 'login/updateState',
      payload: { isLogin: !isLogin },
    })
  }

  return (
    <UserLogin projectName={'新用户注册'} logo="">
      <Form
        onSubmit={({ current }) => {
          const errorObj = {}
          if (!current.username) errorObj.username = `账号不能为空！`
          if (
            current.username === 'dashboard' ||
            current.username === 'projectList' ||
            current.username === 'todoList' ||
            current.username === 'Authority'
          )
            errorObj.username = `账号不能为dashboard、projectList、todoList、Authority`
          if (!current.password) errorObj.password = `密码不能为空！`
          if (!current.secondPassword)
            errorObj.secondPassword = `确认密码不能为空！`
          if (current.secondPassword !== current.password) {
            errorObj.password = `密码不一致！`
            errorObj.secondPassword = `密码不一致！`
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          } else {
            dispatch({
              type: 'login/register',
              payload: { ...current },
            })
            dispatch({
              type: 'login/updateState',
              payload: { registerLoading: !isLogin },
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
          secondPassword: {
            label: `确认密码`,
            labelFor: 'password',
            children: (
              <input
                id="password2"
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
                <Col style={{ color: '#555' }}>{fields.secondPassword}</Col>
              </Row>
              <Row>
                <Button
                  className="btns"
                  style={{ marginTop: 20 }}
                  htmlType="submit"
                  loading={registerLoading}
                  type="primary">
                  注册
                </Button>
                <Button
                  className="btns"
                  style={{ marginTop: 20 }}
                  type="danger"
                  onClick={returnLogin}>
                  返回登录页
                </Button>
              </Row>
            </div>
          )
        }}
      </Form>
    </UserLogin>
  )
}

export default Register

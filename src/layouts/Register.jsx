import UserLogin from '@uiw-admin/user-login'
import { Form, Row, Col, Button } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import { isEmail } from '@/utils/utils'
import { useRef, useState } from 'react'
import debounce from '@/utils/debounce'
import styles from './index.module.less'

const Register = () => {
  const form = useRef()
  const dispatch = useDispatch()
  const reg = /[^0-9a-zA-Z_]/g //只能是数字，字母，下划线
  const {
    login: { isLogin, registerLoading },
  } = useSelector((state) => state)

  const returnLogin = () => {
    dispatch({
      type: 'login/updateState',
      payload: { isLogin: !isLogin },
    })
  }
  const [arr, setArr] = useState(0)
  const copyRight = () => (
    <div className={styles.copyRight}>
      上海尼好系统集成有限公司&nbsp;&nbsp; Shanghai Ni Hao System Integration
      Co., Ltd.&nbsp;&nbsp; 税 号:913102300764281266&nbsp;&nbsp;
      地址:上海市青浦区明珠路1018号e通世界双子楼B座508室&nbsp;&nbsp;
      电话:021-61112686
    </div>
  )

  return (
    <UserLogin projectName={'新用户注册'} footer={copyRight()} logo="">
      <Form
        ref={form}
        onSubmit={({ current }) => {
          const errorObj = {}
          if (!current.username) errorObj.username = `账号不能为空！`
          if (
            current.username === 'dashboard' ||
            current.username === 'projectList' ||
            current.username === 'todoList' ||
            current.username === 'authority' ||
            current.username === 'tissue' ||
            current.username === 'login' ||
            current.username === 'Dashboard' ||
            current.username === 'ProjectList' ||
            current.username === 'TodoList' ||
            current.username === 'Authority' ||
            current.username === 'Tissue' ||
            current.username === 'Login' ||
            current.username === '403' ||
            current.username === '404' ||
            current.username === '500'
          )
            errorObj.username = `账号不能为关键字或关键符号`
          if (reg.test(current.username))
            errorObj.username = `账号只能为数字，字母，下划线！`
          if (!current.password) errorObj.password = `密码不能为空！`
          if (!current.secondPassword)
            errorObj.secondPassword = `确认密码不能为空！`
          if (current.secondPassword !== current.password) {
            errorObj.password = `密码不一致！`
            errorObj.secondPassword = `密码不一致！`
          }
          if (!current.email) errorObj.email = `邮箱不能为空！`
          if (!isEmail(current.email)) {
            errorObj.email = `请输入正确的邮箱`
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
                placeholder={`请输入账号(账号由字母、数字、下划线组成)`}
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
          email: {
            label: `邮箱`,
            labelFor: 'email',
            children: (
              <input
                id="email"
                type="text"
                placeholder={`请输入邮箱`}
                className="form-field"
                onChange={(e) => {
                  if (!isEmail(e.target.value)) {
                    setArr(1)
                  } else {
                    setArr(2)
                    debounce(dispatch, 500, {
                      type: 'login/emailValidityChecks',
                      payload: {
                        param: {
                          email: e.target.value,
                        },
                        callback: setArr,
                      },
                    })
                  }
                }}
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
                <Col style={{ color: '#555' }}>
                  <span>{fields.email}</span>
                  <span>
                    {arr === 0 ? (
                      ''
                    ) : arr === 1 ? (
                      <span style={{ color: 'red', fontSize: 12 }}>
                        邮箱格式错误
                      </span>
                    ) : arr === 2 ? (
                      <span style={{ color: 'red', fontSize: 12 }}>
                        该邮箱不可用
                      </span>
                    ) : arr === 3 ? (
                      <span style={{ color: 'green', fontSize: 12 }}>
                        该邮箱可用
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                </Col>
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

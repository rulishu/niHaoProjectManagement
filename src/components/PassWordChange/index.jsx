import { useEffect, useState, useImperativeHandle } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Col, Input, Form, Button, Notify } from 'uiw'
import { useNavigate } from 'react-router-dom'
import { verifyPwd } from '@/utils/utils'

// eslint-disable-next-line react/display-name
const PassWordChange = (props) => {
  //是否第一次第三方登录-修改密码
  const isPassword = localStorage.getItem('isPassword')
  const navigate = useNavigate()
  const { dispatch, refs } = props
  const ispwd = isPassword === 'true'
  const [visible, setVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('userData'))
  )

  const onSubmit = ({ initial, current }) => {
    const errorObj = {}
    if (isPassword !== 'true') {
      if (!current.oldUserPassword) {
        errorObj.oldUserPassword = '密码不能为空！'
      }
    }
    // if (
    //   !current.newUserPassword ||
    //   current.newUserPassword.length < 6 ||
    //   current.newUserPassword.length > 30
    // ) {
    //   errorObj.newUserPassword = '密码不能为空，且长度为6-30位！'
    // }
    if (!verifyPwd(current.newUserPassword)) {
      errorObj.newUserPassword = `必须含有字母跟数字且大于六位`
    }
    if (current.newUserPassword !== current.newUserPassword2) {
      errorObj.newUserPassword2 = '两次输入密码不一致'
    }
    if (!verifyPwd(current.newUserPassword2)) {
      errorObj.newUserPassword2 = `必须含有字母跟数字且大于六位`
    }
    if (Object.keys(errorObj).length > 0) {
      const err = new Error()
      err.filed = errorObj
      throw err
    }
    setLoading(true)
    // dispatch.updatePassword(current)
    if (ispwd) {
      dispatch.updatePassword({
        params: {
          // gitlab登录的默认密码是：nihao!888
          oldPassword: 'nihao!888',
          newPassword: current?.newUserPassword,
        },
        callback: (res) => {
          if (res.code === 200) {
            Notify.success({ description: res.message })
            setVisible(false)
            setIsVisible(false)
            setLoading(false)
            localStorage.clear()
            navigate('/login', { replace: true })
          }
        },
      })
    } else {
      dispatch.updatePassword({
        params: {
          oldPassword: current?.oldUserPassword,
          newPassword: current?.newUserPassword,
        },
        callback: (res) => {
          if (res.code === 200) {
            Notify.success({ description: res.message })
            setVisible(false)
            setIsVisible(false)
            setLoading(false)
            localStorage.clear()
            navigate('/login', { replace: true })
          }
        },
      })
    }
  }

  useImperativeHandle(refs, () => ({
    open: () => (ispwd ? setIsVisible(true) : setVisible(true)),
  }))

  useEffect(() => {
    setUserData(() => JSON.parse(sessionStorage.getItem('userData')))
  }, [])
  const num = sessionStorage.getItem('userNumber')
  console.log(sessionStorage.getItem('userNumber'))
  console.log('userData', userData)
  return (
    <Modal
      title="修改密码"
      width={900}
      isOpen={isPassword === 'true' ? isVisible : visible}
      onClosed={() => setVisible(false)}
      type="danger"
      isCloseButtonShown={isPassword === 'true' ? false : true}
      useButton={false}
      maskClosable={false}>
      <Form
        resetOnSubmit={false}
        onSubmit={onSubmit}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          userName: {
            labelClassName: 'fieldLabel',
            label: '账号',
            initialValue: num ? num : userData?.userName,
            disabled: true,
            children: <Input />,
          },
          oldUserPassword: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '原密码',
            placeholder: '请输入原密码',
            required: true,
            rules: [{ required: true, message: '输入原密码' }],
            children: <Input type="password" />,
          },
          newUserPassword: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '新密码',
            placeholder: '请输入新密码',
            required: true,
            help: '必须含有字母跟数字且大于六位',
            rules: [
              { required: true, message: '必须含有字母跟数字且大于六位' },
            ],
            children: <Input type="password" />,
          },
          newUserPassword2: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '请重复新密码',
            placeholder: '请确认新密码',
            required: true,
            rules: [{ required: true, message: '请重复密码' }],
            children: <Input type="password" />,
          },
        }}>
        {({ fields, state, canSubmit }) => {
          return (
            <div>
              <Row gutter={10}>
                <Col>{fields.userName}</Col>
              </Row>
              {isPassword === 'true' ? (
                ''
              ) : (
                <Row gutter={10}>
                  <Col>{fields.oldUserPassword}</Col>
                </Row>
              )}
              <Row gutter={10}>
                <Col>{fields.newUserPassword}</Col>
              </Row>
              <Row gutter={10}>
                <Col>{fields.newUserPassword2}</Col>
              </Row>
              <Row gutter={10} justify="center" align="middle">
                <Col span="5">
                  <Button
                    disabled={!canSubmit()}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ width: 100 }}>
                    保存
                  </Button>
                </Col>
                {isPassword === 'true' ? (
                  <Col span="5" style={{ marginLeft: 8 }}>
                    <Button
                      style={{ width: 100 }}
                      onClick={() => {
                        navigate('/login', { replace: true })
                      }}>
                      退出登录
                    </Button>
                  </Col>
                ) : (
                  ''
                )}
              </Row>
            </div>
          )
        }}
      </Form>
    </Modal>
  )
}

const mapStateToProps = ({ allusers }) => ({
  state: allusers,
})

const mapDispatchToProps = ({ allusers }) => ({
  dispatch: allusers,
})

export default connect(mapStateToProps, mapDispatchToProps)(PassWordChange)

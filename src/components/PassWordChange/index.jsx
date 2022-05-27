import { useEffect, useState, useImperativeHandle } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Col, Input, Form, Button, Notify } from 'uiw'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line react/display-name
const PassWordChange = (props) => {
  const navigate = useNavigate()
  const { dispatch, refs } = props
  const [visible, setVisible] = useState(false)
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem('userData'))
  )

  const onSubmit = ({ initial, current }) => {
    const errorObj = {}
    if (!current.oldUserPassword) {
      errorObj.oldUserPassword = '密码不能为空！'
    }
    if (
      !current.newUserPassword ||
      current.newUserPassword.length < 6 ||
      current.newUserPassword.length > 30
    ) {
      errorObj.newUserPassword = '密码不能为空，且长度为6-30位！'
    }
    if (current.newUserPassword !== current.newUserPassword2) {
      errorObj.newUserPassword2 = '两次输入密码不一致'
    }
    if (Object.keys(errorObj).length > 0) {
      const err = new Error()
      err.filed = errorObj
      throw err
    }
    // dispatch.updatePassword(current)
    dispatch.updatePassword({
      params: { ...current },
      callback: (res) => {
        if (res.code === 200) {
          Notify.success({ description: res.message })
          setVisible(false)
          localStorage.clear()
          navigate('/login', { replace: true })
        }
      },
    })
  }

  useImperativeHandle(refs, () => ({
    open: () => setVisible(true),
  }))

  useEffect(
    () => setUserData(() => JSON.parse(localStorage.getItem('userData'))),
    []
  )
  return (
    <Modal
      title="修改密码"
      width={900}
      isOpen={visible}
      onClosed={() => setVisible(false)}
      type="danger"
      useButton={false}>
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
            initialValue: userData?.userName,
            disabled: true,
            children: <Input />,
          },
          oldUserPassword: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '原密码',
            children: <Input type="password" />,
          },
          newUserPassword: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '新密码',
            children: <Input type="password" />,
          },
          newUserPassword2: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '请重复密码',
            children: <Input type="password" />,
          },
        }}>
        {({ fields, state, canSubmit }) => {
          return (
            <div>
              <Row gutter={10}>
                <Col>{fields.userName}</Col>
              </Row>
              <Row gutter={10}>
                <Col>{fields.oldUserPassword}</Col>
              </Row>
              <Row gutter={10}>
                <Col>{fields.newUserPassword}</Col>
              </Row>
              <Row gutter={10}>
                <Col>{fields.newUserPassword2}</Col>
              </Row>
              <Row gutter={10} justify="center">
                <Col fixed>
                  <Button
                    disabled={!canSubmit()}
                    type="primary"
                    htmlType="submit"
                    style={{ width: 120 }}>
                    保存
                  </Button>
                </Col>
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

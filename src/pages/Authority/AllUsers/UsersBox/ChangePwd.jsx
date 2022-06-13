import { Modal, Row, Col, Input, Form, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

const ChangePwd = () => {
  const dispatch = useDispatch()
  const {
    allusers: { viewVisible, viewData },
  } = useSelector((state) => state)

  //关闭
  const onClosed = () => {
    dispatch({
      type: 'allusers/update',
      payload: {
        viewVisible: false,
      },
    })
  }
  //保存
  const onSubmit = ({ initial, current }) => {
    const errorObj = {}
    if (!current.password) {
      errorObj.rawPassword = '密码不能为空！'
    }
    if (Object.keys(errorObj).length > 0) {
      const err = new Error()
      err.filed = errorObj
      throw err
    }
    dispatch({
      type: 'allusers/resetPwd',
      payload: {
        ...current,
        userId: viewData.userId,
      },
    })
  }

  return (
    <div>
      <Modal
        title="重置密码"
        width={900}
        isOpen={viewVisible}
        onClosed={onClosed}
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
            password: {
              labelClassName: 'fieldLabel',
              labelFor: 'password',
              label: '新密码',
              required: true,
              rules: [{ required: true, message: '输入新密码' }],
              children: <Input type="password" />,
              placeholder: '请输入新密码',
            },
          }}>
          {({ fields, state, canSubmit }) => {
            return (
              <div>
                <Row gutter={10}>
                  <Col>{fields.password}</Col>
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
    </div>
  )
}

export default ChangePwd

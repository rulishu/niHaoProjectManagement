import { connect } from 'react-redux'
import { Row, Col, Input, Form, Button, Select } from 'uiw'
import { selectOption } from '@/utils/utils'
import './style.css'

const NewUser = (props) => {
  const { dispatch, state } = props
  const { baseDetail } = state.allusers
  const newItem = state.dictionary.dictAllData.filter(
    (item) => item.dictSort !== 1
  )
  return (
    <div className="main">
      <Form
        // eslint-disable-next-line no-unused-vars
        onSubmit={async ({ initial, current }) => {
          const errorObj = {}
          const pattern = /^[1][3,4,5,7,8,9][0-9]{9}$/
          const reg =
            /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
          if (!current.userAccount) {
            errorObj.userAccount = '账号不能为空！'
          }
          if (!current.userPassword) {
            errorObj.userPassword = '密码不能为空！'
          }
          if (!current.userName) {
            errorObj.userName = '姓名不能为空！'
          }
          if (!current.userEmail) {
            errorObj.userEmail = 'Email不能为空！'
          } else if (!reg.test(current.userEmail)) {
            errorObj.userEmail = '请输入正确的Email！'
          }
          if (!current.userPhone) {
            errorObj.userPhone = '电话不能为空！'
          } else if (!pattern.test(current.userPhone)) {
            errorObj.userPhone = '请输入正确的电话号码！'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }
          if (props?.type === 'edit') {
            const param = {
              ...current,
              userId: baseDetail?.userId,
              userPosition: current?.userPosition ? current?.userPosition : ' ',
            }
            await dispatch.editNewUser(param)
          } else {
            await dispatch.addNewUser(current)
          }
          await dispatch.queryByPage()
          props.setVisible(false)
        }}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          userAccount: {
            labelClassName: 'fieldLabel',
            label: '账号',
            initialValue: baseDetail?.userAccount,
            children: (
              <Input
                disabled={props?.type === 'view' || props?.type === 'edit'}
              />
            ),
          },
          userPassword: {
            labelClassName: 'fieldLabel',
            labelFor: 'password',
            label: '密码',
            initialValue: baseDetail?.userPassword,
            children: (
              <Input
                disabled={props?.type === 'view'}
                id="password"
                // type="password"
              />
            ),
          },
          userName: {
            labelClassName: 'fieldLabel',
            label: '姓名',
            initialValue: baseDetail?.userName,
            children: <Input disabled={props?.type === 'view'} />,
          },
          userEmail: {
            labelClassName: 'fieldLabel',
            label: 'Email',
            initialValue: baseDetail?.userEmail,
            children: <Input disabled={props?.type === 'view'} />,
          },
          userPhone: {
            labelClassName: 'fieldLabel',
            label: '电话',
            initialValue: baseDetail?.userPhone,
            children: <Input disabled={props?.type === 'view'} />,
          },
          userPosition: {
            labelClassName: 'fieldLabel',
            label: '职位',
            initialValue: baseDetail?.userPosition || '0',
            children: (
              <Select disabled={props?.type === 'view'}>
                <Select.Option value="0">无职位</Select.Option>
                {selectOption(newItem, 'dictCode', 'dictName').map((item) => (
                  <Select.Option key={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            ),
          },
        }}>
        {({ fields, canSubmit }) => {
          return (
            <div>
              <Row>
                <Col>{fields.userAccount}</Col>
              </Row>
              <Row>
                <Col>{fields.userPassword}</Col>
              </Row>
              <Row>
                <Col>{fields.userName}</Col>
              </Row>
              <Row>
                <Col>{fields.userEmail}</Col>
              </Row>
              <Row>
                <Col>{fields.userPhone}</Col>
              </Row>
              <Row>
                <Col>{fields.userPosition}</Col>
              </Row>
              <Row>
                <Col />
                {props?.type !== 'view' && (
                  <Col fixed align="bottom">
                    <Button
                      disabled={!canSubmit()}
                      type="primary"
                      htmlType="submit">
                      提交
                    </Button>
                  </Col>
                )}
              </Row>
            </div>
          )
        }}
      </Form>
    </div>
  )
}
const mapStateToProps = ({ allusers, dictionary }) => ({
  state: { allusers, dictionary },
})

const mapDispatchToProps = ({ allusers }) => ({
  dispatch: allusers,
})

export default connect(mapStateToProps, mapDispatchToProps)(NewUser)

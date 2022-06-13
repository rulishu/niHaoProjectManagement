import { Form, Input, Row, Col, Notify, Button } from 'uiw' //, Select
import { connect } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import RegisterControl from './RegisterControl' //是否开启注册功能
import styles from './index.module.less'

const Head = (props) => {
  const { update, state } = props
  const { UserList } = state.allusers

  const handleAdd = () => {
    props.setType(3)
    props.setVisible(true)
    update({ baseDetail: {}, postsDataInfo: '' })
  }
  return (
    <div>
      <Form
        onSubmit={({ current }) => {
          const errorObj = {}
          if (!current.username) {
            errorObj.username = '帐号不能为空！'
          }
          if (!current.password) {
            errorObj.password = '密码不能为空！'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            Notify.error({
              title: '提交失败！',
              description: '请确认提交表单是否正确！',
            })
            throw err
          }
          Notify.success({
            title: '提交成功！',
            description: '恭喜你登录成功！',
          })
        }}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          nickName: {
            children: <Input placeholder="请输入姓名" />,
          },
          userName: {
            children: <Input placeholder="请输入帐号" />,
          },
          phonenumber: {
            labelClassName: 'fieldLabel',
            children: <Input placeholder="请输入电话" />,
          },
        }}>
        {({ fields, state, canSubmit, resetForm }) => {
          return (
            <Row gutter={24}>
              <Col span={6}>{fields.nickName}</Col>
              <Col span={6}>{fields.userName}</Col>
              <Col span={6}>{fields.phonenumber}</Col>
              <Col span={6}>
                <div className={styles.serachBox}>
                  <Button
                    icon="search"
                    className="icon-btn"
                    type="primary"
                    disabled={!canSubmit()}
                    onClick={async () => {
                      const whether =
                        !UserList?.length &&
                        Object.values(state?.current).filter((s) => s).length
                      await props.handleOnSearch(state?.current, !!whether)
                    }}>
                    查询
                  </Button>
                  <Button
                    type="light"
                    icon="reload"
                    className="icon-btn"
                    onClick={async () => {
                      resetForm()
                      await props.handleOnSearch()
                    }}>
                    重置
                  </Button>
                </div>
              </Col>
            </Row>
          )
        }}
      </Form>
      <div className={styles.linbox}>
        <Row gutter={24}>
          <Col span={12}>
            <RegisterControl />
          </Col>
          <Col span={12}>
            <div className={styles.addButton}>
              <AuthBtn path="/api/system/user/add">
                <Button
                  icon="plus"
                  className="icon-btn"
                  style={{ marginLeft: 10 }}
                  type="light"
                  onClick={handleAdd}>
                  新建用户
                </Button>
              </AuthBtn>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
const mapStateToProps = ({ allusers, dictionary }) => ({
  state: { allusers, dictionary },
})

const mapDispatchToProps = ({ allusers }) => ({
  update: allusers.update,
})

export default connect(mapStateToProps, mapDispatchToProps)(Head)

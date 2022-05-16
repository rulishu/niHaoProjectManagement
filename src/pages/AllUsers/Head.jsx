import { Form, Input, Row, Col, Notify, Button, Select } from 'uiw'
import { connect } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import { selectOption } from '@/utils/utils'
import styles from './index.module.less'

const Head = (props) => {
  const { update, state } = props
  const { UserList } = state.allusers
  const newItem = state.dictionary.dictAllData.filter(
    (item) => item.dictSort !== 1
  )

  const handleAdd = () => {
    props.setType(3)
    props.setVisible(true)
    update({ baseDetail: {} })
  }
  return (
    <div className={styles.userHead}>
      <div className={styles.title}></div>
      <div className={styles.right}>
        <Form
          onSubmit={({ initial, current }) => {
            const errorObj = {}
            if (!current.username) {
              errorObj.username = '用户名不能为空！'
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
            userAccount: {
              children: <Input placeholder="请输入账号" />,
            },
            userName: {
              labelClassName: 'fieldLabel',
              children: <Input placeholder="请输入姓名" />,
            },
            userPosition: {
              labelClassName: 'fieldLabel',
              children: (
                <Select disabled={props?.type === 'view'}>
                  <Select.Option value="">全部</Select.Option>
                  {selectOption(newItem, 'dictCode', 'dictName').map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              ),
            },
          }}>
          {({ fields, state, canSubmit, resetForm }) => {
            return (
              <div className={styles.rightForm}>
                <Row gutter={10}>
                  <Col fixed>{fields.userAccount}</Col>
                  <Col fixed>{fields.userName}</Col>
                  <Col fixed>{fields.userPosition}</Col>
                  <Button
                    icon="search"
                    className="icon-btn"
                    style={{ marginLeft: 10, height: 30 }}
                    type="dark"
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
                    type="dark"
                    icon="reload"
                    className="icon-btn"
                    style={{ marginLeft: 10, height: 30 }}
                    onClick={async () => {
                      resetForm()
                      await props.handleOnSearch()
                    }}>
                    重置
                  </Button>
                </Row>
              </div>
            )
          }}
        </Form>
        <AuthBtn path="/api/managerUser/add">
          <Button
            icon="plus"
            className="icon-btn"
            style={{ marginLeft: 10 }}
            type="light"
            onClick={handleAdd}>
            添加成员
          </Button>
        </AuthBtn>
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

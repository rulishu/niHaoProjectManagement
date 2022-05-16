import { useState, useEffect } from 'react'
import { Form, Row, Col, SearchSelect, Button, Modal, Notify } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

const AddUser = () => {
  const dispatch = useDispatch()
  const {
    home: { taskId },
    projectuser: { modalVisible },
  } = useSelector((state) => state)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (modalVisible) {
      dispatch({
        type: 'projectuser/pullSelectAll',
      })
    }
  }, [modalVisible, dispatch])
  // 关闭弹窗
  const onClose = () => {
    dispatch({
      type: 'projectuser/update',
      payload: { modalVisible: false },
    })
  }
  // 文本框值变化时回调
  function handleSearch(e) {
    dispatch({
      type: 'projectuser/pullSelectAll',
      payload: { userName: e },
    })
  }
  // 提交
  function onSubmit({ initial, current }) {
    const errorObj = {}
    if (!current.selectField) {
      errorObj.selectField = '请选择成员'
    }
    if (Object.keys(errorObj).length > 0) {
      const err = new Error()
      err.filed = errorObj
      throw err
    }

    setLoading(true)
    dispatch({
      type: 'projectuser/addSaveUser',
      payload: { projectId: taskId, userId: current.selectField },
    }).then((res) => {
      if (res.code === 200) {
        Notify.success({ description: res.message })
        setLoading(false)
        onClose()
        dispatch({
          type: 'projectuser/selectUserByProjectId',
          payload: taskId,
        })
      } else {
        Notify.error({ description: res.message })
        setLoading(false)
      }
    })
  }

  return (
    <Modal
      title="添加项目成员"
      style={{ zIndex: 999 }}
      width={500}
      isOpen={modalVisible}
      type="primary"
      useButton={false}
      onClosed={onClose}>
      <Form
        resetOnSubmit={false}
        onSubmit={onSubmit.bind(this)}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          selectField: {
            children: (
              <SearchSelect
                style={{ width: '100%' }}
                showSearch={true}
                allowClear
                disabled={false}
                placeholder="请输入成员姓名,可模糊查询"
                onSearch={handleSearch}
                onChange={handleSearch}
                option={[]}
                loading={loading}
              />
            ),
          },
        }}>
        {({ fields, state, canSubmit }) => {
          return (
            <div>
              <Row>
                <Col>{fields.selectField}</Col>
              </Row>
              <Row justify="flex-end">
                <Col fixed>
                  <Button loading={loading} type="light" onClick={onClose}>
                    取消
                  </Button>
                  <Button
                    loading={loading}
                    disabled={!canSubmit()}
                    type="primary"
                    htmlType="submit">
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

export default AddUser

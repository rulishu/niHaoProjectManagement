import { ProForm, useForm } from '@uiw-admin/components'
import { Button, Modal } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

const AddUser = () => {
  const dispatch = useDispatch()
  const {
    projectAuth: { isView },
  } = useSelector((state) => state)

  const form = useForm()

  // 关闭弹窗
  const onClose = () => {
    dispatch({
      type: 'projectAuth/update',
      payload: { isView: false },
    })
  }

  return (
    <Modal
      title="新增分组"
      style={{ zIndex: 999 }}
      width={500}
      isOpen={isView}
      type="primary"
      useButton={false}
      onClosed={onClose}>
      <ProForm
        form={form}
        formType="pure"
        formDatas={[
          {
            label: '分组名称',
            key: 'groupName',
            widget: 'input',
            initialValue: '',
            widgetProps: {},
            span: '24',
            required: true,
            rules: [
              {
                pattern: new RegExp(/[1][3][0-9]{9}$/),
                message: '请输入正确手机号',
              },
            ],
          },
          {
            label: '分组描述',
            key: 'groupDes',
            widget: 'textarea',
            initialValue: '',
            widgetProps: {},
            span: '24',
          },
        ]}
      />
      <Button
        style={{ marginTop: 10, width: 80 }}
        type="primary"
        onClick={async () => {
          // 触发验证
          await form.submitvalidate()
          // 获取错误信息
          const errors = form.getError()
          if (errors && Object.keys(errors).length > 0) return
          const value = form.getFieldValues?.()
          // 调用请求接口
          console.log('value: ', value)
        }}>
        保存
      </Button>
    </Modal>
  )
}

export default AddUser

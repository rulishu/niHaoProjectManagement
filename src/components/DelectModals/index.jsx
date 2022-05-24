import { Modal, Notify } from 'uiw'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'

export default function DelectModals(props) {
  const { deleteById, delectVisible, modelsType, parameter } = props

  const dispatch = useDispatch()

  const { mutate } = useSWR([deleteById, { method: 'POST', body: parameter }], {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    onSuccess: (data) => {
      if (data && data.code === 1) {
        Notify.success({ title: data.message })
        onClose()
        props.onSearch()
      } else {
        Notify.error({ title: '提交失败！' + data.message })
      }
    },
  })

  const onClose = () => {
    dispatch({
      type: modelsType,
      payload: {
        delectVisible: false,
      },
    })
  }

  return (
    <Modal
      title="删除"
      isOpen={delectVisible}
      confirmText="确定"
      cancelText="取消"
      icon="information"
      type="primary"
      onConfirm={() => mutate()}
      onCancel={() => onClose()}
      onClosed={onClose}>
      <p>是否确认删除此条数据</p>
    </Modal>
  )
}

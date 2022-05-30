import { Modal } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { Notify } from 'uiw'

const Modals = (props) => {
  const dispatch = useDispatch()
  const {
    usersManagement: { delectVisible, userId, projectId },
  } = useSelector((state) => state)

  const onClose = () => {
    dispatch({
      type: 'usersManagement/updateState',
      payload: {
        delectVisible: false,
      },
    })
  }

  // 执行成功返回的信息
  const information = (data) => {
    if (data.code === 200) {
      onClose()
      props?.onSearch()
      Notify.success({ title: data?.message || '' })
    } else {
      dispatch({
        type: 'usersManagement/updateState',
        payload: { loading: false },
      })
      Notify.error({ title: data?.message || '' })
    }
  }

  const onConfirm = () => {
    dispatch({
      type: 'usersManagement/deleteProjectMember',
      payload: {
        userId: userId,
        projectId: projectId,
      },
    }).then((data) => information(data))
  }

  return (
    <Modal
      title="单条删除"
      isOpen={delectVisible}
      confirmText="确定"
      cancelText="取消"
      icon="information"
      type="primary"
      onConfirm={() => onConfirm()}
      onCancel={() => onClose()}
      onClosed={onClose}>
      <p>是否确认删除此条数据</p>
    </Modal>
  )
}
export default Modals

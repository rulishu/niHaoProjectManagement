import { Modal } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { Notify } from 'uiw'
import { useNavigate } from 'react-router-dom'
const Modals = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    usersManagement: { delectVisible, userId, projectId, type, tableType },
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
      if (tableType === 'out') {
        navigate(`/dashboard`, { replace: true })
        onClose()
        Notify.success({ title: data?.message || '' })
        return
      }
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
      title="删除提示"
      isOpen={delectVisible}
      confirmText="确定"
      cancelText="取消"
      icon="information"
      type="danger"
      onConfirm={() => onConfirm()}
      onCancel={() => onClose()}
      onClosed={onClose}>
      <p>确定要{type === 'del' ? '删除该条数据' : '退出该项目'}吗?</p>
    </Modal>
  )
}
export default Modals

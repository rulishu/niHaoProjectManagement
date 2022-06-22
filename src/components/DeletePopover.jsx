import { Modal } from 'uiw'

export default function DeletePopover({ isOpen, onConfirm, onClosed }) {
  return (
    <Modal
      title="删除提示"
      isOpen={isOpen}
      confirmText="确定"
      cancelText="取消"
      icon="information"
      type="danger"
      onConfirm={onConfirm}
      onCancel={onClosed}
      onClosed={onClosed}>
      <p>确认删除本条数据吗?</p>
    </Modal>
  )
}

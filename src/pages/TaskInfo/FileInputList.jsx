import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FileInput, Icon, Overlay, Notify } from 'uiw'

const FileInputList = (props) => {
  const dispatch = useDispatch()
  const {
    project: { issueType, editFromData },
  } = useSelector((state) => state)

  const [visible, visibleSet] = useState(false)

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }

  const beforeUpload = (items) => {
    const file = items?.[0]?.file
    const isJpgOrPng = file?.type === 'image/jpeg' || file?.type === 'image/png'
    if (!isJpgOrPng) {
      Notify.error({
        title: '提交失败！',
        description: '只能类型为jpg、png、gif、jpeg的图片！',
      })
      return false
    }
    const isLt2M = file?.size / 1024 / 1024 < 2
    if (!isLt2M) {
      Notify.error({
        title: '提交失败！',
        description: '图片不能超过2MB！',
      })
      return false
    }
    updateData({
      editFromData: {
        ...editFromData,
        assignmentId: editFromData.assignmentId,
        fileId: items,
      },
    })
    items.length &&
      dispatch({
        type: 'allusers/getUploadAvatar',
        payload: items[0],
      })
  }

  return (
    <>
      <Overlay isOpen={visible} onClosed={() => visibleSet(false)}>
        <img src={`${props?.imgUrl}`} alt={`${props?.imgUrl}`} />
      </Overlay>
      <FileInput
        uploadType="card"
        size="large"
        readonly={issueType !== 'edit'}
        showFileIcon={{
          showPreviewIcon: true,
          showRemoveIcon: issueType === 'edit',
        }}
        maxNumber={1}
        onPreview={(file) => {
          visibleSet(true)
        }}
        value={props?.imgUrl && [{ dataURL: props?.imgUrl }]}
        onChange={(items) => {
          items.length && beforeUpload(items)
        }}>
        <Icon type="plus" />
      </FileInput>
    </>
  )
}
export default FileInputList

import { useState, useEffect } from 'react'
import { Button, Input, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { issueStatus } from '@/utils/utils'
import styles from './index.module.less'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { AuthBtn } from '@uiw-admin/authorized'
import EditTask from './EditTask'
import { useParams } from 'react-router-dom'
import FromMD from './fromMD'
import Comment from './Comment'
import useLocationPage from '@/hooks/useLocationPage'

const TaskInfo = () => {
  const dispatch = useDispatch()
  const params = useParams()

  // 处理带id的路由
  useLocationPage()
  const {
    project: { issueType, editFromData, taskInfoData },
    allusers: { uuid },
    loading,
  } = useSelector((state) => state)
  const [isTitleErr, serIsTitleErr] = useState(false)
  const { projectId, id } = params
  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }
  useEffect(() => {
    dispatch.project.getSelectById({ projectId: projectId, id: id })
    dispatch.project.queryFuzzyAllProjectMember({ projectId })
    dispatch.labels.getAllLabelData({ projectId })
    dispatch.projectuser.pullSelectAll({
      memberName: '',
      projectId: projectId || '',
    })
    dispatch.milestone.getListAll({
      projectId: projectId,
      milestonesStatusList: [1, 2],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   document.addEventListener('paste', pasteDataEvent)
  //   return () => {
  //     document.removeEventListener('paste', pasteDataEvent)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const pasteDataEvent = (event) => {
  //   // event.preventDefault();
  //   if (event.clipboardData || event.originalEvent) {
  //     let clipboardData =
  //       event.clipboardData || event.originalEvent.clipboardData
  //     if (clipboardData.items) {
  //       let items = clipboardData.items,
  //         len = items.length,
  //         blob = null
  //       for (let i = 0; i < len; i++) {
  //         let item = clipboardData.items[i]
  //         if (item.kind === 'string') {
  //           // item.getAsString(function (str) {
  //           //   console.log('string', str);
  //           // })
  //         } else if (item.kind === 'file') {
  //           blob = item.getAsFile()
  //           addImg(blob)
  //         }
  //       }
  //     }
  //   }
  // }

  // const addImg = (event) => {
  //   const file = event
  //   if (!file) return
  //   dispatch({
  //     type: 'allusers/upLoadImg',
  //     payload: {
  //       file: file,
  //     },
  //   }).then((res) => {
  //     if (res && res.code === 200) {
  //       const fieldValues = form.current.getFieldValues()
  //       form.current.setFieldValue(
  //         'description',
  //         fieldValues.description +
  //         `![image](/api/file/selectFile/${res?.data})`
  //       )
  //     }
  //   })
  // }
  const goEditIssue = (type) => {
    updateData({ issueType: type })
  }
  const goStateIssue = (e) => {
    const { assignmentId, assignmentTitle, description } = editFromData
    updateData({
      editFromData: {
        assignmentId,
        assignmentTitle,
        description,
        assignmentStatus: e,
      },
    })
    dispatch.project.getEdit({
      fileId: uuid ? [uuid] : editFromData.fileId,
      projectId: projectId,
    })
  }
  const steInputChange = (e) => {
    updateData({
      editFromData: {
        assignmentId: editFromData.assignmentId || taskInfoData.assignmentId,
        description: editFromData.description,
        assignmentTitle: e.target.value,
        fileId: editFromData.fileId,
      },
    })
  }
  const goSaveIssue = () => {
    if (
      editFromData.assignmentTitle.length < 2 ||
      editFromData.assignmentTitle.length > 100
    ) {
      serIsTitleErr(true)
      return
    }
    console.log(editFromData.description)
    if (editFromData.description.length > 300) {
      return
    }
    serIsTitleErr(false)
    if (editFromData !== taskInfoData) {
      dispatch.project.getEdit({
        fileId: uuid ? [uuid] : editFromData.fileId,
        projectId: projectId,
      })
      updateData({ issueType: '' })
    }
  }

  return (
    <>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={
          loading.effects.project.getSelectById ||
          loading.effects.project.getEdit
        }>
        <div>
          <div className={styles.wrapTask}>
            <div className={styles.leftNav}>
              <div className={styles.navItem}>
                <div>
                  <Button
                    size="small"
                    type={
                      issueStatus.find(
                        (item) => item.status === taskInfoData?.assignmentStatus
                      )?.type
                    }>
                    {
                      issueStatus.find(
                        (item) => item.status === taskInfoData?.assignmentStatus
                      )?.name
                    }
                  </Button>
                  <span className={styles.title}>
                    {taskInfoData?.createTime} 创建于 {taskInfoData?.createName}
                  </span>
                </div>
                <div>
                  <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
                    {taskInfoData?.assignmentStatus === 3 ? (
                      <Button type="success" onClick={() => goStateIssue(1)}>
                        打开任务
                      </Button>
                    ) : (
                      <Button type="primary" onClick={() => goStateIssue(3)}>
                        关闭任务
                      </Button>
                    )}
                    {issueType === 'edit' ? (
                      <Button onClick={() => goEditIssue('')}>取消编辑</Button>
                    ) : (
                      <Button onClick={() => goEditIssue('edit')}>
                        编辑任务
                      </Button>
                    )}
                  </AuthBtn>
                </div>
              </div>
              <div className={styles.navItem}>
                <div style={{ flex: 1, width: '100%' }}>
                  {issueType === 'edit' ? (
                    <div>
                      <Input
                        onChange={(e) => steInputChange(e)}
                        value={editFromData?.assignmentTitle}
                        className={isTitleErr && styles.inputErr}
                      />
                      {isTitleErr && (
                        <div className={styles.inputErrInfo}>
                          请输入任务名称,长度为2~100
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className={styles.assTitle}>
                      {taskInfoData?.assignmentTitle}
                    </span>
                  )}
                </div>
              </div>
              {issueType === 'edit' ? (
                <FromMD
                  upDate={updateData}
                  submit={goSaveIssue}
                  editName={'editFromData'}
                  editData={editFromData}
                  infoData={taskInfoData}
                  fromValue={'description'}
                  btnName="保存编辑"
                />
              ) : (
                <div data-color-mode="light" style={{ flex: 1 }}>
                  <MarkdownPreview source={taskInfoData?.description || ''} />
                </div>
              )}
              <Comment />
            </div>
            <EditTask />
          </div>
        </div>
      </Loader>
    </>
  )
}
export default TaskInfo

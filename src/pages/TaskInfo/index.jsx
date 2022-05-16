import { useState, useEffect } from 'react'
import { Button, Input, Steps, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { issueStatus } from '@/utils/utils'
import styles from './index.module.less'
import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { AuthBtn } from '@uiw-admin/authorized'
import FileInputList from './FileInputList'
import EditTask from './EditTask'
const TaskInfo = (props) => {
  const dispatch = useDispatch()
  const {
    home: { taskId },
    project: { issueType, editFromData, taskInfoData },
    allusers: { uuid },
    loading,
  } = useSelector((state) => state)

  const [isTitleErr, serIsTitleErr] = useState(false)
  const [isDescrErr, serIsDescrErr] = useState(false)
  const [imgUrl, setImgUrl] = useState()
  const { projectId, id, companyId } = props?.router?.params
  const isFileId = !!editFromData?.fileId?.filter((item) => item)?.length

  useEffect(() => {
    if (sessionStorage.getItem('id') === null) {
      sessionStorage.setItem('id', projectId)
    }
    if (sessionStorage.getItem('companyId') === null) {
      sessionStorage.setItem('companyId', companyId)
    }
    dispatch.project.getSelectById({ projectId: projectId, id: id })
    dispatch.dictionary.getQueryAll({ dictTypeCode: 'labels' })
    dispatch.projectuser.pullSelectAll({
      userName: '',
      projectId: projectId || taskId,
    })
    dispatch.milestone.getListAll({ milestonesStatusList: [1, 2] })
  }, [dispatch, taskId, projectId, id, companyId])

  useEffect(() => {
    setImgUrl(isFileId && `/api/file/selectFile/${editFromData?.fileId[0]}`)
    // return () => {
    //   setImgUrl(undefined)
    // }
  }, [isFileId, editFromData?.fileId])

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }

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
    dispatch({
      type: 'project/getEdit',
    })
  }
  const mdSetValue = (value) => {
    updateData({
      editFromData: {
        assignmentId: editFromData.assignmentId || taskInfoData.assignmentId,
        description: value,
        assignmentTitle: editFromData.assignmentTitle,
        fileId: editFromData.fileId,
      },
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
    if (editFromData.description.length > 300) {
      serIsDescrErr(true)
      return
    }
    serIsTitleErr(false)
    serIsDescrErr(false)
    if (editFromData !== taskInfoData) {
      dispatch.project.getEdit({
        fileId: uuid ? [uuid] : editFromData.fileId,
      })
      updateData({ issueType: '' })
    }
  }

  return (
    <Loader
      tip="加载中..."
      vertical
      style={{ width: '100%' }}
      loading={
        loading.effects.project.getSelectById || loading.effects.project.getEdit
      }>
      <div>
        <div className={styles.wrap}>
          <div className={styles.leftNav}>
            <div className={styles.nav}>
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
                  {taskInfoData?.assignmentStatus === 1 ? (
                    <Button type="primary" onClick={() => goStateIssue(3)}>
                      关闭问题
                    </Button>
                  ) : (
                    <Button type="success" onClick={() => goStateIssue(1)}>
                      打开问题
                    </Button>
                  )}
                  {issueType === 'edit' ? (
                    <Button onClick={() => goEditIssue('')}>取消编辑</Button>
                  ) : (
                    <Button onClick={() => goEditIssue('edit')}>
                      编辑问题
                    </Button>
                  )}
                </AuthBtn>
              </div>
            </div>
            <div className={styles.nav}>
              <div style={{ flex: 1 }}>
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
            <div className={styles.markStyle}>
              {issueType === 'edit' ? (
                <div id="MDEditor">
                  <MDEditor
                    preview="edit"
                    value={editFromData?.description}
                    onChange={(val) => mdSetValue(val)}
                    className={isDescrErr && styles.inputErr}
                  />
                  {isDescrErr && (
                    <div className={styles.inputErrInfo}>
                      任务详情长度应小于300
                    </div>
                  )}
                </div>
              ) : (
                <MarkdownPreview source={taskInfoData?.description || ''} />
              )}
            </div>
            {!imgUrl && <FileInputList imgUrl={imgUrl} />}
            {imgUrl && <FileInputList imgUrl={imgUrl} />}
            <div className={styles.btnWrap}>
              {!issueType || editFromData === taskInfoData ? null : (
                <Button type="primary" onClick={() => goSaveIssue()}>
                  保存编辑
                </Button>
              )}
            </div>
            <div className={styles.stepsWrap}>
              <Steps
                current={taskInfoData?.operatingRecords?.length}
                progressDot
                direction="vertical"
                style={{ padding: '20px 0' }}>
                {taskInfoData?.operatingRecords?.length > 0
                  ? taskInfoData?.operatingRecords.map((item, index) => {
                      return (
                        <Steps.Step title={item} description="" key={index} />
                      )
                    })
                  : null}
              </Steps>
            </div>
          </div>
          <EditTask router={props.router} />
        </div>
      </div>
    </Loader>
  )
}
export default TaskInfo

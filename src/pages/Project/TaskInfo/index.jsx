import { useState, useEffect } from 'react'
import { Button, Input, Loader, Divider } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { issueStatus } from '@/utils/utils'
import styles from './index.module.less'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { AuthBtn } from '@uiw-admin/authorized'
import EditTask from './EditTask'
import { useParams } from 'react-router-dom'
import FromMD from './fromMD'
import useLocationPage from '@/hooks/useLocationPage'
import TaskEvent from './TaskEvent'
import { changeDate } from '@/utils/utils'

const TaskInfo = () => {
  const dispatch = useDispatch()
  const params = useParams()
  // 处理带id的路由
  useLocationPage()
  const {
    projectTasks: { issueType, taskInfoData, editTaskFromData },
    loading,
  } = useSelector((state) => state)
  const [isTitleErr, serIsTitleErr] = useState(false)
  const { projectId, id } = params

  const updateData = (payload) =>
    dispatch({ type: 'projectTasks/update', payload })

  useEffect(() => {
    dispatch.project.queryFuzzyAllProjectMember({ projectId })
    dispatch.labels.getAllLabelData({ projectId })
    dispatch.projectTasks.getTaskDetailsDataUnCheck({
      projectId: projectId,
      id: id,
    })
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

  const goEditIssue = (type) => {
    updateData({ issueType: type })
  }
  const goStateIssue = async (e) => {
    let taskState = ''
    if (e === 3) {
      taskState = '关闭'
    } else if (e === 1) {
      taskState = '打开'
    }
    updateData({
      taskInfoData: {
        ...taskInfoData,
        assignmentStatus: e,
      },
    })
    const { assignmentId } = editTaskFromData
    dispatch.taskboard.changeAssignmentStatus({
      projectId,
      assignmentId,
      type: taskState,
    })
  }

  const steInputChange = (e) => {
    updateData({
      editTaskFromData: {
        assignmentId:
          editTaskFromData.assignmentId || taskInfoData.assignmentId,
        description: editTaskFromData.description,
        assignmentTitle: e.target.value,
      },
    })
  }

  // 保存任务详情编辑
  const goSaveIssue = async () => {
    if (
      editTaskFromData.assignmentTitle.length < 2 ||
      editTaskFromData.assignmentTitle.length > 100
    ) {
      serIsTitleErr(true)
      return
    }
    // if (editTaskFromData.description.length > 300) {
    //   return
    serIsTitleErr(false)
    await dispatch.projectTasks.editTaskList({ projectId })
  }

  // 返回
  const goBack = () => {
    window.history.back(-1)
  }
  console.log('taskInfoData?.createTime', changeDate(taskInfoData?.createTime))

  return (
    <div className={styles.infoLoad}>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={
          loading.effects.projectTasks.getTaskDetailsDataUnCheck ||
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
                    由{taskInfoData?.createName}创建于
                    {changeDate(taskInfoData?.createTime)}
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
                      <Button onClick={() => goEditIssue('cancel')}>
                        取消编辑
                      </Button>
                    ) : (
                      <Button onClick={() => goEditIssue('edit')}>
                        编辑任务
                      </Button>
                    )}
                  </AuthBtn>
                  <Button type="light" onClick={() => goBack()}>
                    返回
                  </Button>
                </div>
              </div>
              <div className={styles.navItem}>
                <div style={{ flex: 1, width: '100%' }}>
                  {issueType === 'edit' ? (
                    <div>
                      <Input
                        onChange={(e) => steInputChange(e)}
                        value={editTaskFromData?.assignmentTitle}
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
                <div className={styles.content}>
                  <FromMD
                    upDate={updateData}
                    submit={goSaveIssue}
                    editName={'editTaskFromData'}
                    editData={editTaskFromData}
                    infoData={{
                      assignmentId: taskInfoData.assignmentId,
                      assignmentTitle: taskInfoData.assignmentTitle,
                      description: taskInfoData.description,
                    }}
                    fromValue={'description'}
                    btnName="保存编辑"
                    onClose={() => goEditIssue('cancel')}
                  />
                </div>
              ) : (
                <div data-color-mode="light" style={{ flex: 1 }}>
                  <MarkdownPreview source={taskInfoData?.description || ''} />
                </div>
              )}
              <Divider />
              <TaskEvent />
            </div>
            <EditTask />
          </div>
        </div>
      </Loader>
    </div>
  )
}
export default TaskInfo

import { useState, useEffect } from 'react'
import { Button, Pagination, Loader, Notify } from 'uiw'
import { TaskList } from '@/components'
import styles from './index.module.less'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useLocationPage from '@/hooks/useLocationPage'
import 'tributejs/tribute.css'

const Task = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const { userAccount } = useParams()
  const [taskStatus, setTaskStatus] = useState('2')
  // 处理带id的路由
  useLocationPage()
  const taskId = params.projectId || ''
  const {
    project,
    labels: { listData: labelsListData },
    projectTasks: { taskListData, searchOptions, taskListDataTotal },
    loading,
  } = useSelector((state) => state)
  const { membersList, milistonesList } = project

  const pageS = (payload) => {
    dispatch.project.getList({ ...payload, projectId: taskId })
    dispatch.project.countAssignment({ ...payload, projectId: taskId })
  }

  useEffect(() => {
    dispatch.project.queryFuzzyAllProjectMember({ projectId: taskId })
    dispatch.project.selectLabel({ projectId: taskId })
    dispatch.project.assignment_label()
    dispatch.labels.getAllLabelData({ projectId: taskId })
    dispatch.projectuser.pullSelectAll({ memberName: '', projectId: taskId })
    dispatch.milestone.getListAll({
      projectId: taskId,
      milestonesStatusList: [1, 2],
    })
    dispatch.project.getAssignment({ projectId: taskId }) //不分页获取所有任务

    dispatch.projectTasks.getTaskPagingData({ projectId: taskId }) //不分页获取所有任务
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const conditionChange = async (params) => {
    await dispatch({
      type: 'projectTasks/update',
      payload: { searchOptions: { ...searchOptions, page: 1, ...params } },
    })
    await dispatch.projectTasks.getTaskPagingData({ projectId: taskId })
  }

  // 进页面先查询一次，获取任务数量角标
  useEffect(() => {
    const newStatus = window.location.hash.split('?')[1] || ''
    setTaskStatus(newStatus)
    dispatch({
      type: 'project/update',
      payload: {
        page: 1,
        pageSize: 10,
        projectId: taskId,
        splicingConditionsDtos: [],
      },
    })
    dispatch({
      type: 'project/update',
      payload: {
        activeKey: taskStatus,
        tabDtos: [
          {
            condition: '=',
            field: 'assignmentStatus',
            value: taskStatus,
          },
        ],
        selectDtos: [],
      },
    })

    if (taskId) {
      // 任务状态(1.未开始 2.进行中 3.已完成,4.已逾期)
      pageS({
        assignmentStatus: taskStatus,
      })
      dispatch({
        type: 'project/getProjectCountById', //统计
        payload: { projectId: taskId },
      })
    } else {
      Notify.success({ description: '查无此项' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, taskStatus])

  const updateData = (payload) => {
    dispatch({ type: 'project/update', payload })
  }

  const goIssue = () => {
    updateData({
      issueType: 'add',
      fromData: {
        assignmentTitle: '',
        assignmentType: 1,
        description: '',
        projectId: taskId,
        labels: [],
      },
    })
    navigate(`/${userAccount}/${params.projectId}/task/newIssue`)
  }

  const listGo = (item) => {
    updateData({ editId: item.assignmentId, editFromData: item })
    navigate(
      `/${userAccount}/${item.projectId}/task/taskInfo/${item.assignmentId}`
    )
  }

  return (
    <div className={styles.wrap}>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.projectTasks.getTaskPagingData}>
        <div>
          <div className={styles.nav}>
            <Button type="primary" onClick={() => goIssue()}>
              新建任务
            </Button>
          </div>
          <TaskList
            listData={taskListData || []}
            labelsData={labelsListData}
            listNavigate={listGo}
            conditionChange={conditionChange}
            labelsListData={labelsListData}
            teamMembersListData={membersList}
            milestonesListData={milistonesList}
          />
          <div className={styles.pagination}>
            {taskListDataTotal > 10 ? (
              <Pagination
                current={1}
                alignment="center"
                pageSize={searchOptions.pagesize}
                total={taskListDataTotal}
                onChange={(page) => conditionChange({ page })}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </Loader>
    </div>
  )
}

export default Task

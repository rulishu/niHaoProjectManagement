import { useEffect, useRef } from 'react'
import { Button, Pagination, Loader, Input, Form } from 'uiw'
import { TaskList } from '@/components'
import styles from './index.module.less'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useLocationPage from '@/hooks/useLocationPage'
import 'tributejs/tribute.css'

const Task = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const { userAccount } = useParams()
  const form = useRef()
  // 处理带id的路由
  useLocationPage()
  const taskId = params.projectId || ''
  const {
    project,
    labels: { listData: labelsListData },
    projectTasks: { taskListData, searchOptions, taskListDataTotal },
    milestone: { milepostaData },
    loading,
  } = useSelector((state) => state)
  const { membersList } = project

  useEffect(() => {
    dispatch({ type: 'projectTasks/clean' })
  }, [dispatch])

  useEffect(() => {
    dispatch.project.queryFuzzyAllProjectMember({ projectId: taskId }) // 初始化人员
    dispatch.labels.getAllLabelData({ projectId: taskId }) // 初始化标签数据
    dispatch.milestone.getListAll({
      projectId: taskId,
      milestonesStatusList: [1, 2],
    }) // 初始化里程碑
    dispatch.project.getAssignment({ projectId: taskId }) //不分页获取所有任务
    dispatch.projectTasks.getTaskPagingData({ projectId: taskId }) //不分页获取所有任务
    dispatch.project.countAssignment({ projectId: taskId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const conditionChange = async (params) => {
    await dispatch({
      type: 'projectTasks/update',
      payload: { searchOptions: { ...searchOptions, page: 1, ...params } },
    })
    await dispatch.projectTasks.getTaskPagingData({ projectId: taskId })
  }

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
        <>
          <div>
            <Form
              ref={form}
              fields={{
                assignmentTitle: {
                  children: (
                    <Input preIcon="search" placeholder="输入任务名查询" />
                  ),
                },
              }}
              onSubmit={({ initial, current }) => conditionChange(current)}
              style={{ width: '100%' }}>
              {({ fields }) => {
                return (
                  <div className={styles.taskHeadBox}>
                    <div className={styles.searchTask}>
                      {fields?.assignmentTitle}
                    </div>
                    <div className={styles.newTask}>
                      <Button type="primary" onClick={() => goIssue()}>
                        新建任务
                      </Button>
                    </div>
                  </div>
                )
              }}
            </Form>
          </div>
          <TaskList
            listData={taskListData || []}
            labelsData={labelsListData}
            listNavigate={listGo}
            conditionChange={conditionChange}
            labelsListData={labelsListData}
            teamMembersListData={membersList}
            milestonesListData={milepostaData}
            searchOptions={searchOptions}
            onCLickSearch={(type, val) => {
              let obj = searchOptions[type]
              if (!searchOptions[type].includes(val.value)) {
                obj.push(val.value)
              }
              conditionChange({ [type]: obj })
            }}
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
        </>
      </Loader>
    </div>
  )
}

export default Task

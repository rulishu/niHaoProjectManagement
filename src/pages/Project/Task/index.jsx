import { useEffect, useRef } from 'react'
import { Button, Pagination, Loader, Input, Form } from 'uiw'
import { TaskList } from '@/components'
import styles from './index.module.less'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useLocationPage from '@/hooks/useLocationPage'
import SearchBox from './SearchBox'
import 'tributejs/tribute.css'

const Task = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const params = useParams()
  const { userAccount } = useParams()
  const form = useRef()
  const taskStatus = useLocation().search.replace('?', '')
  // 处理带id的路由
  useLocationPage()
  const taskId = params.projectId || ''
  const {
    project,
    labels: { listData: labelsListData },
    projectTasks: {
      taskListData,
      searchOptions,
      taskListDataTotal,
      searchValue,
    },
    milestone: { milepostaData, milestonesId },

    loading,
  } = useSelector((state) => state)
  const { membersList } = project

  useEffect(() => {
    dispatch({ type: 'projectTasks/clean' })
  }, [dispatch])

  useEffect(() => {
    console.log('searchOptions====>', searchOptions)
    dispatch({
      type: 'projectTasks/update',
      payload: {
        searchOptions: {
          // ...searchOptions,
          createId: [], // 创建人
          labels: [], // 标签
          milestonesId: [], // 里程碑
          assignmentUserId: [], // 指派人
          page: 1,
          assignmentStatus: taskStatus,
        },
      },
    })
    dispatch.project.queryFuzzyAllProjectMember({ projectId: taskId }) // 初始化人员
    dispatch.labels.getAllLabelData({ projectId: taskId }) // 初始化标签数据
    dispatch.milestone.getListAll({
      projectId: taskId,
      milestonesStatusList: [1, 2],
    }) // 初始化里程碑

    dispatch.project.getAssignment({ projectId: taskId }) // 不分页获取所有任务
    dispatch.projectTasks.getTaskPagingData({
      projectId: taskId,
      milestonesId: [milestonesId],
    }) // 不分页获取所有任务
    dispatch.project.countAssignment({ projectId: taskId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]) // eslint-disable-line

  // 设置搜索输入框的value
  //  type:1 增加，2 删除 3 修改
  const setSearchValue = (value, type, sourceValue, targetValue) => {
    let newSearchValue = sourceValue
    if (type === 1) {
      // 增加
      newSearchValue = `${searchValue} ${value}`
    }
    if (type === 2) {
      // 删除
      newSearchValue = newSearchValue.replace(value, '')
    }
    if (type === 3) {
      // 替换
      newSearchValue = newSearchValue.replace(targetValue, value)
    }
    dispatch({
      type: 'projectTasks/update',
      payload: { searchValue: newSearchValue },
    })
  }

  // 操作
  const convertData = (item, dataSource, title, key, name) => {
    const result = dataSource?.filter((dataItem) => {
      return dataItem[key] === item
    })[0]
    return `${title}:${result[name]}`
  }

  const searchConfigObj = {
    labels: {
      title: '标签',
      key: 'id',
      name: 'name',
      dataSource: labelsListData,
    },
    createId: {
      title: '创建人',
      key: 'userId',
      name: 'userAcount',
      dataSource: membersList,
    },
    milestonesId: {
      title: '里程碑',
      key: 'milestonesId',
      name: 'milestonesTitle',
      dataSource: milepostaData,
    },
    assignmentUserId: {
      title: '指派人',
      key: 'userId',
      name: 'userAcount',
      dataSource: membersList,
    },
  }
  // 任务状态对象
  const taskStatusObj = {
    1: '未开始',
    2: '进行中',
    3: '已完成',
    4: '已逾期',
  }

  /**
   * 搜索变化触发回调
   * @param {params} 参数对象 {}
   * @param {value} 当前值
   * @param {form} 1:任务状态 2:其他信息 3:排序
   */
  const conditionChange = async (params, value, form) => {
    let type = '',
      stringValue = '',
      targetValue = ''
    if (form === 1) {
      // 任务状态
      stringValue = `状态:${taskStatusObj[value]} `
      targetValue = `状态:${taskStatusObj[searchOptions.assignmentStatus]} `
      type = 3
    }
    if (form === 2) {
      // 下拉框
      const key = searchConfigObj[Object.keys(params)[0]]?.key
      const title = searchConfigObj[Object.keys(params)[0]]?.title
      const name = searchConfigObj[Object.keys(params)[0]]?.name
      const dataSource = searchConfigObj[Object.keys(params)[0]]?.dataSource
      type = params[Object.keys(params)[0]].includes(value) ? 1 : 2 // 删除 or 新增
      stringValue = convertData(value, dataSource, title, key, name)
    }
    if (form === 3) {
      // 排序
      const key = searchConfigObj[Object.keys(params)[0]]?.key
      const title = searchConfigObj[Object.keys(params)[0]]?.title
      const name = searchConfigObj[Object.keys(params)[0]]?.name
      const dataSource = searchConfigObj[Object.keys(params)[0]]?.dataSource
      type = params[Object.keys(params)[0]].includes(value) ? 1 : 2 // 删除 or 新增
      stringValue = convertData(value, dataSource, title, key, name)
    }
    // 修改输入框的值
    setSearchValue(stringValue, type, searchValue, targetValue)

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
          <div>
            <SearchBox value={searchValue} projectId={taskId} />
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
            activeKey={taskStatus}
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

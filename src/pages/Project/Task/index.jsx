import { useEffect } from 'react'
import { Pagination, Loader } from 'uiw'
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
  const taskStatus = useLocation().search.replace('?', '')
  const urlSearch = useLocation().search
  // 解析
  const urlQuery = () => {
    return new URLSearchParams(urlSearch)
  }

  // 解析url中搜索参数
  const urlParsingObj = {
    state: '状态',
    create: '创建人',
    assigned: '指派人',
    label: '标签',
    milestone: '里程碑',
    q: '',
  }

  useEffect(() => {
    let newSearchValue = ''
    // 输出键值对
    for (let data of urlQuery()?.entries()) {
      if (urlParsingObj[data?.[0]]) {
        newSearchValue = `${newSearchValue} ${urlParsingObj[data?.[0]]}:${
          data[1]
        } `
      }
      if (!urlParsingObj[data?.[0]]) {
        newSearchValue = `${newSearchValue} ${data?.[0]}:${data[1]} `
      }
    }
    dispatch({
      type: 'projectTasks/update',
      payload: { searchValue: newSearchValue.trim() },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearch])
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
      taskNum,
    },
    milestone: { milepostaData },
    loading,
  } = useSelector((state) => state)
  const { membersList } = project
  const open = taskNum.all - taskNum.completed //打开状态的任务数量

  useEffect(() => {
    dispatch({ type: 'projectTasks/clean' })
  }, [dispatch])

  useEffect(() => {
    if (taskStatusObj[taskStatus]) {
      const { type } = taskStatusObj[taskStatus]
      const codeObj = { open: 1, close: 2 }
      const value = type === 'code' ? codeObj[taskStatus] : taskStatus
      conditionChange({ [type]: `${value || ''}` }, `${taskStatus || ''}`, 1)
    }
    // if (!taskStatus) {
    dispatch.projectTasks.getTaskPagingData({ projectId: taskId })
    dispatch.projectTasks.countAssignment({ projectId: taskId })
    // }
    // conditionChange({ code: `${taskStatus || ''}` }, `${taskStatus || ''}`, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, taskStatus])

  useEffect(() => {
    dispatch.project.queryFuzzyAllProjectMember({ projectId: taskId }) // 初始化人员
    dispatch.labels.getAllLabelData({ projectId: taskId }) // 初始化标签数据
    dispatch.milestone.getListAll({
      projectId: taskId,
      milestonesStatusList: [1, 2],
    }) // 初始化里程碑
    dispatch.project.getAssignment({ projectId: taskId }) // 不分页获取所有任务
    // dispatch.projectTasks.getTaskPagingData({
    //   projectId: taskId,
    // }) // 不分页获取所有任务
    dispatch.project.countAssignment({ projectId: taskId }) // 获取各个状态任务个数
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]) // eslint-disable-line

  /**
   * 设置搜索输入框的value
   * @param {string} value 初始值
   * @param {number} type  1 增加，2 删除 3 修改
   * @param {string} sourceValue 原始字符串
   * @param {string | regexp} targetValue  被替换的值，默认值为 value
   */
  const setSearchValue = (value, type, sourceValue, targetValue = value) => {
    let newSearchValue = ` ${sourceValue} `
    // 增加
    if (type === 1) {
      if (newSearchValue.search(targetValue) === -1) {
        // 如果不存在，则新增
      }
      newSearchValue = `${searchValue} ${value}`
    }
    // 删除
    if (type === 2) newSearchValue = newSearchValue.replace(value, '')
    if (type === 3) {
      // 如果不存在，则新增
      if (newSearchValue.search(targetValue) === -1)
        newSearchValue = `${searchValue} ${value}`
      // 如果存在，则替换
      if (newSearchValue.search(targetValue) !== -1)
        newSearchValue = newSearchValue.replace(targetValue, value)
    }
    dispatch({
      type: 'projectTasks/update',
      payload: { searchValue: newSearchValue.trim() },
    })
  }

  // 操作
  const convertData = (item, dataSource, title, key, name) => {
    const result = dataSource?.filter((dataItem) => {
      return dataItem[key] === item
    })[0]
    return `${title}:${result?.[name]}`
  }

  const searchConfigObj = {
    labels: {
      title: '标签',
      key: 'id',
      name: 'name',
      dataSource: labelsListData,
      regular: /标签:(?<labels>.*?)\s/g,
    },
    createId: {
      title: '创建人',
      key: 'userId',
      name: 'userAcount',
      dataSource: membersList,
      regular: /创建人:(?<createId>.*?)\s/g,
    },
    milestonesId: {
      title: '里程碑',
      key: 'milestonesId',
      name: 'milestonesTitle',
      dataSource: milepostaData,
      regular: /里程碑:(?<milestonesId>.*?)\s/g,
    },
    assignmentUserId: {
      title: '指派人',
      key: 'userId',
      name: 'userAcount',
      dataSource: membersList,
      regular: /指派人:(?<assignmentUserId>.*?)\s/g,
    },
  }

  // 任务状态对象
  const taskStatusObj = {
    open: { type: 'code', value: '打开' },
    close: { type: 'code', value: '关闭' },
    1: { type: 'assignmentStatus', value: '未开始' },
    2: { type: 'assignmentStatus', value: '进行中' },
    3: { type: 'assignmentStatus', value: '已完成' },
    4: { type: 'assignmentStatus', value: '已逾期' },
  }

  /**
   * 搜索变化触发回调
   * @param {params} 参数对象 {}
   * @param {value} 当前值
   * @param {form} 1:任务状态 2:其他信息 3:排序
   */
  const conditionChange = async (params, value, form) => {
    let type = '', // 类型 1：新增 2：删除 3：替换
      stringValue = '',
      targetValue = ''
    // 任务状态
    if (form === 1) {
      stringValue = value && `状态:${taskStatusObj[value].value} `
      targetValue = /状态:(?<start>.*?)\s/g
      type = 3
    }
    // 下拉框
    if (form === 2) {
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
      payload: {
        searchOptions: {
          ...searchOptions,
          assignmentStatus: null,
          code: null,
          page: 1,
          ...params,
        },
      },
    })
    await dispatch.projectTasks.getTaskPagingData({ projectId: taskId })
    await dispatch.projectTasks.countAssignment({ projectId: taskId })
  }

  const updateData = (payload) => {
    dispatch({ type: 'project/update', payload })
  }

  // 跳转方法
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
            <SearchBox
              value={searchValue}
              projectId={taskId}
              searchConfigObj={searchConfigObj}
            />
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
            activeKey={searchOptions.code}
            taskNum={{
              open: open,
              close: taskNum.completed,
            }}
          />
          <div className={styles.pagination}>
            {taskListDataTotal > 10 ? (
              <Pagination
                current={1}
                alignment="center"
                pageSize={searchOptions.pagesize}
                total={taskListDataTotal}
                onChange={(page) =>
                  dispatch.projectTasks.getTaskPagingData({
                    page,
                    projectId: taskId,
                  })
                }
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

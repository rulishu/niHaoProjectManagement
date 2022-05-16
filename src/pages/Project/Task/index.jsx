import { Fragment, useEffect } from 'react'
import { Button, Tabs, Pagination, Loader, Empty, Modal, Notify } from 'uiw'
import { List, SearchBar } from '@/components'
import styles from './index.module.less'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'

const listField = {
  title: 'assignmentTitle',
  createName: 'createName',
  createTime: 'createTime',
  issueNo: 'assignmentId',
  updateTime: 'updateTime',
  updateName: 'updateName',
}
const tabsLabel = (title, num) => {
  return (
    <div>
      <span className={styles.tabsLabelTitle}>{title}</span>
      <span className={styles.tabsLabelNum}>{num || 0}</span>
    </div>
  )
}
const Task = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const taskId = sessionStorage.getItem('id')

  const {
    project: {
      dataList,
      total,
      filter,
      closeDataList,
      closeTotal,
      openTataList,
      openTotal,
      activeKey,
    },
    loading,
  } = useSelector((state) => state)

  useEffect(() => {
    if (location?.state) {
      dispatch({
        type: 'project/update',
        payload: { activeKey: '1' },
      })
    }
    if (taskId) {
      dispatch.project.getList(
        location?.state
          ? { assignmentStatus: '', ...location?.state }
          : { assignmentStatus: '' }
      )
      dispatch.project.getList(
        location?.state
          ? { assignmentStatus: '1', ...location?.state }
          : { assignmentStatus: '1' }
      )
      dispatch.project.getList(
        location?.state
          ? { assignmentStatus: '3', ...location?.state }
          : { assignmentStatus: '3' }
      )
    }
  }, [taskId, dispatch, location?.state])

  const SearchBarOption = [
    { value: 1, text: '已打开' },
    { value: 3, text: '已关闭' },
    { value: '', text: '所有' },
  ]

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
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
    navigate('/project/newIssue')
  }

  const listGo = (item) => {
    updateData({ editId: item.assignmentId, editFromData: item })
    // navigate(`/project/taskInfo/${item.assignmentId}`, {
    //   state: { editId: item.assignmentId },
    // })
    console.log('item', item)

    navigate(
      `/project/taskInfo/${sessionStorage.getItem('companyId')}/${
        item.projectId
      }/${item.assignmentId}`
    )
  }
  const getTabList = async (activeKey) => {
    await updateData({ activeKey, filter: { ...filter, page: 1 } })
    await dispatch.project.getList(
      location?.state
        ? { assignmentStatus: activeKey, ...location?.state }
        : { assignmentStatus: activeKey }
    )
  }

  const getTaskListData = async (value, selectValue) => {
    await updateData({ activeKey: selectValue })
    await dispatch.project.getList({
      assignmentStatus: selectValue,
      assignmentTitle: value,
      page: 1,
    })
  }

  const delAssignment = async (item) => {
    Modal.show({
      title: '提示',
      confirmText: '确定',
      cancelText: '取消',
      children: `确定要删除该任务吗?`,
      onConfirm: async () => {
        await dispatch.project
          .deleteAssignment([{ id: item.assignmentId, projectId: taskId }])
          .then((res) => {
            if (res.code === 200) {
              Notify.success({ description: res.message })
              let newPage = filter.page
              let newListDate =
                activeKey === '1'
                  ? openTataList
                  : activeKey === '3'
                  ? closeDataList
                  : dataList
              if (newListDate.length === 1 && filter.page !== 1) {
                newPage = filter.page - 1
              }
              dispatch.project.getList({
                page: newPage,
                assignmentStatus: location?.state
                  ? activeKey
                  : { activeKey, ...location?.state },
              })
            }
          })
      },
    })
  }
  // 列表
  const taskDataList = (data, taskTotal, num) => {
    return (
      <div>
        {data.length > 0 ? (
          <Fragment>
            <List
              data={data || []}
              isIssue={true}
              listField={listField}
              listNavigate={listGo}
              delAssignment={delAssignment}
            />
            {taskTotal > 0 && (
              <Pagination
                current={filter.page}
                pageSize={10}
                total={taskTotal}
                alignment="center"
                onChange={(page, _, pageSize) => {
                  dispatch.project.goToPage({
                    page,
                    pageSize,
                    assignmentStatus: num,
                    createId: location?.state?.createId
                      ? location?.state.createId
                      : '',
                  })
                }}
              />
            )}
          </Fragment>
        ) : (
          <Empty />
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.project.getList}>
        <div>
          <div className={styles.nav}>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentSave">
              <Button type="primary" onClick={() => goIssue()}>
                新建问题
              </Button>
            </AuthBtn>
          </div>
          <div>
            <SearchBar
              isDrop={true}
              option={SearchBarOption}
              onSearch={(value, selectValue) =>
                getTaskListData(value, selectValue)
              }
            />
          </div>

          <Tabs
            type="line"
            activeKey={activeKey}
            onTabClick={(activeKey) => getTabList(activeKey)}>
            <Tabs.Pane label={tabsLabel('已打开', openTotal)} key="1">
              {taskDataList(openTataList, openTotal, '1')}
            </Tabs.Pane>
            <Tabs.Pane label={tabsLabel('已关闭', closeTotal)} key="3">
              {taskDataList(closeDataList, closeTotal, '3')}
            </Tabs.Pane>
            <Tabs.Pane label={tabsLabel('所有', total)} key="">
              {taskDataList(dataList, total, '')}
            </Tabs.Pane>
          </Tabs>
        </div>
      </Loader>
    </div>
  )
}

export default Task

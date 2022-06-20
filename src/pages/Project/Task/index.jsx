import { useState, Fragment, useEffect } from 'react'
import { Button, Tabs, Pagination, Loader, Empty, Modal, Notify } from 'uiw'
import { List } from '@/components'
import styles from './index.module.less'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useLocationPage from '@/hooks/useLocationPage'
import 'tributejs/tribute.css'

import AllSelect from './AllSelect'

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
    loading,
  } = useSelector((state) => state)
  const {
    dataList,
    filter,
    closeDataList,
    openTataList,
    prepareList,
    overtimeList,
    activeKey,
    teamMembers,
    taskNum,
    milistones,
  } = project

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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

  const delAssignment = async (item) => {
    Modal.show({
      title: '删除提示',
      confirmText: '确定',
      cancelText: '取消',
      children: `确定要删除该任务吗?`,
      icon: 'information',
      type: 'danger',
      onConfirm: async () => {
        await dispatch.project
          .deleteAssignment([{ id: item.assignmentId, projectId: taskId }])
          .then((res) => {
            if (res.code === 200) {
              Notify.success({ description: res.message })
              let newPage = filter.page
              let newListDate = []
              switch (activeKey) {
                case '1':
                  newListDate = prepareList
                  break
                case '2':
                  newListDate = openTataList
                  break

                case '3':
                  newListDate = closeDataList
                  break
                case '4':
                  newListDate = overtimeList
                  break
                default:
                  newListDate = dataList
              }

              // console.log('newListDate: ', newListDate)
              if (newListDate.length === 1 && filter.page !== 1) {
                newPage = filter.page - 1
              }

              pageS({
                page: newPage,
                assignmentStatus: activeKey,
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
        {(data || []).length > 0 ? (
          <Fragment>
            <List
              data={data || []}
              isIssue={true}
              listField={listField}
              listNavigate={listGo}
              delAssignment={delAssignment}
              labelsData={labelsListData}
            />
            {taskTotal > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <Pagination
                  current={filter.page}
                  pageSize={10}
                  total={taskTotal}
                  alignment="center"
                  onChange={(page, _, pageSize) => {
                    dispatch.project.goToPage({
                      page,
                      pageSize,
                      assignmentStatus: activeKey,
                      projectId: taskId,
                    })
                  }}
                />
              </div>
            )}
          </Fragment>
        ) : (
          <Empty style={{ padding: '30px 0' }} />
        )}
      </div>
    )
  }

  // 切换tab，查询分页
  const getTabList = async (activeKey) => {
    let tabDtos = [
      {
        condition: '=',
        field: 'assignmentStatus',
        value: activeKey,
      },
    ]
    if (activeKey === '') {
      tabDtos = []
    }
    updateData({
      activeKey,
      filter: { ...filter, page: 1 },
      tabDtos,
    })
    await pageS({
      assignmentStatus: activeKey,
    })
  }

  return (
    <div className={styles.wrap}>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.project.getList}>
        <div>
          <div className={styles.allSelectBox}>
            <AllSelect
              teamMembers={teamMembers}
              labelsListData={labelsListData?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              milistones={milistones}
              updateData={updateData}
              pageS={pageS}
              project={project}
            />
          </div>

          <div className={styles.nav}>
            <Button type="primary" onClick={() => goIssue()}>
              新建任务
            </Button>
          </div>
          <Tabs
            type="line"
            activeKey={activeKey}
            onTabClick={(activeKey) => {
              getTabList(activeKey)
            }}>
            <Tabs.Pane
              label={tabsLabel('未开始', taskNum.noGoing ? taskNum.noGoing : 0)}
              key="1">
              {taskDataList(
                prepareList,
                taskNum.noGoing ? taskNum.noGoing : 0,
                '1'
              )}
            </Tabs.Pane>
            <Tabs.Pane
              label={tabsLabel('进行中', taskNum.onGoing ? taskNum.onGoing : 0)}
              key="2">
              {taskDataList(
                openTataList,
                taskNum.onGoing ? taskNum.onGoing : 0,
                '2'
              )}
            </Tabs.Pane>
            <Tabs.Pane
              label={tabsLabel(
                '已完成',
                taskNum.completed ? taskNum.completed : 0
              )}
              key="3">
              {taskDataList(
                closeDataList,
                taskNum.completed ? taskNum.completed : 0,
                '3'
              )}
            </Tabs.Pane>

            <Tabs.Pane
              label={tabsLabel(
                '已逾期',
                taskNum.withoutTime ? taskNum.withoutTime : 0
              )}
              key="4">
              {taskDataList(
                overtimeList,
                taskNum.withoutTime ? taskNum.withoutTime : 0,
                '4'
              )}
            </Tabs.Pane>

            <Tabs.Pane
              label={tabsLabel('所有', taskNum.all ? taskNum.all : 0)}
              key="">
              {taskDataList(dataList, taskNum.all ? taskNum.all : 0, '')}
            </Tabs.Pane>
          </Tabs>
        </div>
      </Loader>
    </div>
  )
}

export default Task

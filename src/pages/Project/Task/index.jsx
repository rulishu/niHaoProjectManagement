import { Fragment, useEffect } from 'react'
import { Button, Tabs, Pagination, Loader, Empty, Modal, Notify } from 'uiw'
import { List } from '@/components'
import styles from './index.module.less'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import { AuthBtn } from '@uiw-admin/authorized'
import 'tributejs/tribute.css'
import useLocationPage from '@/hooks/useLocationPage'

// import LabelSelect from './LabelSelect'
import AllSelect from './AllSelect'

const listField = {
  title: 'assignmentTitle',
  createName: 'createName',
  createTime: 'createTime',
  issueNo: 'assignmentId',
  updateTime: 'updateTime',
  updateName: 'updateName',
}

// const SearchBarOption = [
//   { value: '1', text: '未开始' },
//   { value: '2', text: '已打开' },
//   { value: '3', text: '已完成' },
//   { value: '4', text: '已逾期' },
//   { value: '', text: '所有' },
// ]

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
  // const location = useLocation()
  const params = useParams()
  const { userAccount } = useParams()

  // 处理带id的路由
  useLocationPage()
  const taskId = params.projectId || ''
  const {
    project,
    // dictionary: { dictDataList },
    labels: { listData: labelsListData },
    loading,
  } = useSelector((state) => state)
  const {
    dataList,
    // total,
    filter,
    closeDataList,
    // closeTotal,
    openTataList,
    // openTotal,
    prepareList,
    // prepareTotal,
    overtimeList,
    // overtimeTotal,
    activeKey,
    teamMembers,
    taskNum,
    // assignmentLabels,
    milistones,
  } = project

  const pageS = (payload) => {
    dispatch.project.getList({ ...payload, projectId: taskId })
    dispatch.project.countAssignment({ ...payload, projectId: taskId })
  }

  useEffect(() => {
    // console.log('params', params)
    dispatch.project.queryFuzzyAllProjectMember({ projectId: taskId })
    dispatch.project.selectLabel({ projectId: taskId })
    dispatch.project.assignment_label()
    // dispatch.dictionary.getDictDataList({ dictType: 'assignment_label' })
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
        activeKey: '2',
        tabDtos: [
          {
            condition: '=',
            field: 'assignmentStatus',
            value: '2',
          },
        ],
        selectDtos: [],
      },
    })

    if (taskId) {
      // 任务状态(1.未开始 2.进行中 3.已完成,4.已逾期)
      pageS({
        assignmentStatus: '2',
      })
      dispatch({
        type: 'project/getProjectCountById', //统计
        payload: {
          projectId: taskId,
        },
      })
    } else {
      Notify.success({ description: '查无此项' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

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
    navigate(`/${userAccount}/${params.projectId}/task/newIssue`)
  }

  const listGo = (item) => {
    updateData({ editId: item.assignmentId, editFromData: item })
    // navigate(`/project/taskInfo/${item.assignmentId}`, {
    //   state: { editId: item.assignmentId },
    // })
    // console.log('item', item)

    navigate(
      `/${userAccount}/${item.projectId}/task/taskInfo/${item.assignmentId}`
    )
  }

  // // 搜索按钮事件
  // const getTaskListData = async (value, selectValue) => {
  //   updateData({ activeKey: selectValue })
  //   // await dispatch.project.getList({
  //   //   assignmentStatus: selectValue,
  //   //   assignmentTitle: value,
  //   //   page: 1,
  //   // })

  //   pageS({
  //     assignmentStatus: activeKey,
  //   })
  // }

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
              <Pagination
                current={filter.page}
                pageSize={10}
                total={taskTotal}
                alignment="center"
                onChange={(page, _, pageSize) => {
                  dispatch.project.goToPage({
                    page,
                    pageSize,
                    // assignmentStatus: num,
                    assignmentStatus: activeKey,
                    projectId: taskId,
                    // createId: location?.state?.createId
                    //   ? location?.state.createId
                    //   : '',
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
          <div className={styles.nav}>
            {/* <AuthBtn path="/api/ManagerAssignment/managerAssignmentSave"> */}
            <Button type="primary" onClick={() => goIssue()}>
              新建任务
            </Button>
            {/* </AuthBtn> */}
          </div>
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
          {/* <div>
            <LabelSelect />
          </div>
          <div>
            <SearchBar
              isDrop={true}
              option={SearchBarOption}
              onSearch={(value, selectValue) =>
                getTaskListData(value, selectValue)
              }
            />
          </div> */}
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

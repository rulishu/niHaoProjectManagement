import { Fragment, useEffect } from 'react'
import { Button, Tabs, Pagination, Loader, Tooltip } from 'uiw'
import { SearchBar } from '@/components'
import styles from './index.module.less'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
// import { AuthBtn } from '@uiw-admin/authorized'
import arr from './data'
import 'tributejs/tribute.css'
import {
  Row,
  Col,
  Icon,
  // Progress,
  List,
} from 'uiw'
import dayjs from 'dayjs'

const listField = {
  title: 'assignmentTitle',
  createName: 'createName',
  createTime: 'createTime',
  issueNo: 'assignmentId',
  updateTime: 'updateTime',
  updateName: 'updateName',
}

// const milestoneStatus = {
//   1: { title: 'addtodo', className: 'blue' },
//   2: { title: '关闭', className: 'brown' },
//   3: { title: '删除', className: 'red' },
// }

const SearchBarOption = [
  { value: 1, text: '待处理' },
  // { value: 3, text: '已关闭' },
  { value: '', text: '已完成' },
]

const tabsLabel = (title, num) => {
  return (
    <div>
      <span className={styles.tabsLabelTitle}>{title}</span>
      <span className={styles.tabsLabelNum}>{num || 0}</span>
    </div>
  )
}

const TodoList = (props) => {
  // const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const taskId = sessionStorage.getItem('id')

  const {
    todolist: {
      dataList,
      total,
      filter,
      // closeDataList,
      // closeTotal,
      openTataList,
      openTotal,
      activeKey,
    },
    loading,
  } = useSelector((state) => state)

  // 进页面先查询一次，获取任务数量角标
  useEffect(() => {
    if (location?.state) {
      dispatch({
        type: 'todolist/update',
        payload: { activeKey: '1' },
      })
    }
    if (taskId) {
      dispatch.todolist.getList(
        location?.state
          ? { assignmentStatus: '', ...location?.state }
          : { assignmentStatus: '' }
      )
      dispatch.todolist.getList(
        location?.state
          ? { assignmentStatus: '1', ...location?.state }
          : { assignmentStatus: '1' }
      )
      dispatch.todolist.getList(
        location?.state
          ? { assignmentStatus: '3', ...location?.state }
          : { assignmentStatus: '3' }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateData = (payload) => {
    dispatch({
      type: 'todolist/update',
      payload,
    })
  }

  // 搜索按钮事件
  const getTaskListData = async (value, selectValue) => {
    updateData({ activeKey: selectValue })
    await dispatch.todolist.getList({
      assignmentStatus: selectValue,
      assignmentTitle: value,
      page: 1,
    })
  }

  // const {  listField } = props

  // console.log('arr--->', arr)
  // 列表
  const taskDataList = (data, taskTotal, num) => {
    // console.log('listField', listField)
    return (
      <div>
        {/* {data.length > 0 ? ( */}
        <Fragment>
          <List
            className={styles.list}
            dataSource={arr}
            bordered={false}
            noHover={true}
            renderItem={(item, index) => {
              return (
                <List.Item
                  key={index}
                  extra={
                    <div>
                      <div className={styles.listIssueIcon}>
                        <Tooltip placement="top" content="Assignees">
                          <span className={styles.taskUserName}>
                            {/* {item.assigneeUserName && <Icon type="user" />}{' '}
                              {item.assigneeUserName} */}
                          </span>
                        </Tooltip>
                        {/* <Icon type="message" /> */}
                        {/* <span className={styles.listIconSpan}>0</span> */}
                        {/* <Tooltip placement="top" content="Move">
                            <span
                              className={styles.listIconSpan}
                              onClick={() => delAssignment(item)}>
                              <Icon type="delete" />
                            </span>
                          </Tooltip> */}
                      </div>
                      {/* {listField?.updateName
                          ? item[listField.updateName]
                          : item?.updateName}{' '}
                        更新于{' '}
                        {listField?.updateTime
                          ? item[listField.updateTime]
                          : item?.updateTime} */}
                    </div>
                  }>
                  <Row gutter={10} className={styles.listRow}>
                    <Col
                      // span={18}
                      className={styles.listCol}>
                      <a href={item?.nav} className={styles.listTitle}>
                        {listField?.title ? item[listField.title] : item.title}
                      </a>

                      <div className={styles.listContent}>
                        #{' '}
                        {listField?.issueNo ? item[listField.issueNo] : item.id}{' '}
                        · 创建于{' '}
                        {listField?.createTime
                          ? item[listField.createTime]
                          : item?.createTime}{' '}
                        由{' '}
                        {listField?.createName
                          ? item[listField.createName]
                          : item?.createName}{' '}
                        {item?.dueDate && (
                          <Tooltip placement="top" content="Due date">
                            <span
                              className={`dueDate ${
                                dayjs(item?.dueDate)?.diff(
                                  dayjs().format('YYYY-MM-DD'),
                                  'hour'
                                ) < 0 && item?.assignmentStatus === 1
                                  ? 'redDate'
                                  : ''
                              }`}>
                              <Icon type="date" />{' '}
                              {listField?.dueDate
                                ? item[listField.dueDate]
                                : item?.dueDate}
                            </span>
                          </Tooltip>
                        )}
                        {item?.labels
                          ? item?.labels.map((list, index2) => {
                              return (
                                <span
                                  key={index2 + index}
                                  className={styles.listIssueStatus}
                                  style={{
                                    backgroundColor: list.dictColour,
                                  }}>
                                  {list.dictName}
                                </span>
                              )
                            })
                          : null}
                      </div>
                    </Col>
                    <Col span="8" className={styles.itemListRight}>
                      <div>
                        <Button type="primary" size="default">
                          完毕
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </List.Item>
              )
            }}
          />
          {taskTotal > 10 && (
            <Pagination
              current={filter.page}
              pageSize={10}
              total={taskTotal}
              alignment="center"
              onChange={(page, _, pageSize) => {
                dispatch.todolist.goToPage({
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
        {/* ) : ( */}
        {/* <Empty /> */}
        {/* )} */}
      </div>
    )
  }

  // 切换tab，查询分页
  const getTabList = async (activeKey) => {
    updateData({ activeKey, filter: { ...filter, page: 1 } })
    await dispatch.todolist.getList(
      location?.state
        ? { assignmentStatus: activeKey, ...location?.state }
        : { assignmentStatus: activeKey }
    )
  }

  return (
    <div className={styles.wrap}>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.todolist.getList}>
        <div>
          <div className={styles.nav}>
            {/* {/* <AuthBtn path="/api/ManagerAssignment/managerAssignmentSave"> */}
            {/* <Button type="primary" onClick={() => goIssue()}> */}
            待办事项列表
            {/* </Button> */}
            {/* </AuthBtn> */}
          </div>

          <Tabs
            type="line"
            activeKey={activeKey}
            onTabClick={(activeKey) => getTabList(activeKey)}>
            <Tabs.Pane label={tabsLabel('待处理', openTotal)} key="1">
              <div>
                <SearchBar
                  isDrop={true}
                  option={SearchBarOption}
                  onSearch={(value, selectValue) =>
                    getTaskListData(value, selectValue)
                  }
                />
              </div>
              {taskDataList(openTataList, openTotal, '1')}
            </Tabs.Pane>
            {/* <Tabs.Pane label={tabsLabel('已关闭', closeTotal)} key="3">
              <div>
                <SearchBar
                  isDrop={true}
                  option={SearchBarOption}
                  onSearch={(value, selectValue) =>
                    getTaskListData(value, selectValue)
                  }
                />
              </div>
              {taskDataList(closeDataList, closeTotal, '3')}
            </Tabs.Pane> */}
            <Tabs.Pane label={tabsLabel('已完成', total)} key="">
              <div>
                <SearchBar
                  isDrop={true}
                  option={SearchBarOption}
                  onSearch={(value, selectValue) =>
                    getTaskListData(value, selectValue)
                  }
                />
              </div>
              {taskDataList(dataList, total, '')}
            </Tabs.Pane>
          </Tabs>
        </div>
      </Loader>
    </div>
  )
}

export default TodoList

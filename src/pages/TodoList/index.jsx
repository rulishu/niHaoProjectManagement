import { Fragment, useEffect } from 'react'
import {
  Button,
  Tabs,
  Pagination,
  Loader,
  Tooltip,
  Empty,
  Row,
  Col,
  Icon,
  List, // Progress,
} from 'uiw'
import { Container } from '@/components'
import styles from './index.module.less'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import 'tributejs/tribute.css'
import AllSelect from './AllSelect'

const tabsLabel = (title, num) => {
  return (
    <div>
      <span className={styles.tabsLabelTitle}>{title}</span>
      <span className={styles.tabsLabelNum}>{num || 0}</span>
    </div>
  )
}

const TodoList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const taskId = sessionStorage.getItem('id')
  const { todolist, loading } = useSelector((state) => state)
  const {
    todolist: {
      dataList,
      total,
      filter,
      openTataList,
      openTotal,
      activeKey,
      teamMembers,
      assignmentLabels,
    },
  } = useSelector((state) => state)
  // console.log('openTataList', openTataList)
  // console.log('dataList', dataList)
  // 进页面先查询一次，获取任务数量角标
  useEffect(() => {
    if (location?.state) {
      dispatch({
        type: 'todolist/update',
        payload: { activeKey: '0' },
      })
    }
    dispatch.todolist.getselectAssignUser()
    dispatch.todolist.getselectAllUserProject()
    if (taskId) {
      dispatch.todolist.getList(
        location?.state ? { status: '0', ...location?.state } : { status: '0' }
      )
      dispatch.todolist.getList(
        location?.state ? { status: '1', ...location?.state } : { status: '1' }
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

  // 列表
  const taskDataList = (data, taskTotal, num) => {
    // console.log('listField', listField)

    return (
      <div>
        {data.length > 0 ? (
          <Fragment>
            <List
              className={styles.list}
              dataSource={data}
              bordered={false}
              noHover={true}
              renderItem={(item, index) => {
                // console.log('item', item.status)
                return (
                  <List.Item
                    key={index}
                    extra={
                      <div>
                        <div className={styles.listIssueIcon}>
                          <Tooltip
                            placement="top"
                            content="Assignees"></Tooltip>
                        </div>
                      </div>
                    }>
                    <Row gutter={10} className={styles.listRow}>
                      <div
                        onClick={() => {
                          navigate(`/project/taskInfo/:projectId/:id`)
                        }}>
                        <Col
                          // span={18}
                          className={styles.listCol}>
                          <a href={item?.nav} className={styles.listTitle}>
                            {item.title}
                          </a>
                          <div className={styles.listContent}>
                            <Icon type="user" size="big" /> 你
                            <span className={styles.projectName}>
                              {item.doType === 0 ? '评论' : '任务指派给'}{' '}
                            </span>
                            <Icon type="user" /> {item.doUserName}
                            <span className={styles.projectName}>
                              #{item.issuesId}
                            </span>
                            ''{item.doConnent}'' 在
                            <span className={styles.projectName}>
                              {item.projectName}
                            </span>
                            由 {item.assignUserName} 创建于 {item?.createTime}
                          </div>
                        </Col>
                      </div>
                      <Col span="8" className={styles.itemListRight}>
                        <div>
                          <Button
                            type="primary"
                            size="default"
                            onClick={() =>
                              dispatch({
                                type: 'todolist/getStrutsSwitch',
                                payload: {
                                  id: item.id,
                                  status: item.status,
                                },
                              })
                            }>
                            {item.status === 1 ? '去处理' : '完毕'}
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
                onChange={(pages, _, pageSize) => {
                  dispatch.todolist.goToPage({
                    pages,
                    pageSize,
                    status: num,
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
    updateData({ activeKey, filter: { ...filter, page: 1 } })
    await dispatch.todolist.getList(
      location?.state
        ? { status: activeKey, ...location?.state }
        : { status: activeKey }
    )
  }

  return (
    <Container theme="white">
      <div className={styles.wrap}>
        <Loader
          tip="加载中..."
          vertical
          style={{ width: '100%' }}
          loading={loading.effects.todolist.getList}>
          <div>
            <div className={styles.nav}>待办事项列表</div>

            <Tabs
              type="line"
              activeKey={activeKey}
              onTabClick={(activeKey) => getTabList(activeKey)}>
              <Tabs.Pane label={tabsLabel('待处理', openTotal)} key="0">
                <div>
                  <AllSelect
                    teamMembers={teamMembers}
                    assignmentLabels={assignmentLabels}
                    updateData={updateData}
                    todolist={todolist}
                  />
                </div>
                {taskDataList(openTataList, openTotal, '0')}
              </Tabs.Pane>
              <Tabs.Pane label={tabsLabel('已完成', total)} key="1">
                <div>
                  <AllSelect
                    teamMembers={teamMembers}
                    assignmentLabels={assignmentLabels}
                    updateData={updateData}
                    todolist={todolist}
                  />
                </div>
                {taskDataList(dataList, total, '1')}
              </Tabs.Pane>
            </Tabs>
          </div>
        </Loader>
      </div>
    </Container>
  )
}

export default TodoList

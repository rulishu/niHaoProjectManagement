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
import { SearchBar, Container } from '@/components'
import styles from './index.module.less'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import 'tributejs/tribute.css'

// const milestoneStatus = {
//   1: { title: 'addtodo', className: 'blue' },
//   2: { title: '关闭', className: 'brown' },
//   3: { title: '删除', className: 'red' },
// }

const SearchBarOption = [
  { value: '0', text: '待处理' },
  { value: '1', text: '已完成' },
]

const tabsLabel = (title, num) => {
  return (
    <div>
      <span className={styles.tabsLabelTitle}>{title}</span>
      <span className={styles.tabsLabelNum}>{num || 0}</span>
    </div>
  )
}

const TodoList = () => {
  // const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  const taskId = sessionStorage.getItem('id')

  const {
    todolist: { dataList, total, filter, openTataList, openTotal, activeKey },
    loading,
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

  // 搜索按钮事件
  const getTaskListData = async (value, selectValue) => {
    updateData({ activeKey: selectValue })
    await dispatch.todolist.getList({
      status: selectValue,
      assignmentTitle: value,
      page: 1,
    })
  }

  // console.log('arr--->', arr)

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
                      <Col span="8" className={styles.itemListRight}>
                        <div>
                          <Button
                            type="primary"
                            size="default"
                            onClick={() =>
                              dispatch({
                                type: 'todolist/getStrutsSwitch',
                                payload: { id: item.id, status: item.status },
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
                onChange={(page, _, pageSize) => {
                  dispatch.todolist.goToPage({
                    page,
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
                  <SearchBar
                    isDrop={true}
                    option={SearchBarOption}
                    onSearch={(value, selectValue) =>
                      getTaskListData(value, selectValue)
                    }
                  />
                </div>
                {taskDataList(openTataList, openTotal, '0')}
              </Tabs.Pane>
              <Tabs.Pane label={tabsLabel('已完成', total)} key="1">
                <div>
                  <SearchBar
                    isDrop={true}
                    option={SearchBarOption}
                    onSearch={(value, selectValue) =>
                      getTaskListData(value, selectValue)
                    }
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

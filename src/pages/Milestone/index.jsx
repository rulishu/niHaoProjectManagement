import { Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Tabs,
  Pagination,
  Row,
  Col,
  List,
  Progress,
  Empty,
  Loader,
  Tooltip,
  Icon,
} from 'uiw'
import { useNavigate } from 'react-router-dom'
import { AuthBtn } from '@uiw-admin/authorized'
import { StatusTag, SearchBar } from '@/components'
import dayjs from 'dayjs'
import styles from './index.module.less'

const { Line } = Progress

const tabsLabel = (title, num) => {
  return (
    <div>
      <span className={styles.tabsLabelTitle}>{title}</span>
      <span className={styles.tabsLabelNum}>{num || 0}</span>
    </div>
  )
}

const Milestone = (props) => {
  const navigate = useNavigate()
  useEffect(() => {
    // milestonesStatusList 1:打开2:关闭3：删除
    props.dispatch.selectPageList({
      milestonesStatusList: [],
      projectId: sessionStorage.getItem('id'),
    })
    // 查询 已完成
    props.dispatch.selectPageList({
      milestonesStatusList: [1],
      projectId: sessionStorage.getItem('id'),
    })
    props.dispatch.selectPageList({
      milestonesStatusList: [2],
      projectId: sessionStorage.getItem('id'),
    })
  }, [props.dispatch])

  const milestoneStatus = {
    1: { title: '打开', className: 'blue' },
    2: { title: '关闭', className: 'brown' },
    3: { title: '删除', className: 'red' },
  }

  const goNewNmilestone = () => {
    props.dispatch.update({ milestoneType: 1, listDataInfo: {} })
    navigate('/milestone/newMilestone')
  }

  const listGo = (milestonesId) => {
    navigate('/milestone/milestoneInfo', {
      state: { milestonesId },
    })
  }

  const getMilestoneListData = async (value, selectValue) => {
    await props.dispatch.update({ activeKey: selectValue })
    await props.dispatch.selectPageList({
      milestonesTitle: value,
      milestonesStatusList: selectValue ? [selectValue] : [],
    })
  }

  // 里程碑列表
  const milesList = (data, newTotal) => {
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
                    className={styles.listItem}
                    onClick={() => {
                      listGo(item.milestonesId)
                    }}
                    style={{ width: '100%', borderRadius: 0 }}>
                    <Row style={{ width: '100%' }}>
                      <Col span="10">
                        <div className={styles.itemList}>
                          <div className={styles.title}>
                            {item.milestonesTitle}
                          </div>
                          <div className={styles.info}>
                            创建于 {item.createTime} 由 {item.createName}
                            {item?.dueTime && (
                              <Tooltip placement="top" content="Due date">
                                <span
                                  className={`dueDate ${
                                    dayjs(item?.dueTime)?.diff(
                                      dayjs().format('YYYY-MM-DD'),
                                      'hour'
                                    ) < 0 && item?.milestonesStatus === 1
                                      ? 'redDate'
                                      : ''
                                  }`}>
                                  <Icon type="date" /> {item?.dueTime}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col span="10">
                        <Line
                          percent={(+item.degreeCompletion * 100).toFixed()}
                          showText={false}
                        />
                        <div className={styles.progressText}>
                          <span className={styles.num}>
                            {item?.allTaskNum} 个任务数
                          </span>
                          <span className={styles.plan}>
                            {(+item?.degreeCompletion * 100).toFixed()} %完成
                          </span>
                        </div>
                      </Col>
                      <Col span="4" className={styles.status}>
                        <StatusTag
                          status={item?.milestonesStatus}
                          statusList={milestoneStatus}
                          size="big"
                        />
                      </Col>
                    </Row>
                  </List.Item>
                )
              }}
            />
            {+newTotal > 10 && (
              <div className={styles.paging}>
                <Pagination
                  current={filter.page}
                  total={newTotal}
                  alignment="center"
                  onChange={(page, _, pageSize) => {
                    props.dispatch.selectPageList({
                      milestonesStatusList: activeKey ? [activeKey] : [],
                      page,
                      pageSize,
                    })
                  }}
                />
              </div>
            )}
          </Fragment>
        ) : (
          <Empty />
        )}
      </div>
    )
  }

  const {
    filter,
    listData,
    total,
    activeKey,
    openListData,
    openListTotal,
    closeListData,
    closeListTotal,
  } = props.milestone
  const { loading } = props

  return (
    <div className={styles.wrap}>
      <div className={styles.nav}>
        <div>
          <AuthBtn path="/project/milestone/newMilestone">
            <Button type="primary" onClick={() => goNewNmilestone()}>
              新建里程碑
            </Button>
          </AuthBtn>
        </div>
      </div>
      <div>
        <SearchBar
          isDrop={true}
          onSearch={(value, selectValue) =>
            getMilestoneListData(value, selectValue)
          }
        />
      </div>
      <Loader
        tip="loading..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.milestone.selectPageList}>
        <Tabs
          type="line"
          activeKey={activeKey}
          onTabClick={(activeKey) => props.dispatch.update({ activeKey })}>
          <Tabs.Pane label={tabsLabel('打开', openListTotal)} key="1">
            {milesList(openListData, openListTotal)}
          </Tabs.Pane>
          <Tabs.Pane label={tabsLabel('关闭', closeListTotal)} key="2">
            {milesList(closeListData, closeListTotal)}
          </Tabs.Pane>
          <Tabs.Pane label={tabsLabel('所有', total)} key="">
            {milesList(listData, total)}
          </Tabs.Pane>
        </Tabs>
      </Loader>
    </div>
  )
}

const mapStateToProps = ({ milestone, loading }) => ({
  milestone: milestone,
  loading: loading,
})

const mapDispatchToProps = ({ milestone }) => ({
  dispatch: milestone,
})

export default connect(mapStateToProps, mapDispatchToProps)(Milestone)

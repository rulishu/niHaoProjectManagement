import { useState, Fragment, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Tabs,
  Input,
  Pagination,
  Row,
  Col,
  List,
  Progress,
  Empty,
  Loader,
  Icon,
  OverlayTrigger,
} from 'uiw'
import { useNavigate, useLocation } from 'react-router-dom'
import timeDistance from '@/utils/timeDistance'
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
  const location = useLocation()
  const pathArr = location.pathname.split('/')
  const projectId = pathArr[pathArr.length - 1]

  useEffect(() => {
    // milestonesStatusList 1:打开2:关闭3：删除
    props.dispatch.selectPageList({
      milestonesStatusList: [],
      projectId: projectId,
    })
    props.dispatch.selectPageList({
      milestonesStatusList: [1],
      projectId: projectId,
    })
    props.dispatch.selectPageList({
      milestonesStatusList: [2],
      projectId: projectId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, props.dispatch])

  // 赛选分类
  const [sorting, setSorting] = useState(1)

  const [isPulldown, setIsPulldown] = useState(false)

  const goNewNmilestone = () => {
    props.dispatch.update({ milestoneType: 1, listDataInfo: {} })
    navigate(`/milestone/newMilestone/${projectId}`, { state: { projectId } })
  }

  const listGo = (milestonesId) => {
    navigate(`/milestone/milestoneInfo/${projectId}/${milestonesId}`, {
      state: { projectId, milestonesId },
    })
  }

  // const getMilestoneListData = async (value, selectValue) => {
  //   await props.dispatch.update({ activeKey: selectValue })
  //   await props.dispatch.selectPageList({
  //     milestonesTitle: value,
  //     milestonesStatusList: selectValue ? [selectValue] : [],
  //   })  // }

  const sortingList = [
    { value: 1, title: '即将到期' },
    { value: 2, title: '稍后到期' },
    { value: 3, title: '马上开始' },
    { value: 4, title: '稍后开始' },
  ]

  // 关闭里程碑
  const closingMilestone = async (projectId, milestonesId) => {
    await props.dispatch.editStatusMilestones({
      milestonesId,
      milestonesStatus: 2,
      projectId,
    })
    props.dispatch.selectPageList({
      milestonesStatusList: [],
      projectId: projectId,
    })
    props.dispatch.selectPageList({
      milestonesStatusList: [1],
      projectId: projectId,
    })
    props.dispatch.selectPageList({
      milestonesStatusList: [2],
      projectId: projectId,
    })
  }

  // 里程碑列表
  const milesList = (data, newTotal) => {
    return (
      <div className={styles.contentList}>
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
                    style={{ width: '100%', padding: 0, borderRadius: 0 }}>
                    <Row className={styles.milestonesItemList}>
                      <Col span="12" className={styles.itemListLeft}>
                        <div
                          className={styles.title}
                          onClick={() => listGo(item.milestonesId)}>
                          {item.milestonesTitle}
                        </div>
                        {item.startTime && (
                          <div className={styles.date}>
                            {item.startTime}
                            {item.dueTime && '-' + item.dueTime}
                          </div>
                        )}
                        <div>
                          {item.dueTime &&
                            item.milestonesStatus === 1 &&
                            !timeDistance(item.createTime, item.dueTime)
                              ?.status && (
                              <span className={styles.overdue}>已延期</span>
                            )}
                          <span className={styles.project}>
                            {item.createName} / {item.projectName}
                          </span>
                        </div>
                      </Col>
                      <Col span="8" className={styles.itemListMiddle}>
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
                      <Col span="4" className={styles.itemListRight}>
                        <div>
                          {item.milestonesStatus === 1 && (
                            <Button
                              onClick={() => {
                                closingMilestone(
                                  item.projectId,
                                  item.milestonesId
                                )
                              }}>
                              关闭里程碑
                            </Button>
                          )}
                        </div>
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

  const card = (
    <div className={styles.dropdownMenu}>
      <ul>
        {sortingList.map((item) => (
          <li
            key={item.value}
            onClick={() => {
              setIsPulldown(false)
              setSorting(item.value)
            }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )

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
      <Loader
        tip="loading..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.milestone.selectPageList}>
        <div>
          <div className={styles.topArea}>
            <Tabs
              type="line"
              activeKey={activeKey}
              onTabClick={(activeKey) => props.dispatch.update({ activeKey })}>
              <Tabs.Pane label={tabsLabel('打开', openListTotal)} key="1" />
              <Tabs.Pane label={tabsLabel('关闭', closeListTotal)} key="2" />
              <Tabs.Pane label={tabsLabel('所有', total)} key="" />
            </Tabs>
            <div className={styles.navControls}>
              <div>
                <Input
                  placeholder="请输入内容"
                  style={{ maxWidth: 200 }}
                  onChange={(e) => console.log(e.target.value)}
                  onBlur={(e) => console.log(e.target.value)}
                />
              </div>
              <div className={styles.dropdown}>
                <OverlayTrigger
                  placement="bottomRight"
                  trigger="click"
                  isOpen={isPulldown}
                  onVisibleChange={(open) => setIsPulldown(open)}
                  overlay={card}>
                  <div className={styles.toggle}>
                    <span>
                      {sortingList.map(
                        (item) => item.value === sorting && item.title
                      )}
                    </span>
                    <Icon type={isPulldown ? 'up' : 'down'} />
                  </div>
                </OverlayTrigger>
              </div>
              <div>
                <Button type="primary" onClick={() => goNewNmilestone()}>
                  创建里程碑
                </Button>
              </div>
            </div>
          </div>
          {activeKey === '1' && (
            <div>{milesList(openListData, openListTotal)}</div>
          )}
          {activeKey === '2' && (
            <div>{milesList(closeListData, closeListTotal)}</div>
          )}
          {activeKey === '' && <div>{milesList(listData, total)}</div>}
        </div>
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

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TableManage from './TableManage'
import { Row, Col, Card, Progress, Menu, Button, Empty } from 'uiw'
import styles from './index.module.less'
import SlelectLabel from './SlelectLabel'
import TodoList from './TodoList'
import { Container } from '@/components'
import dayjs from 'dayjs'
import { NumColor } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

export default function Demo() {
  const dispatch = useDispatch()
  const {
    workbench: { projectList },
  } = useSelector((state) => state)
  const navigate = useNavigate()
  const [projectData, setProject] = useState({})
  const [totalData, setTotalData] = useState({})
  const [milepost, setMilepost] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    dispatch({
      type: 'workbench/gettodoList',
    })
    dispatch({
      type: 'workbench/myProject',
    })
  }, [dispatch])

  // 跳转里程碑详情
  const goMilestones = (projectUrl, milestonesId) => {
    navigate(`${projectUrl}/milestone/milestoneInfo/${milestonesId}`)
  }
  //默认选中第一个
  const onClickItem = (key) => {
    setActive(key)
  }
  const projectListOne = projectList?.at(0)
  const milesWorkVoListOne = projectListOne?.milesWorkVoList
  const totalWorkVoOne = projectListOne?.totalWorkVo
  //判断是否可以看到所有项目列表
  const naid = localStorage.getItem('key')
  // const Blank = ({ num, height, width, style, background }) => (
  //   <div
  //     style={{
  //       marginLeft: -5,
  //       ...style,
  //       textAlign: 'center',
  //       paddingTop: 5,
  //       paddingBottom: 5,
  //       background,
  //       width: 100,
  //       height,
  //     }}>
  //     {num}
  //   </div>
  // )
  return (
    <Container>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '25%' }}>
            <Card title="近期参与的项目" bordered={false}>
              <Col
                fixed
                style={{ height: 330, overflowX: 'hidden', overflowY: 'auto' }}>
                {projectList.length === 0 ? (
                  <Empty style={{ marginTop: 20 }} />
                ) : (
                  <Menu>
                    {projectList?.map((e, key) => {
                      return (
                        <Menu.Item
                          icon={e.icon}
                          text={e.projectName}
                          key={e.projectId}
                          onClick={() => {
                            const totalData = e.totalWorkVo
                            onClickItem(key)
                            setProject({ ...e })
                            setTotalData({ ...totalData })
                            setMilepost(e.milesWorkVoList)
                          }}
                          active={active === key}
                        />
                      )
                    })}
                  </Menu>
                )}
              </Col>
            </Card>
          </Col>
          <Col fixed style={{ width: '50%' }}>
            <Card
              title={
                active === 0
                  ? projectListOne?.projectName
                  : projectData?.projectName
              }
              bordered={false}
              style={{ height: 400 }}>
              <Row>
                <Col
                  style={{
                    textAlign: 'center',
                  }}>
                  <Progress.Circle
                    width={100}
                    strokeWidth={10}
                    percent={
                      projectList.length === 0
                        ? 0
                        : active === 0
                        ? NumColor(
                            totalWorkVoOne?.projectYwcNum,
                            totalWorkVoOne?.projectNum
                          )
                        : NumColor(
                            totalData?.projectYwcNum,
                            totalData?.projectNum
                          )
                    }
                    format={(percent) => (
                      <span>
                        {projectList.length === 0
                          ? 0
                          : active === 0
                          ? totalWorkVoOne?.projectNum
                          : totalData?.projectNum}
                        <div style={{ padding: '10px 0 0 0', fontSize: 12 }}>
                          总任务
                        </div>
                      </span>
                    )}
                  />
                  <div>
                    {projectList.length ? (
                      <div style={{ margin: 10 }}>
                        {totalWorkVoOne?.projectNum !== 0 ||
                        totalData?.projectNum !== 0 ? (
                          <Button
                            type="primary"
                            onClick={() => {
                              if (active === 0) {
                                navigate(`${projectListOne.projectUrl}/task`)
                              } else {
                                navigate(`${projectData.projectUrl}/task`)
                              }
                            }}>
                            查看全部
                          </Button>
                        ) : (
                          ''
                        )}
                        <Button
                          type="primary"
                          onClick={() => {
                            if (active === 0) {
                              navigate(`${projectListOne.projectUrl}`)
                            } else {
                              navigate(`${projectData.projectUrl}`)
                            }
                          }}>
                          项目概览
                        </Button>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div
                    style={{
                      marginTop: 20,
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                    }}>
                    {[
                      {
                        title: '未开始',
                        num:
                          projectList.length === 0
                            ? 0
                            : active === 0
                            ? totalWorkVoOne?.projectWksNum
                            : totalData?.projectWksNum,
                        key: 1,
                      },
                      {
                        title: '开发中',
                        num:
                          projectList.length === 0
                            ? 0
                            : active === 0
                            ? totalWorkVoOne?.projectKfzNum
                            : totalData?.projectKfzNum,
                        key: 2,
                      },
                      {
                        title: '已完成',
                        num:
                          projectList.length === 0
                            ? 0
                            : active === 0
                            ? totalWorkVoOne?.projectYwcNum
                            : totalData?.projectYwcNum,
                        key: 3,
                      },
                      {
                        title: '已逾期',
                        num:
                          projectList.length === 0
                            ? 0
                            : active === 0
                            ? totalWorkVoOne?.projectYqsNum
                            : totalData?.projectYqsNum,
                        key: 4,
                      },
                    ].map((item, key) => {
                      return (
                        <div key={key}>
                          <Card
                            bordered={false}
                            title={item.title}
                            style={{ width: 80 }}>
                            <span style={{ fontSize: 36 }}>{item?.num}</span>
                          </Card>
                        </div>
                      )
                    })}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col fixed style={{ width: '25%' }}>
            <Card
              title="里程碑"
              bordered={false}
              style={{ height: 400, position: 'relative' }}>
              <div className={styles.milestoneInfoList}>
                {projectList.length === 0 ? (
                  <Empty style={{ marginTop: 20 }} />
                ) : (
                  <ul>
                    <li className={styles.milInfoLiHead}>
                      <div className={styles.itemName}>里程碑名称</div>
                      <div className={styles.itemTime}>结束时间</div>
                      <div className={styles.itemProg}>显示进度</div>
                    </li>
                    {milepost?.length === 0 &&
                    milesWorkVoListOne?.length === 0 ? (
                      <Empty style={{ marginTop: 20 }} />
                    ) : active === 0 ? (
                      milesWorkVoListOne?.map((item) => {
                        return (
                          <li
                            key={item?.milestonesId}
                            onClick={() =>
                              goMilestones(
                                projectListOne?.projectUrl,
                                item?.milestonesId
                              )
                            }>
                            <span style={{ flex: 3 }}>
                              {item?.milestonesTitle}
                            </span>
                            <span style={{ flex: 3, fontSize: '12px' }}>
                              {item?.dueTime &&
                                dayjs(item?.dueTime).format('YYYY-MM-DD')}
                            </span>
                            <span style={{ flex: 2 }}>{item?.rate}</span>
                          </li>
                        )
                      })
                    ) : (
                      milepost?.map((item) => {
                        return (
                          <li
                            key={item?.milestonesId}
                            onClick={() =>
                              goMilestones(
                                projectData?.projectUrl,
                                item?.milestonesId
                              )
                            }>
                            <div className={styles.itemName}>
                              {item?.milestonesTitle}
                            </div>
                            <div className={styles.itemTime}>
                              {item?.dueTime &&
                                dayjs(item?.dueTime).format('YYYY-MM-DD')}
                            </div>
                            <div className={styles.itemProg}>{item?.rate}</div>
                            {/* <span style={{ flex: 3 }}>
                              {item?.milestonesTitle}
                            </span>
                            <span style={{ flex: 3, fontSize: '12px' }}>
                              {item?.dueTime &&
                                dayjs(item?.dueTime).format('YYYY-MM-DD')}
                            </span>
                            <span style={{ flex: 2 }}>{item?.rate}</span> */}
                          </li>
                        )
                      })
                    )}
                  </ul>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 20 }}></div>
      <SlelectLabel />
      <div style={{ marginTop: 20 }}></div>
      {naid === 'true' ? <TableManage /> : ''}
      <div style={{ marginTop: 20 }}></div>
      <TodoList />
    </Container>
  )
}

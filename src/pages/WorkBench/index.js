import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TableManage from './TableManage'
import { Row, Col, Card, Progress, Menu, Button, Notify, Empty } from 'uiw'
import styles from './index.module.less'
import SlelectLabel from './SlelectLabel'
import TodoList from './TodoList'
import { Container } from '@/components'
import dayjs from 'dayjs'

export default function Demo() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    workbench: { projectList },
  } = useSelector((state) => state)
  const [projectData, setProject] = useState({})
  const [totalData, setTotalData] = useState({})
  const [milepost, setMilepost] = useState([])

  useEffect(() => {
    dispatch({
      type: 'workbench/myProject',
    })
  }, [dispatch])

  function randomColor() {
    return (
      '#' +
      ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
    )
  }

  // 跳转里程碑详情
  const goMilestones = (projectId, milestonesId) => {
    navigate(`/milestone/milestoneInfo/${projectId}/${milestonesId}`, {
      state: { projectId, milestonesId },
    })
  }

  return (
    <Container>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '25%' }}>
            <Card title="近期参与的项目" bordered={false}>
              <Col
                fixed
                style={{ height: 330, overflowX: 'hidden', overflowY: 'auto' }}>
                <Menu>
                  {projectList.map((e, key) => {
                    return (
                      <Menu.Item
                        icon={e.icon}
                        text={e.projectName}
                        key={e.projectId}
                        onClick={() => {
                          const totalData = e.totalWorkVo
                          // const milesWorkVoList = e.milesWorkVoList?.at(0)
                          setProject({ ...e })
                          setTotalData({ ...totalData })
                          setMilepost(e.milesWorkVoList)
                        }}
                      />
                    )
                  })}
                </Menu>
              </Col>
            </Card>
          </Col>
          <Col fixed style={{ width: '50%' }}>
            <Card
              title={projectData?.projectName}
              bordered={false}
              style={{ height: 400 }}>
              <Row>
                <Col
                  style={{
                    borderRight: '1px solid #EBF2FB',
                    textAlign: 'center',
                  }}>
                  <Progress.Circle
                    width={100}
                    strokeWidth={10}
                    percent={totalData?.projectNum}
                    format={(percent) => (
                      <span>
                        {`${percent}`}
                        <div style={{ padding: '10px 0 0 0', fontSize: 12 }}>
                          总任务
                        </div>
                      </span>
                    )}
                  />
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        window.location.href = `#/project/task/${projectData.projectId}`
                      }}>
                      查看全部
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        if (projectData?.projectId === undefined) {
                          return Notify.warning({
                            title: '警告通知',
                            description: '请先点击项目名称',
                          })
                        } else {
                          window.location.href = `#/projectOverview/${projectData?.projectId}`
                        }
                      }}>
                      项目概览
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div>
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
                          num: totalData?.projectWksNum
                            ? totalData?.projectWksNum
                            : 0,
                          key: 1,
                        },
                        {
                          title: '开发中',
                          num: totalData?.projectKfzNum
                            ? totalData?.projectKfzNum
                            : 0,
                          key: 2,
                        },
                        {
                          title: '已完成',
                          num: totalData?.projectYwcNum
                            ? totalData?.projectYwcNum
                            : 0,
                          key: 3,
                        },
                        {
                          title: '已逾期',
                          num: totalData?.projectYqsNum
                            ? totalData?.projectYqsNum
                            : 0,
                          key: 5,
                        },
                      ].map((item) => {
                        return (
                          <div style={{}}>
                            <Card
                              bordered={false}
                              key={item.key}
                              title={item.title}
                              style={{ width: 80 }}>
                              <span
                                style={{ fontSize: 36, color: randomColor() }}>
                                {item.num}
                              </span>
                            </Card>
                          </div>
                        )
                      })}
                    </div>
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
                <ul>
                  <li className={styles.milInfoLiHead}>
                    <span style={{ flex: 4 }}>里程碑名称</span>
                    <span style={{ flex: 3 }}>结束时间</span>
                    <span style={{ flex: 2 }}>进度</span>
                  </li>
                  {milepost.length ? (
                    milepost?.map((item) => {
                      return (
                        <li
                          key={item?.milestonesId}
                          onClick={() =>
                            goMilestones(
                              projectData?.projectId,
                              item?.milestonesId
                            )
                          }>
                          <span style={{ flex: 4 }}>
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
                    <Empty />
                  )}
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 20 }}></div>
      <SlelectLabel />
      <div style={{ marginTop: 20 }}></div>
      <TableManage />
      <div style={{ marginTop: 20 }}></div>
      <TodoList />
    </Container>
  )
}

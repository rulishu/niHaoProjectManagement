import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Progress,
  Menu,
  Button,
  Descriptions,
  Notify,
} from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TableManage from './TableManage'
import SlelectLabel from './SlelectLabel'
import TodoList from './TodoList'
import { Container } from '@/components'
export default function Demo() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    workbench: { projectList },
  } = useSelector((state) => state)
  const [projectData, setProject] = useState({})
  const [totalData, setTotalData] = useState({})
  const [milepost, setMilepost] = useState('')

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
                          const milesWorkVoList = e.milesWorkVoList?.at(0)
                          setProject({ ...e })
                          setTotalData({ ...totalData })
                          setMilepost({ ...milesWorkVoList })
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
                        localStorage.setItem(
                          'projectId',
                          JSON.stringify(projectData?.projectId || '')
                        )
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
            <Card title="里程碑" bordered={false} style={{ height: 400 }}>
              <div>
                <Descriptions layout="vertical">
                  <Descriptions.Item label="里程碑名称">
                    <span
                      onClick={() => {
                        navigate(
                          `/milestone/milestoneInfo/${projectData.projectId}/${milepost.milestonesId}`,
                          {
                            state: {
                              projectId: projectData.projectId,
                              milestonesId: milepost.milestonesId,
                            },
                          }
                        )
                      }}>
                      {milepost?.milestonesTitle}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="结束时间">
                    {milepost?.dueTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="结束进度">
                    {milepost?.rate}
                  </Descriptions.Item>
                </Descriptions>
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

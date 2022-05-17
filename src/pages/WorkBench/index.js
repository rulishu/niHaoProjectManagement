import { useEffect, useState } from 'react'
import { Row, Col, Card, Progress, Steps, Menu, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import TableManage from './TableManage'
import styles from './index.less'
import SlelectLabel from './SlelectLabel'
import TodoList from './TodoList'

export default function Demo() {
  const dispatch = useDispatch()
  const {
    home: { taskId },
  } = useSelector((state) => state)
  const [projectData, setProject] = useState({})
  useEffect(() => {
    dispatch({
      type: 'workbench/myProject',
      payload: { record: taskId },
    })
    dispatch({
      type: 'home/queryProject',
      payload: { record: taskId },
    })
    dispatch({
      type: 'home/selectOperatingRecord',
      payload: taskId,
    })
  }, [taskId, dispatch])

  function randomColor() {
    return (
      '#' +
      ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
    )
  }
  const dataProject = [
    {
      companyId: 0,
      createTime: '2022-05-17T08:18:16.691Z',
      id: 0,
      milesWorkVoList: [
        {
          dueTime: '2022-05-17T08:18:16.691Z',
          milestonesId: 0,
          milestonesTitle: 'string',
          rate: 'string',
        },
      ],
      projectId: 0,
      projectName: 'string',
      totalWorkVo: {
        projectKfzNum: 0,
        projectNum: 0,
        projectWksNum: 0,
        projectYqsNum: 0,
        projectYwcNum: 0,
      },
      userId: 0,
    },
  ]
  console.log('dataProject', dataProject)
  const dataRows = [
    {
      icon: 'uiw',
      menusList: 'Uiw',
      numAll: 10,
      notStart: 1,
      inDevelopment: 2,
      overProject: 3,
      closer: 4,
      expired: 5,
      online: 6,
    },
    {
      icon: 'folder-add',
      menusList: '每车U货',
      numAll: 20,
      notStart: 11,
      inDevelopment: 12,
      overProject: 13,
      closer: 14,
      expired: 15,
      online: 16,
    },
    {
      icon: 'linux',
      menusList: '尼好企业分销',
      numAll: 30,
      notStart: 21,
      inDevelopment: 22,
      overProject: 23,
      closer: 24,
      expired: 25,
      online: 26,
    },
    {
      icon: 'apple',
      menusList: '尼好数据库运营管理平台',
      numAll: 40,
      notStart: 31,
      inDevelopment: 32,
      overProject: 33,
      closer: 34,
      expired: 35,
      online: 36,
    },
    {
      icon: 'twitter',
      menusList: '帝江OA',
      numAll: 50,
      notStart: 41,
      inDevelopment: 42,
      overProject: 43,
      closer: 44,
      expired: 45,
      online: 46,
    },
    {
      icon: 'baidu',
      menusList: '尼好程序开发测试项目管理软件',
      numAll: 60,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
    {
      icon: 'baidu',
      menusList: '程序开发测试项目管理软件',
      numAll: 70,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
    {
      icon: 'baidu',
      menusList: '尼好测试项目管理软件',
      numAll: 80,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
    {
      icon: 'baidu',
      menusList: '尼好项目管理软件',
      numAll: 30,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
    {
      icon: 'baidu',
      menusList: '尼好程序开发软件',
      numAll: 90,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
    {
      icon: 'baidu',
      menusList: '尼好开发测试管理软件',
      numAll: 10,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
  ]
  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: 300 }}>
            <Card title="项目统计" bordered={false}>
              <Col
                fixed
                style={{ height: 330, overflowX: 'hidden', overflowY: 'auto' }}>
                <Menu>
                  {dataRows.map((e, key) => {
                    return (
                      <Menu.Item
                        icon={e.icon}
                        text={e.menusList}
                        key={key}
                        onClick={() => {
                          setProject({ ...e })
                        }}
                      />
                    )
                  })}
                </Menu>
              </Col>
            </Card>
          </Col>
          <Col>
            <Card
              title={'我的项目 / ' + projectData?.menusList}
              bordered={false}
              style={{ height: 400 }}>
              <Row className={styles.colContent}>
                <Col
                  style={{
                    borderRight: '1px solid #EBF2FB',
                    textAlign: 'center',
                  }}>
                  <Progress.Circle
                    width={100}
                    strokeWidth={10}
                    percent={projectData?.numAll}
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
                        window.location.href = '#/project/task'
                      }}>
                      查看全部
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
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                      }}>
                      {[
                        { title: '未开始', num: projectData?.notStart, key: 1 },
                        {
                          title: '开发中',
                          num: projectData?.inDevelopment,
                          key: 2,
                        },
                        {
                          title: '已完成',
                          num: projectData?.overProject,
                          key: 3,
                        },
                        { title: '已关闭', num: projectData?.closer, key: 4 },
                        { title: '已逾期', num: projectData?.expired, key: 5 },
                        { title: '已上线', num: projectData?.online, key: 6 },
                      ].map((item) => {
                        return (
                          <Card
                            onClick={() => console.log('123')}
                            key={item.key}
                            title={item.title}
                            style={{ width: 80 }}>
                            <span
                              style={{ fontSize: 36, color: randomColor() }}>
                              {item.num}
                            </span>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col fixed style={{ width: 405 }}>
            <Card title="里程碑" bordered={false} style={{ height: 400 }}>
              <div className={styles.newDynamic}>
                <Steps
                  direction="vertical"
                  progressDot
                  status="error"
                  current={2}
                  style={{ padding: '20px 0' }}>
                  <Steps.Step
                    title="步骤一"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                  <Steps.Step
                    title="步骤二"
                    description="这里是步骤一的说明，可以很长很长哦。"
                  />
                </Steps>
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
    </div>
  )
}

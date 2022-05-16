import { useEffect } from 'react'
import { Row, Col, Card, Tag, Progress, Tabs, Steps, Menu, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
// import LineChart from './LineChart'
import styles from './index.less'
import SlelectLabel from './SlelectLabel'

export default function Home() {
  const dispatch = useDispatch()
  const {
    home: { taskId },
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch({
      type: 'home/queryProject',
      payload: { record: taskId },
    })
    dispatch({
      type: 'home/selectOperatingRecord',
      payload: taskId,
    })
  }, [taskId, dispatch])

  // const list = [
  //   { id: 0, num: 7, title: '今日任务' },
  //   { id: 1, num: 28, title: '本周任务' },
  //   { id: 2, num: 33, title: '本月任务' },
  //   { id: 3, num: 105, title: '我的bug', postponed: 35 },
  // ]
  function randomColor() {
    return (
      '#' +
      ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
    )
  }
  return (
    <div>
      <div>
        <Row gutter={20}>
          <Card title="项目统计" bordered={false}>
            <Col fixed>
              <Menu>
                <Menu.Item icon="file-add" text="Uiw" />
                <Menu.Item icon="folder-add" text="每车U货" />
                <Menu.Item icon="copy" text="尼好企业分销" />
                <Menu.Item icon="copy" text="尼好数据库运营管理平台" />
                <Menu.Item icon="copy" text="帝江OA" />
                <Menu.Item icon="copy" text="尼好程序开发测试项目管理软件" />
              </Menu>
            </Col>
          </Card>
          <Col>
            <Card title="我的项目" bordered={false} style={{ height: 400 }}>
              <Row className={styles.colContent}>
                <Col
                  style={{
                    borderRight: '1px solid #EBF2FB',
                    textAlign: 'center',
                  }}>
                  <Progress.Circle
                    width={100}
                    strokeWidth={10}
                    percent={75}
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
                        console.log('123')
                      }}>
                      查看详情
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
                        { title: '未开始', num: '10', key: 1 },
                        { title: '开发中', num: '20', key: 2 },
                        { title: '已完成', num: '30', key: 3 },
                        { title: '已关闭', num: '40', key: 1 },
                        { title: '已逾期', num: '50', key: 2 },
                        { title: '已上线', num: '60', key: 3 },
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
          <Col>
            <Row>
              <Col>
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
            </Card></Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 20 }}></div>
      <SlelectLabel />
    </div>
  )
}

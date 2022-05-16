import { useEffect } from 'react'
import { Row, Col, Card, Tag, Progress, Tabs, Steps } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import LineChart from './LineChart'
import styles from './index.less'

export default function Home() {
  const dispatch = useDispatch()
  const {
    home: { itemInfo, listDynamic, taskId },
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

  const list = [
    { id: 0, num: 7, title: '今日任务' },
    { id: 1, num: 28, title: '本周任务' },
    { id: 2, num: 33, title: '本月任务' },
    { id: 3, num: 105, title: '我的bug', postponed: 35 },
  ]

  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col>
            <Card title="我的项目" bordered={false} style={{ height: 400 }}>
              <Row className={styles.colContent}>
                <Col
                  fixed
                  style={{ width: 200, borderRight: '1px solid #EBF2FB' }}>
                  <Progress.Circle
                    width={130}
                    strokeWidth={10}
                    percent={75}
                    format={(percent) => (
                      <span>
                        {`${percent} %`}
                        <div style={{ padding: '10px 0 0 0', fontSize: 12 }}>
                          已完成
                        </div>
                      </span>
                    )}
                  />
                  <Row gutter={10} className={styles.colDes}>
                    <Col span="10"> 项目编号：</Col>
                    <Col span="12"> {itemInfo?.id} </Col>
                    <Col span="10"> 项目名称</Col>
                    <Col span="12">
                      <span title={itemInfo?.name}>{itemInfo?.name}</span>
                    </Col>
                    <Col span="10"> 项目状态：</Col>
                    <Col span="12">
                      {itemInfo?.status === 1 ? (
                        <Tag light color="#008EF0">
                          进行中
                        </Tag>
                      ) : itemInfo?.status === 2 ? (
                        <Tag light color="#008EF0">
                          已挂起
                        </Tag>
                      ) : itemInfo?.status === 3 ? (
                        <Tag light color="#008EF0">
                          已关闭
                        </Tag>
                      ) : (
                        <Tag light color="#008EF0">
                          未开始
                        </Tag>
                      )}
                    </Col>
                    <Col span="10"> 项目简介：</Col>
                    <Col span="12">
                      {' '}
                      <span title={itemInfo?.descr}>
                        {itemInfo?.descr}
                      </span>{' '}
                    </Col>
                  </Row>
                </Col>
                <Col grow={2} align="middle">
                  <div className={styles.muted}>
                    昨日完成任务数 0
                    <Progress.Line
                      strokeWidth={10}
                      percent={0}
                      showText={false}
                    />
                  </div>
                  <div className={styles.muted}>
                    已发布需求数 0
                    <Progress.Line
                      strokeWidth={10}
                      percent={10}
                      showText={false}
                    />
                  </div>
                  <div className={styles.muted}>
                    昨天解决Bug数 0
                    <Progress.Line
                      strokeWidth={10}
                      percent={50}
                      showText={false}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col>
            <Card title="最新动态" bordered={false} style={{ height: 400 }}>
              <div className={styles.newDynamic}>
                <Steps
                  direction="vertical"
                  progressDot
                  status="error"
                  current={listDynamic?.length}
                  style={{ padding: '30px 20px' }}>
                  {listDynamic?.map((item, index) => (
                    <Steps.Step key={index} title={item} />
                  ))}
                </Steps>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Card title="个人工作总计" bordered={false} style={{marginTop:20}}>
        <Row gutter={20} style={{ marginTop: '20px', textAlign: 'center' }}>
          {list?.map((item, index) => {
            return (
              <Col key={index}>
                <Card style={{ height: '140px' }}>
                  <div>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.number}>{item.num}</div>
                    {item?.postponed > 0 ? (
                      <Tag color="#F95C2B">已延期 {item?.postponed}</Tag>
                    ) : null}
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Card>
      <Card title="统计总览" bordered={false} style={{marginTop:20}}>
        <Tabs
          type="line"
          activeKey="1"
          onTabClick={(tab, key, e) => {
            console.log('=>', key, tab)
          }}>
          <Tabs.Pane label="需求累计新增" key="1">
            <LineChart />
          </Tabs.Pane>
          <Tabs.Pane label="任务累计新增" key="2">
            <LineChart />
          </Tabs.Pane>
          <Tabs.Pane sequence="fadeIn up" label="bug累计新增" key="3">
            <LineChart />
          </Tabs.Pane>
        </Tabs>
      </Card>
    </div>
  )
}
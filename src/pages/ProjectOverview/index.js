import { useEffect } from 'react'
import { Row, Col, Card, Tag, Progress, Tabs, Steps, Menu, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
// import LineChart from './LineChart'
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
                  fixed
                  style={{
                    width: 500,
                    borderRight: '1px solid #EBF2FB',
                    textAlign: 'center',
                  }}>
                  <Progress.Circle
                    width={130}
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
                  <div style={{ marginTop: 10 }}>
                    <Row>
                      <Col span="10"> 项目编号: </Col>
                      <Col span="10"> {itemInfo?.id} </Col>
                    </Row>
                    <Row>
                      <Col span="10"> 项目名称: </Col>
                      <Col span="10" title={itemInfo?.name}>
                        {itemInfo?.name}{' '}
                      </Col>
                    </Row>
                    <Row>
                      <Col span="10"> 项目状态: </Col>
                      <Col>
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
                        )}{' '}
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                      }}>
                      {[
                        { title: '未开始', num: '10',key:1 },
                        { title: '开发中', num: '20',key:2 },
                        { title: '已完成', num: '30',key:3 },
                      ].map((item) => {
                        return (
                          <Card
                            key={item.key}
                            title={item.title}
                            extra={<a href="www.baidu.com">详情</a>}
                            style={{ width: 150 }}>
                            <span style={{fontSize:48,color:randomColor() }}>
                            {item.num}
                            </span>
                          </Card>
                        )
                      })}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        marginTop: 10,
                      }}>
                         {[
                        { title: '已关闭', num: '40',key:1 },
                        { title: '已逾期', num: '50',key:2 },
                        { title: '已上线', num: '60',key:3 },
                      ].map((item) => {
                        return (
                          <Card
                            key={item.key}
                            title={item.title}
                            extra={<a href="www.baidu.com">详情</a>}
                            style={{ width: 150 }}>
                            <span style={{fontSize:48,color:randomColor() }}>
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
            <Card title="最新动态" bordered={false} style={{ height: 400 }}>
              <div className={styles.newDynamic}>
              <Steps direction="vertical" progressDot status="error" current={2} style={{ padding: '20px 0' }}>
          <Steps.Step title="步骤一" description="这里是步骤一的说明，可以很长很长哦。" />
          <Steps.Step title="步骤二" description="这里是步骤一的说明，可以很长很长哦。" />
          <Steps.Step title="步骤三" description="这里是步骤一的说明，可以很长很长哦。" />
          <Steps.Step title="步骤四" description="这里是步骤一的说明，可以很长很长哦。" />
        </Steps>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      {/* <Card title="个人工作总计" bordered={false} style={{ marginTop: 20 }}>
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
      </Card> */}
      {/* <Card title="统计总览" bordered={false} style={{ marginTop: 20 }}>
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
      </Card> */}
    </div>
  )
}

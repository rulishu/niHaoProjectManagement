import { useEffect } from 'react'
import { Row, Col, Card, Progress, Table, Button, Icon, List } from 'uiw'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import AllTasks from './AllTasks'
import styles from './index.less'
import SlelectLabel from './SlelectLabel'
import useLocationPage from '@/hooks/useLocationPage'

export default function Home() {
  const dispatch = useDispatch()
  useLocationPage()
  const { projectId } = useParams()

  const {
    projectoverview: { allDataSource },
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch({
      type: 'projectoverview/getProjectOverview', //任务
      payload: {
        projectId: projectId,
      },
    })
    dispatch({
      type: 'projectoverview/getProjectDynamics', //动态
      payload: {
        projectId: projectId,
      },
    })
    dispatch({
      type: 'projectoverview/getProjectMembers', //成员
      payload: {
        projectId: projectId,
      },
    })
    dispatch({
      type: 'projectoverview/getProjectCountById', //统计
      payload: {
        projectId: projectId,
      },
    })
  }, [dispatch, projectId])

  function randomColor() {
    return (
      '#' +
      ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6)
    )
  }

  const columns = [
    {
      title: '标题',
      key: 'milestonesTitle',
    },
    {
      title: '结束时间',
      key: 'dueTime',
    },
    {
      title: '进度',
      key: 'rate',
    },
  ]

  return (
    <div>
      <div>
        <Row gutter={20}>
          <Col fixed style={{ width: '25%' }}>
            <Card
              title={allDataSource?.projectName}
              bordered={false}
              extra={
                <Button icon="setting-o" basic>
                  修改项目资料
                </Button>
              }>
              <Col
                fixed
                style={{ height: 330, overflowX: 'hidden', overflowY: 'auto' }}>
                {/* {dataRows.map((e,key)=>{
                  return <Menu.Item icon={e.icon} text={e.menusList} key={key}/>
                })} */}
                <List bordered={false} noHover={true}>
                  <List.Item>项目描述: {allDataSource.projectDesc}</List.Item>
                  <List.Item>项目成员: 王某</List.Item>
                  <List.Item>项目技术: TypeScript</List.Item>
                </List>
              </Col>
            </Card>
          </Col>
          <Col fixed style={{ width: '50%' }}>
            <Card
              title={'我的项目 / ' + (allDataSource?.projectName || '')}
              bordered={false}
              style={{ height: 400, width: '100%' }}>
              <Row className={styles.colContent}>
                <Col
                  style={{
                    borderRight: '1px solid #EBF2FB',
                    textAlign: 'center',
                  }}>
                  <Progress.Circle
                    width={100}
                    strokeWidth={10}
                    percent={allDataSource?.totalWorkVo?.projectNum}
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
                      查看全部<Icon type="right" size={12}></Icon>
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
                        {
                          title: '未开始',
                          num: allDataSource?.totalWorkVo?.projectWksNum || 0,
                          key: 1,
                        },
                        {
                          title: '开发中',
                          num: allDataSource?.totalWorkVo?.projectKfzNum || 0,
                          key: 2,
                        },
                        {
                          title: '已完成',
                          num: allDataSource?.totalWorkVo?.projectYwcNum || 0,
                          key: 3,
                        },
                        {
                          title: '已关闭',
                          num: allDataSource?.totalWorkVo?.projectYwcNum || 0,
                          key: 4,
                        },
                        {
                          title: '已逾期',
                          num: allDataSource?.totalWorkVo?.projectYqsNum || 0,
                          key: 5,
                        },
                      ].map((item) => {
                        return (
                          <Card
                            bordered={false}
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
          <Col fixed style={{ width: '25%' }}>
            <Card
              title="里程碑"
              bordered={false}
              style={{ height: 400, width: '%' }}>
              <div className={styles.newDynamic}>
                <Table
                  columns={columns}
                  data={allDataSource?.milesWorkVoList}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 20 }}></div>
      <SlelectLabel />
      <div style={{ marginTop: 20 }}></div>
      <AllTasks />
    </div>
  )
}

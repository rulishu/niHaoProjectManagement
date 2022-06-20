import { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import { Card, Descriptions, Loader, Tabs, Divider, Button } from 'uiw'
import TabBox from './TabBox'
import styles from './index.module.less'

// 来源类型对象
const sourceTypeObj = { 10: 'GitLab', 20: 'GitHub', 30: '禅道' }
// 项目状态对象
// const projectStatusObj = { 0: '打开' }

const MigrateControlSynch = () => {
  const {
    migrate: {
      control: { dataInfo },
    },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const location = useLocation()
  const { synchId } = useParams()
  const [tabKey, setTabKey] = useState('1')

  useEffect(() => {
    const callback = async () => {
      await dispatch.migrate.getDataByIdControl(synchId)
      // await dispatch({
      //   type: 'migrate/getDataByIdControl',
      //   payload: synchId,
      // })
    }
    callback()
  }, [dispatch, synchId])

  useEffect(() => {
    setTabKey(location?.state?.tabKey || '1')
  }, [location.state.tabKey, synchId])

  const synchronousData = async (type) => {
    // 同步项目数据
    type === 1 && (await dispatch.migrate.migrateProjectDataById([dataInfo.id]))
    // 同步issues数据
    type === 2 && (await dispatch.migrate.migrateIssuesDataById([dataInfo.id]))
    // 同步标签数据
    type === 3 && (await dispatch.migrate.migrateLabelsDataById([dataInfo.id]))
    // 同步里程碑数据
    type === 4 &&
      (await dispatch.migrate.migrateMilestoneDataById([dataInfo.id]))
  }

  // 跳转连接块
  const jumpBox = (href) => {
    return (
      <a href={href} className={styles.jumpBox} target="blank">
        {href}
      </a>
    )
  }

  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <Loader
            loading={loading.effects.migrate.getDataByIdControl}
            style={{ width: '100%' }}
            tip="loading...">
            <div>
              <div className={styles.synchHead}>
                <div>
                  <h1 className={styles.title}>{dataInfo?.projectName}</h1>
                  <p className={styles.desc}>{dataInfo?.description}</p>
                </div>
                <div className={styles.synProjectData}>
                  <Button
                    type="primary"
                    icon="reload"
                    onClick={() => synchronousData(1)}>
                    同步项目数据
                  </Button>
                </div>
              </div>
              <Divider />
              <div>
                <Descriptions>
                  <Descriptions.Item label="默认分支">
                    {dataInfo?.defaultBranch}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="http_url地址">{jumpBox(dataInfo?.httpUrl)}</Descriptions.Item> */}
                  <Descriptions.Item label="web地址">
                    {jumpBox(dataInfo?.webUrl)}
                  </Descriptions.Item>
                  <Descriptions.Item label="ssh地址">
                    {dataInfo?.sshUrl}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="项目状态">
                    {projectStatusObj[dataInfo?.projectStatus]}
                  </Descriptions.Item> */}
                  <Descriptions.Item label="来源类型">
                    {sourceTypeObj[dataInfo?.sourceType]}
                  </Descriptions.Item>
                  {/* <Descriptions.Item label="迁移明细">{dataInfo?.transferDetails}</Descriptions.Item> */}
                  {/* <Descriptions.Item label="迁移状态">{dataInfo?.transferStatus}</Descriptions.Item>
                <Descriptions.Item label="issues最新迁移时间">{dataInfo?.transferTime}</Descriptions.Item> */}
                </Descriptions>
              </div>
              <Divider />
              <div>
                <h2>其它信息</h2>
                <Tabs
                  activeKey={tabKey}
                  onTabClick={(activeKey, key, e) => {
                    setTabKey(activeKey)
                  }}>
                  <Tabs.Pane label="项目任务" key="1" />
                  <Tabs.Pane label="项目标签" key="2" />
                  <Tabs.Pane label="项目成员" key="3" />
                  <Tabs.Pane label="项目里程碑" key="4" />
                </Tabs>
                <div className={styles.synchronousMilestone}>
                  {tabKey === '1' && (
                    <Button
                      type="primary"
                      icon="reload"
                      onClick={() => synchronousData(2)}>
                      同步任务数据
                    </Button>
                  )}
                  {tabKey === '2' && (
                    <Button
                      type="primary"
                      icon="reload"
                      onClick={() => synchronousData(3)}>
                      同步标签数据
                    </Button>
                  )}
                  {tabKey === '4' && (
                    <Button
                      type="primary"
                      icon="reload"
                      onClick={() => synchronousData(4)}>
                      同步里程碑数据
                    </Button>
                  )}
                </div>
                {tabKey === '1' && (
                  <div>
                    <TabBox data={dataInfo?.issues} type="issues" />
                  </div>
                )}
                {tabKey === '2' && (
                  <div>
                    <TabBox data={dataInfo?.labels} type="labels" />
                  </div>
                )}
                {tabKey === '3' && (
                  <div>
                    <TabBox data={dataInfo?.projectMember} type="member" />
                  </div>
                )}
                {tabKey === '4' && (
                  <div>
                    <TabBox
                      data={dataInfo?.projectMilestone}
                      type="milestone"
                    />
                  </div>
                )}
              </div>
            </div>
          </Loader>
        </div>
      </Card>
    </Fragment>
  )
}

export default MigrateControlSynch

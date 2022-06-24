import { Icon, Button, Avatar, Loader, Empty, Row, Col } from 'uiw'
import { useSelector } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'

// 用户首页概括
const DynamicsList = (props) => {
  const {
    userHome: { user, userDynamics, userProjectList, userTask },
    loading,
  } = useSelector((state) => state)
  const { goSpecifyPage, setActiveKey } = props

  //最新任务
  const NewTask = () => (
    <div className={`${styles.block} ${styles.dynamic}`}>
      <div className={styles.head}>
        <div className={styles.title}>最新任务</div>
        <div>
          <Button size="small" onClick={() => setActiveKey('3')} basic>
            所有任务
          </Button>
        </div>
      </div>
      {userTask?.length ? (
        <Loader
          tip="最新任务加载中..."
          vertical
          style={{ width: '100%' }}
          loading={loading.effects.userHome.getUserInfo}>
          <ul>
            {userTask?.map((item, index) => {
              if (index < 10) {
                return (
                  <li
                    className={styles.eventItem}
                    style={{ padding: '16px 0px 16px 8px' }}
                    key={index}>
                    <div className={styles.dynamicTop}>
                      <span
                        className={styles.name}
                        style={{
                          width: '80%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}>
                        {item?.assignmentTitle}
                      </span>
                      <span className={styles.time}>
                        {
                          timeDistance(item?.updateTime || item?.createTime)
                            ?.time
                        }
                        前
                      </span>
                    </div>
                    <div
                      className={styles.dynamicCon}
                      style={{ float: 'right' }}>
                      {/* <span>{item?.createTime} </span> */}
                      <span
                        style={{
                          color: '#008ef0',
                          alignContent: 'flex-end',
                        }}>
                        {item.assignmentStatus === 1 ? (
                          <span style={{ color: 'orange' }}>未开始</span>
                        ) : item.assignmentStatus === 2 ? (
                          <span style={{ color: 'blue' }}>进行中</span>
                        ) : item.assignmentStatus === 3 ? (
                          <span style={{ color: 'green' }}>已完成</span>
                        ) : item.assignmentStatus === 4 ? (
                          <span style={{ color: 'red' }}> 已逾期</span>
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                    <div
                      className={styles.dynamicBot}
                      style={{
                        width: '80%',
                        color: '#008ef0',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
                      <span
                        className={item.projectUrl && styles.clickOn}
                        onClick={() =>
                          item.projectUrl &&
                          goSpecifyPage({ path: `${item.projectUrl}` })
                        }>
                        {item?.name}
                      </span>
                      {item?.assignmentTitle && (
                        <>
                          <span> / </span>
                          <span
                            className={
                              item.projectUrl &&
                              item?.assignmentId &&
                              styles.clickOn
                            }
                            onClick={() =>
                              item.projectUrl &&
                              item?.assignmentId &&
                              goSpecifyPage({
                                path: `${item.projectUrl}/task/taskInfo/${item?.assignmentId}`,
                              })
                            }>
                            {item?.assignmentTitle}
                          </span>
                        </>
                      )}
                    </div>
                    <div
                      className={styles.dynamicCon}
                      style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
                      {'任务描述：' + (item?.description || '')}
                    </div>
                  </li>
                )
              }
              return null
            })}
          </ul>
        </Loader>
      ) : (
        <Empty style={{ padding: '30px 0' }} />
      )}
    </div>
  )

  //最新动态
  const NewDevelopments = () => (
    <div className={`${styles.block} ${styles.dynamic}`}>
      <div className={styles.head}>
        <div className={styles.title}>最新动态</div>
        <div>
          <Button size="small" onClick={() => setActiveKey('4')} basic>
            所有动态
          </Button>
        </div>
      </div>
      {userDynamics?.length ? (
        <Loader
          tip="最新动态加载中..."
          vertical
          style={{ width: '100%' }}
          loading={loading.effects.userHome.getUserInfo}>
          <ul>
            {userDynamics?.map((item, index) => {
              if (index < 10) {
                return (
                  <li
                    className={styles.eventItem}
                    style={{ padding: '16px 8px 16px 48px' }}
                    key={index}>
                    <div className={styles.avatar}>
                      <Avatar
                        src={
                          user?.avatar
                            ? `/api/file/selectFile/${user?.avatar}`
                            : ''
                        }>
                        {user?.nickName && user?.nickName[0]}
                      </Avatar>
                    </div>
                    <div className={styles.dynamicTop}>
                      <span className={styles.name}>{item?.createName}</span>
                      <span className={styles.time}>
                        {
                          timeDistance(item?.updateTime || item?.createTime)
                            ?.time
                        }
                        前
                      </span>
                    </div>
                    <div
                      className={styles.dynamicBot}
                      style={{
                        width: '100%',
                        color: '#008ef0',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
                      <span
                        className={item.projectUrl && styles.clickOn}
                        onClick={() =>
                          item.projectUrl &&
                          goSpecifyPage({ path: `${item.projectUrl}` })
                        }>
                        {item?.projectName}
                      </span>
                      {item?.assignmentTitle && (
                        <>
                          <span> / </span>
                          <span
                            className={
                              item.projectUrl &&
                              item?.assignmentId &&
                              styles.clickOn
                            }
                            onClick={() =>
                              item.projectUrl &&
                              item?.assignmentId &&
                              goSpecifyPage({
                                path: `${item.projectUrl}/task/taskInfo/${item?.assignmentId}`,
                              })
                            }>
                            <span>{item?.assignmentTitle}</span>
                          </span>
                        </>
                      )}
                    </div>
                    <div
                      className={styles.dynamicCon}
                      style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
                      {'评论：' + (item?.operatingRecords || '')}
                    </div>
                  </li>
                )
              }
              return null
            })}
          </ul>
        </Loader>
      ) : (
        <Empty style={{ padding: '30px 0' }} />
      )}
    </div>
  )

  return (
    <div className={styles.summary}>
      <div className={`${styles.block} ${styles.project}`}>
        <div className={styles.head}>
          <div className={styles.title}>最近项目</div>
          <div>
            <Button size="small" onClick={() => setActiveKey('2')} basic>
              所有项目
            </Button>
          </div>
        </div>
        {userProjectList?.length ? (
          <Loader
            tip="最新项目加载中..."
            vertical
            style={{ width: '100%' }}
            loading={loading.effects.userHome.getUserInfo}>
            <ul>
              {userProjectList?.map((item, index) => {
                if (index < 4) {
                  return (
                    <li key={item.id}>
                      <div className={styles.projectItem}>
                        <div className={styles.title}>
                          <h2
                            onClick={() => {
                              goSpecifyPage({
                                path: item.projectUrl,
                              })
                            }}>
                            {item?.name}
                          </h2>
                          {item?.userRole && (
                            <span className={styles.role}>
                              {item?.userRole}
                            </span>
                          )}
                        </div>
                        {}
                        <p className={styles.text}>{item?.descr || <i></i>}</p>
                        <p>
                          <span
                            onClick={() => {
                              goSpecifyPage({
                                path: `${item.projectUrl}/task`,
                              })
                            }}>
                            <Icon type="tags-o" />
                            {item?.task}
                          </span>
                          <span
                            onClick={() => {
                              goSpecifyPage({
                                path: `${item.projectUrl}/usersManagement`,
                              })
                            }}>
                            <Icon type="user" />
                            {item?.teamMember}
                          </span>
                        </p>
                      </div>
                    </li>
                  )
                }
                return null
              })}
            </ul>
          </Loader>
        ) : (
          <Empty style={{ padding: '30px 0' }} />
        )}
      </div>
      <Row>
        <Col>{NewTask()}</Col>
        <Col>{NewDevelopments()}</Col>
      </Row>
    </div>
  )
}

export default DynamicsList

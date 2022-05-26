import { Icon, Button, Avatar, Loader, Empty } from 'uiw'
import { useSelector } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'

// 用户首页概括
const DynamicsList = (props) => {
  const {
    userHome: { user, userDynamics, userProjectList },
    loading,
  } = useSelector((state) => state)
  const { goSpecifyPage, setActiveKey } = props
  const goPage = (projectId, assignmentId) => {
    const path = assignmentId
      ? `/project/taskInfo/${projectId}`
      : `/projectOverview`
    const id = assignmentId || projectId
    goSpecifyPage({ path, id })
  }

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
        {userProjectList.length ? (
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
                                path: '/projectOverview',
                                id: item.id,
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
                        <p className={styles.text}>{item?.descr || <i></i>}</p>
                        <p>
                          <span
                            onClick={() => {
                              goSpecifyPage({
                                path: '/project/task',
                                id: item.id,
                              })
                            }}>
                            <Icon type="tags-o" />
                            {item?.task}
                          </span>
                          <span
                            onClick={() => {
                              goSpecifyPage({
                                path: '/usersManagement',
                                id: item.id,
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
          <Empty />
        )}
      </div>
      <div className={`${styles.block} ${styles.dynamic}`}>
        <div className={styles.head}>
          <div className={styles.title}>最新动态</div>
          <div>
            <Button size="small" onClick={() => setActiveKey('3')} basic>
              所有动态
            </Button>
          </div>
        </div>
        {userDynamics.length ? (
          <Loader
            tip="最新动态加载中..."
            vertical
            style={{ width: '100%' }}
            loading={loading.effects.userHome.getUserInfo}>
            <ul>
              {userDynamics?.map((item, index) => {
                if (index < 10) {
                  return (
                    <li className={styles.eventItem} key={index}>
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
                        <span>
                          {
                            timeDistance(item?.updateTime || item?.createTime)
                              ?.time
                          }
                          前
                        </span>
                      </div>
                      <div className={styles.dynamicCon}>
                        {item?.operatingRecords}
                      </div>
                      <div className={styles.dynamicBot}>
                        <span onClick={() => goPage(item.projectId)}>
                          {item?.projectName}
                        </span>
                        {item?.assignmentTitle && (
                          <span
                            onClick={() =>
                              goPage(item?.projectId, item?.assignmentId)
                            }>
                            {'/' + item?.assignmentTitle}
                          </span>
                        )}
                      </div>
                    </li>
                  )
                }
                return null
              })}
            </ul>
          </Loader>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}

export default DynamicsList

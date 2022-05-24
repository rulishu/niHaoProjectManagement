import { Empty, Avatar, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'

const ProjectList = (props) => {
  const {
    userHome: { user, userDynamics },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  console.log(dispatch)
  const { goSpecifyPage } = props
  const goPage = (projectId, assignmentId) => {
    const path = assignmentId
      ? `/project/taskInfo/${projectId}`
      : `/projectOverview}`
    const id = assignmentId || projectId
    goSpecifyPage({ path, id })
  }

  return (
    <div className={styles.userAllDynamicList}>
      <Loader
        tip="所有动态加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.userHome.getUserInfo}>
        <ul>
          {userDynamics.length ? (
            userDynamics.map((item, index) => {
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
                      {timeDistance(item?.updateTime || item?.createTime)?.time}
                      前
                    </span>
                  </div>
                  <div className={styles.dynamicCon}>
                    {item?.operatingRecords}
                  </div>
                  <div
                    className={styles.dynamicBot}
                    onClick={() => goPage(item.projectId, item.assignmentId)}>
                    {item?.projectName}
                    {item.assignmentTitle && '/' + item.assignmentTitle}
                  </div>
                </li>
              )
            })
          ) : (
            <Empty />
          )}
        </ul>
      </Loader>
    </div>
  )
}

export default ProjectList

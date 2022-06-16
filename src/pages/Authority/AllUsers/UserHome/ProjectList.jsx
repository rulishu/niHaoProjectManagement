import { Empty, Icon, Button, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import { ProjectManagement } from '@/components'
import styles from './index.module.less'

const ProjectList = (props) => {
  const {
    userHome: { userProjectList, user },
    routeManagement: { userInfoName },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { goSpecifyPage } = props

  return (
    <div className={styles.userAllProjectList}>
      {userInfoName === user?.userName ? (
        // userInfoName === 'admin' ?  (
        <div className={styles.projectListHead}>
          <div></div>
          <Button
            type="success"
            size="small"
            onClick={() => {
              dispatch({
                type: 'projectUpdate/updataProject',
                payload: { drawerType: 'add' },
              })
            }}>
            创建项目
          </Button>
        </div>
      ) : // ):null
      null}
      <Loader
        tip="所有项目加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.userHome.getUserInfo}>
        <ul>
          {userProjectList?.length ? (
            userProjectList.map((item) => {
              return (
                <li key={item.id}>
                  <div className={styles.projectLiLeft}>
                    <div className={styles.title}>
                      <h2
                        onClick={() =>
                          goSpecifyPage({ path: item.projectUrl })
                        }>
                        {item?.name}
                      </h2>
                      {item?.userRole && (
                        <span className={styles.role}>{item?.userRole}</span>
                      )}
                    </div>
                    <div className={styles.text}>{item?.descr || <i></i>}</div>
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
                      <span className={styles.updateTime}>
                        更新于{timeDistance(item?.updateTime).time}前
                      </span>
                    </p>
                  </div>
                </li>
              )
            })
          ) : (
            <Empty style={{ padding: '30px 0' }} />
          )}
        </ul>
      </Loader>
      <ProjectManagement />
    </div>
  )
}

export default ProjectList

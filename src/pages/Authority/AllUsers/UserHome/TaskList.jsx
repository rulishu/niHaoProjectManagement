import { Empty, Icon, Button, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { ProjectManagement } from '@/components'
import styles from './index.module.less'

const ProjectList = (props) => {
  const {
    userHome: { userTask },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { goSpecifyPage } = props

  return (
    <div className={styles.userAllProjectList}>
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
          创建任务
        </Button>
      </div>
      <Loader
        tip="所有项目加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.userHome.getUserInfo}>
        <ul>
          {userTask.length ? (
            userTask.map((item, index) => {
              return (
                <li key={index}>
                  <div className={styles.projectLiLeft}>
                    <div className={styles.title}>
                      <strong
                        style={{
                          width: '90%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                        onClick={() =>
                          goSpecifyPage({ path: item.projectUrl })
                        }>
                        {item?.assignmentTitle}
                      </strong>
                    </div>
                    <div className={styles.text}>{item?.descr || <i></i>}</div>
                    <div className={styles.listContent}>
                      # {item.assignmentId} · {item.createName}
                      {' 创建于 '}
                      {userTask?.createTime
                        ? item[userTask.createTime]
                        : item?.createTime}{' '}
                      <span
                        style={{ marginLeft: 10, marginRight: 10 }}
                        onClick={() => {
                          goSpecifyPage({
                            path: `${item.projectUrl}/task`,
                          })
                        }}>
                        <Icon type="tags-o" />
                        {item?.name}
                      </span>
                      <span
                        onClick={() => {
                          goSpecifyPage({
                            path: `${item.projectUrl}/usersManagement`,
                          })
                        }}>
                        <Icon type="user" />
                        {item?.updateName}
                      </span>
                      <span className={styles.updateTime}>
                        ·更新于{item.updateTime || ''}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })
          ) : (
            <Empty />
          )}
        </ul>
      </Loader>
      <ProjectManagement />
    </div>
  )
}

export default ProjectList

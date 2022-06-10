import { Empty, Loader } from 'uiw'
import {
  useSelector,
  //  useDispatch
} from 'react-redux'
import { ProjectManagement } from '@/components'
import styles from './index.module.less'
// import { useParams } from 'react-router-dom'

const ProjectList = (props) => {
  const {
    userHome: { userTask },
    loading,
  } = useSelector((state) => state)
  // const dispatch = useDispatch()
  const { goSpecifyPage } = props
  // const params = useParams()
  // const { userAccount } = params

  return (
    <div className={styles.userAllProjectList}>
      {/* <div className={styles.projectListHead}>
        <div></div>
        {userAccount === 'admin' ? (
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
        ) : (
          ''
        )}
      </div> */}
      <Loader
        tip="所有项目加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.userHome.getUserInfo}>
        <ul>
          {userTask?.length ? (
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
                          goSpecifyPage({
                            path:
                              item.projectUrl +
                              '/task/taskInfo/' +
                              item.assignmentId,
                          })
                        }>
                        <strong style={{ color: '#008ef0' }}>
                          {' '}
                          #{item?.assignmentId}
                        </strong>{' '}
                        {item?.assignmentTitle}
                      </strong>
                      <span>
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
                    <div className={styles.text}>{item?.descr || <i></i>}</div>
                    <div className={styles.listContent}>
                      任务描述：{item.description}
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

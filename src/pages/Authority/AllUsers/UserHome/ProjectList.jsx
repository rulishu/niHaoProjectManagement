import { Empty, Icon, Button, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'

const ProjectList = (props) => {
  const {
    userHome: { userProjectList },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { goSpecifyPage } = props

  return (
    <div className={styles.userAllProjectList}>
      <div className={styles.projectListHead}>
        {/* <Input style={{ maxWidth: "700px" }} /> */}
        <div></div>
        <Button
          type="success"
          size="large"
          onClick={() => {
            dispatch({
              type: 'projectUpdate/updataProject',
              payload: { drawerType: 'add' },
            })
          }}>
          创建项目
        </Button>
      </div>
      <Loader
        tip="所有项目加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.userHome.getUserInfo}>
        <ul>
          {userProjectList.length ? (
            userProjectList.map((item) => {
              return (
                <li key={item.id}>
                  <div className={styles.projectLiLeft}>
                    <div className={styles.title}>
                      <h2
                        onClick={() =>
                          goSpecifyPage({
                            path: '/projectOverview',
                            id: item?.id,
                          })
                        }>
                        {item?.name}
                      </h2>
                      {item?.userRole && (
                        <span className={styles.role}>{item?.userRole}</span>
                      )}
                    </div>
                    <div className={styles.text}>{item?.descr || <i></i>}</div>
                    <p>
                      <span>
                        <Icon type="time-o" />
                        {item?.status}
                      </span>
                      <span>
                        <Icon type="tags-o" />
                        {item?.task}
                      </span>
                      <span>
                        <Icon type="user" />
                        {item?.teamMember}
                      </span>
                      <span>更新于{timeDistance(item?.updateTime).time}前</span>
                    </p>
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

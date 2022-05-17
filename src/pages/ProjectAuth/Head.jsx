import { Button } from 'uiw'
import { useDispatch } from 'react-redux'
import EditOrAdd from './AllAlert/editOrAdd'
import ProjectMain from './AllAlert/projectMain'
import MaintainGroup from './AllAlert/maintainGroup'

import styles from './index.module.less'

const Head = () => {
  const dispatch = useDispatch()

  return (
    <div className={styles.userHead}>
      <div className={styles.title}>浏览分组</div>
      <div className={styles.right}>
        <Button
          icon="plus"
          className="icon-btn"
          style={{ marginLeft: 20 }}
          type="primary"
          onClick={() => {
            dispatch({
              type: 'projectAuth/update',
              payload: { isView: true },
            })
          }}>
          新增分组
        </Button>
        <EditOrAdd />
        <ProjectMain />
        <MaintainGroup />
      </div>
    </div>
  )
}

export default Head

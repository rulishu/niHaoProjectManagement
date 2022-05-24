import { Icon, Button } from 'uiw'
import styles from './index.module.less'

const Summary = (props) => {
  return (
    <div className={styles.summary}>
      <div className={`${styles.block} ${styles.project}`}>
        <div className={styles.head}>
          <div className={styles.title}>最进项目</div>
          <div>
            <Button size="small" basic>
              所有的
            </Button>
          </div>
        </div>
        <ul>
          {[1, 2, 3, 4].map((_) => {
            return (
              <li>
                <div className={styles.projectItem}>
                  <div className={styles.title}>
                    这是一个神奇的项目
                    <span className={styles.role}>角色</span>
                  </div>
                  <p className={styles.text}>这里是详情是</p>
                  <p className={styles.text}>
                    <span>
                      <Icon type="time-o" />
                      状态
                    </span>
                    <span>
                      <Icon type="tags-o" />
                      任务数
                    </span>
                    <span>
                      <Icon type="user" />
                      角色数
                    </span>
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Summary

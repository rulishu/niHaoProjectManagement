import { Icon, Tooltip, Avatar } from 'uiw'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'

const TaskList = (props) => {
  const { listData = [], labelsData = [], onCLickSearch, listNavigate } = props

  // 跳转路径
  const listGoTo = (val) => {
    listNavigate(val)
  }

  const labelBox = (value = []) => {
    return labelsData.map((item) => {
      if (value?.includes(item?.id)) {
        return (
          <span
            key={item?.id}
            style={{
              borderColor: item.color,
              backgroundColor: `${item.color}40`,
              color: item.color,
            }}
            className={styles.label}
            onClick={() => {
              onCLickSearch &&
                onCLickSearch('labels', {
                  value: item.id,
                  label: item.name,
                })
            }}>
            {item.name}
          </span>
        )
      }
      return null
    })
  }

  return (
    <div className={styles.taskList}>
      <div></div>
      <div className={styles.list}>
        <ul>
          <li className={styles.liHead}>
            <div className={styles.itemState}>
              <span>
                <Icon type="circle-check-o" />
              </span>
            </div>
            <div className={styles.itemLeft}>标题</div>
            <div className={styles.itemRight}>
              <div>里程碑</div>
              <div>指派人</div>
              <div>排序</div>
            </div>
          </li>
          {listData.map((item) => {
            return (
              <li key={item.assignmentId}>
                <div className={styles.itemState}>
                  <Icon type="circle-check-o" />
                </div>
                <div className={styles.itemLeft}>
                  <div className={styles.itemLeftTop}>
                    <p onClick={() => listGoTo(item)}>{item.assignmentTitle}</p>
                    <span className={styles.labelBox}>
                      {labelBox(item?.labels)}
                    </span>
                  </div>
                  <div className={styles.itemLeftBase}>
                    <span className={styles.mark}>#{item.assignmentId}</span>
                    <span className={styles.updateTime}>
                      更新于{timeDistance(item.updateTime).time}前
                    </span>
                    由
                    <span className={styles.clickable}>{item?.updateName}</span>
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <div></div>
                  <div>
                    <Tooltip content={`指派给${item?.assigneeUserName}`}>
                      <span
                        className={styles.clickable}
                        onClick={() => {
                          console.log('nihao')
                        }}>
                        <Avatar
                          size="small"
                          src={
                            item?.assigneeUserAvatar &&
                            `/api/file/selectFile/${item?.assigneeUserAvatar}`
                          }
                          className={styles.roleAvatar}>
                          {item.assigneeUserName && item.assigneeUserName[0]}
                        </Avatar>
                      </span>
                    </Tooltip>
                  </div>
                  <div className={styles.itemComments}>
                    <span
                      className={styles.clickable}
                      onClick={() => {
                        console.log('nihao')
                      }}>
                      <Icon type="message" />
                      {item?.commentNum}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
export default TaskList

import { Icon, Tooltip, Avatar } from 'uiw'
import timeDistance from '@/utils/timeDistance'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const TaskList = (props) => {
  const navigate = useNavigate()
  const {
    listData = [],
    labelsData = [],
    onCLickSearch,
    listNavigate,
    onTabClick,
  } = props

  // 跳转路径
  const listGoTo = (val) => {
    listNavigate(val)
  }

  const goPage = (value) => {
    navigate(`/${value}`)
  }

  const onTabClicks = (tab) => {
    onTabClick(tab)
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
            <div className={styles.itemLeft}>
              <span
                className={styles.clickableDiscolor}
                style={{ fill: '#41b3498c' }}
                onClick={() => onTabClicks('1')}>
                <Icon type="minus-circle-o" />
                未开始
              </span>
              <span
                className={styles.clickableDiscolor}
                style={{ fill: '#41b3498c' }}
                onClick={() => onTabClicks('2')}>
                <Icon type="plus-circle-o" />
                进行中
              </span>
              <span
                className={styles.clickableDiscolor}
                style={{ fill: '#41b3498c' }}
                onClick={() => onTabClicks('3')}>
                <Icon type="circle-check-o" />
                已完成
              </span>
              <span
                className={styles.clickableDiscolor}
                style={{ fill: '#41b3498c' }}
                onClick={() => onTabClicks('4')}>
                <Icon type="circle-close-o" />
                已逾期
              </span>
            </div>
            <div className={styles.itemRight}>
              <div>
                <span className={styles.clickableDiscolor}>
                  里程碑
                  <Icon type="down" />
                </span>
              </div>
              <div>
                <span className={styles.clickableDiscolor}>
                  指派人
                  <Icon type="down" />
                </span>
              </div>
              <div>
                <span className={styles.clickableDiscolor}>
                  里程碑
                  <Icon type="down" />
                </span>
              </div>
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
                    <span
                      className={styles.clickable}
                      onClick={() => goPage(`${item.assigneeUserAccount}`)}>
                      {item?.updateName}
                    </span>
                    {item.milestonesId ? (
                      <span className={styles.clickable}>
                        <Icon type="pie-chart" />
                        {item?.milestonesTitle}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className={styles.itemRight}>
                  <div></div>
                  <div>
                    {item.assigneeUserId ? (
                      <Tooltip content={`指派给${item?.assigneeUserName}`}>
                        <span
                          className={styles.clickable}
                          onClick={() => goPage(`${item.assigneeUserAccount}`)}>
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
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={styles.itemComments}>
                    <span
                      className={styles.clickableDiscolor}
                      onClick={() => listGoTo(item)}>
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

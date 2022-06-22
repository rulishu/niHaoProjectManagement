import { Icon, Tooltip, Avatar } from 'uiw'
import timeDistance from '@/utils/timeDistance'
import { useNavigate } from 'react-router-dom'
import { DropdownBox } from '@/components'

import styles from './index.module.less'

const TaskList = (props) => {
  const navigate = useNavigate()
  const {
    listData = [],
    labelsData = [],
    onCLickSearch,
    listNavigate,
    onTabClick,
    onTab,
    labelsListData,
    teamMembersListData,
    milestonesListData,
  } = props

  // 任务状态
  const taskState = [
    { onTab: '1', color: '#d99156', title: '未开始', icon: 'plus-circle-o' },
    { onTab: '2', color: '#fbb957', title: '进行中', icon: 'circle-o' },
    { onTab: '3', color: '#41b349', title: '已完成', icon: 'circle-check-o' },
    { onTab: '4', color: '#813c85', title: '已逾期', icon: 'circle-close-o' },
  ]

  // 跳转路径
  const listGoTo = (val) => {
    listNavigate(val)
  }

  // 跳转页面方法
  const goPage = (value) => {
    navigate(`/${value}`)
  }

  // 修改分类
  const onTabClicks = (tab) => {
    onTabClick(tab)
  }

  // 标签板块
  const labelBox = (value = []) => {
    return labelsData?.map((item) => {
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
              <p>
                {taskState.map((item, index) => {
                  return (
                    <span
                      key={index}
                      className={`${styles.clickableDiscolor}  
                      ${onTab === item.onTab ? styles.action : ''}`}
                      style={{ color: item.color }}
                      onClick={() => onTabClicks(item.onTab)}>
                      <Icon type={item.icon} />
                      {item.title}
                    </span>
                  )
                })}
              </p>
            </div>
            <div className={styles.itemRight}>
              <DropdownBox
                listData={milestonesListData}
                title="里程碑"
                columnType="milestone"
                columnKey="milestonesId"
                searchValue={['milestonesTitle']}>
                <span className={styles.clickableDiscolor}>
                  里程碑
                  <Icon type="down" />
                </span>
              </DropdownBox>
              <DropdownBox
                listData={teamMembersListData}
                title="指派人"
                columnType="member"
                columnKey="userId"
                searchValue={['memberName', 'userAcount']}>
                <span className={styles.clickableDiscolor}>
                  指派人
                  <Icon type="down" />
                </span>
              </DropdownBox>
              <DropdownBox
                listData={labelsListData}
                title="标签"
                columnType="label"
                columnKey="id"
                searchValue={['name']}>
                <span className={styles.clickableDiscolor}>
                  标签
                  <Icon type="down" />
                </span>
              </DropdownBox>
            </div>
          </li>
          {listData.map((item) => {
            return (
              <li key={item.assignmentId}>
                <div className={styles.itemState}>
                  {
                    <Icon
                      type={taskState[item.assignmentStatus - 1].icon}
                      style={{
                        fill: taskState[item.assignmentStatus - 1].color,
                      }}
                    />
                  }
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

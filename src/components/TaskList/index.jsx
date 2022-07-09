import { Icon, Tooltip, Avatar, Empty } from 'uiw'
import timeDistance from '@/utils/timeDistance'
import { useNavigate } from 'react-router-dom'
import { Label } from '@/components'
import ListHead from './ListHead'

import styles from './index.module.less'

const TaskList = (props) => {
  const navigate = useNavigate()
  const {
    listData = [], // 数据源
    labelsData = [], // 标签数据源
    listNavigate, // 标题跳转
    labelsListData, // 标签数据源
    teamMembersListData, // 指派人数据源
    milestonesListData, // 里程碑数据源
    conditionChange, // 选项变化触发回调
    searchOptions, // 搜索事件配置
    activeKey, // 状态初始值
    taskNum,
  } = props

  // 任务状态
  const taskState = [
    { onTab: '1', color: '#a7a8bd', title: '未开始', icon: 'minus-circle-o' },
    { onTab: '2', color: '#1a7f37', title: '进行中', icon: 'circle-o' },
    { onTab: '3', color: '#8250df ', title: '已完成', icon: 'circle-check-o' },
    { onTab: '4', color: '#cf222e', title: '已逾期', icon: 'circle-close-o' },
  ]

  // 跳转路径
  const listGoTo = (val) => {
    listNavigate(val)
  }

  // 跳转页面方法
  const goPage = (value) => {
    navigate(`/${value}`)
  }

  // 标签板块
  const labelBox = (value = []) => {
    return labelsData?.map((item) => {
      if (value?.includes(item?.id)) {
        return (
          <Label
            color={item.color}
            key={item?.id}
            onClick={() => {
              conditionChange &&
                conditionChange({ labels: [item?.id] }, item?.id, 2)
            }}>
            {item.name}
          </Label>
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
            <ListHead
              taskState={taskState}
              labelsListData={labelsListData}
              teamMembersListData={teamMembersListData}
              milestonesListData={milestonesListData}
              conditionChange={conditionChange}
              searchOptions={searchOptions}
              activeKey={activeKey}
              taskNum={taskNum}
            />
          </li>
          {listData.length !== 0 ? (
            listData.map((item) => {
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
                      <p onClick={() => listGoTo(item)}>
                        {item.assignmentTitle}
                      </p>
                      <span className={styles.labelBox}>
                        {labelBox(item?.labels)}
                      </span>
                    </div>
                    <div className={styles.itemLeftBase}>
                      <span className={styles.mark}>
                        #{item.assignmentId}&ensp;
                      </span>
                      由
                      {item?.createTime === item?.updateTime ? (
                        <>
                          <span
                            className={styles.clickable}
                            // style={{ paddingLeft: 5 }}
                            onClick={() => goPage(`${item.createUserAccount}`)}>
                            {item?.createUserNickName}
                          </span>
                          <span className={styles.updateTime}>
                            创建于{timeDistance(item.createTime).time}前&ensp;
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className={styles.clickable}
                            // style={{ paddingLeft: 5 }}
                            onClick={() => goPage(`${item.updateUserName}`)}>
                            {item?.updateName}
                          </span>
                          <span className={styles.updateTime}>
                            更新于{timeDistance(item.updateTime).time}前&ensp;
                          </span>
                        </>
                      )}
                      {item.milestonesId ? (
                        <span
                          className={`${styles.clickable} ${styles.milestone}`}
                          onClick={() => {
                            conditionChange &&
                              conditionChange(
                                { milestonesId: [item?.milestonesId] },
                                item?.milestonesId,
                                2
                              )
                          }}>
                          <Icon type="coffee" />
                          {item?.milestonesTitle}
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <div></div>
                    <div className={styles.avatar}>
                      {item.assigneeUserId ? (
                        <Tooltip content={`指派给${item?.assigneeUserName}`}>
                          <span
                            className={styles.clickable}
                            onClick={() =>
                              goPage(`${item.assigneeUserAccount}`)
                            }>
                            <Avatar
                              size="small"
                              src={
                                item.assigneeUserAvatar?.substring(0, 4) ===
                                'http'
                                  ? item.assigneeUserAvatar
                                  : item.assigneeUserAvatar?.substring(0, 4) !==
                                      'http' &&
                                    item.assigneeUserAvatar !== '' &&
                                    `/api/file/selectFile/${item.assigneeUserAvatar}`
                              }
                              className={styles.roleAvatar}>
                              {item.assigneeUserName &&
                                item.assigneeUserName[0]}
                            </Avatar>
                          </span>
                        </Tooltip>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.itemComments}>
                      {item?.commentNum > 0 ? (
                        <span
                          className={styles.clickable}
                          onClick={() => listGoTo(item)}>
                          <Icon type="message" className={styles.commentIcon} />
                          <span className={styles.commentNum}>
                            {item?.commentNum}
                          </span>
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </li>
              )
            })
          ) : (
            <div className={styles.liEmpty}>
              <Empty />
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}
export default TaskList

import { useState } from 'react'
import { Icon, Tooltip, Avatar, Empty } from 'uiw'
import timeDistance from '@/utils/timeDistance'
import { useNavigate } from 'react-router-dom'
import { DropdownBox, Label } from '@/components'

import styles from './index.module.less'

const TaskList = (props) => {
  const navigate = useNavigate()
  const {
    listData = [],
    labelsData = [],
    onCLickSearch,
    listNavigate,
    labelsListData,
    teamMembersListData,
    milestonesListData,
    conditionChange,
    searchOptions,
    activeKey,
  } = props
  console.log(labelsListData)
  const [onTab, setOnTab] = useState(activeKey || '1')

  // 任务状态
  const taskState = [
    { onTab: '1', color: '#d99156', title: '未开始', icon: 'plus-circle-o' },
    { onTab: '2', color: '#fbb957', title: '进行中', icon: 'circle-o' },
    { onTab: '3', color: '#41b349', title: '已完成', icon: 'circle-check-o' },
    { onTab: '4', color: '#813c85', title: '已逾期', icon: 'circle-close-o' },
  ]

  // 任务排序
  const taskSort = [
    // {
    //   key: 1,
    //   value: { orderByColumn: 'assignmentTitle', isAsc: 'asc' },
    //   label: '名称升序',
    // },
    // {
    //   key: 2,
    //   value: { orderByColumn: 'assignmentTitle', isAsc: 'desc' },
    //   label: '名称降序',
    // },
    {
      key: 3,
      value: { orderByColumn: 'createTime', isAsc: 'asc' },
      label: '创建时间升序',
    },
    {
      key: 4,
      value: { orderByColumn: 'createTime', isAsc: 'desc' },
      label: '创建时间降序',
    },
    {
      key: 5,
      value: { orderByColumn: 'updateTime', isAsc: 'asc' },
      label: '更新时间升序',
    },
    {
      key: 6,
      value: { orderByColumn: 'updateTime', isAsc: 'desc' },
      label: '更新时间降序',
    },
  ]

  // 跳转路径
  const listGoTo = (val) => {
    listNavigate(val)
  }

  // 跳转页面方法
  const goPage = (value) => {
    navigate(`/${value}`)
  }

  // 选项变化回调
  const optionsChange = (value) => {
    // const param = { [type]: value }
    conditionChange && conditionChange({ ...value })
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
              onCLickSearch &&
                onCLickSearch('labels', {
                  value: item.id,
                  label: item.name,
                })
            }}>
            {item.name}
          </Label>
          // <span
          //   key={item?.id}
          //   style={{
          //     paddingLeft: 8,
          //     paddingRight: 8,
          //     borderColor: item.color,
          //     backgroundColor: `${item.color}40`,
          //     color: item.color,
          //   }}
          //   className={styles.label}
          // onClick={() => {
          //   onCLickSearch &&
          //     onCLickSearch('labels', {
          //       value: item.id,
          //       label: item.name,
          //     })
          // }}>
          //   {item.name}
          // </span>
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
                      ${item.onTab === onTab ? styles.action : ''}`}
                      style={{ color: item.color }}
                      onClick={() => {
                        setOnTab(item.onTab)
                        optionsChange({ assignmentStatus: item.onTab })
                      }}>
                      <Icon type={item.icon} />
                      {item.title}
                    </span>
                  )
                })}
              </p>
            </div>
            <div className={styles.itemRight}>
              <DropdownBox
                listData={teamMembersListData}
                title="创建人"
                columnType="member"
                columnKey="userId"
                searchValue={['memberName', 'userAcount']}
                onSelect={(value) => optionsChange({ createId: value })}>
                <span className={styles.clickableDiscolor}>
                  创建人
                  <Icon type="down" />
                </span>
              </DropdownBox>
              <DropdownBox
                listData={labelsListData}
                title="标签"
                columnType="label"
                columnKey="id"
                searchValue={['name']}
                selectData={searchOptions.labels}
                onSelect={(value) => optionsChange({ labels: value })}>
                <span className={styles.clickableDiscolor}>
                  标签
                  <Icon type="down" />
                </span>
              </DropdownBox>
              <DropdownBox
                listData={milestonesListData}
                title="里程碑"
                columnType="milestone"
                columnKey="milestonesId"
                searchValue={['milestonesTitle']}
                selectData={searchOptions.milestonesId}
                onSelect={(value) => optionsChange({ milestonesId: value })}>
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
                searchValue={['memberName', 'userAcount']}
                onSelect={(value) =>
                  optionsChange({ assignmentUserId: value })
                }>
                <span className={styles.clickableDiscolor}>
                  指派人
                  <Icon type="down" />
                </span>
              </DropdownBox>
              <DropdownBox
                listData={taskSort}
                title="排序"
                columnType="sort"
                columnKey="key"
                isRadio={true}
                isCancel={false}
                isSearchBox={false}
                selectData={[3]}
                onSelect={(_, key) => {
                  const valueInfo = taskSort.filter((s) => s.key === key)[0]
                    .value
                  optionsChange(valueInfo)
                }}>
                <span className={styles.clickableDiscolor}>
                  排序
                  <Icon type="down" />
                </span>
              </DropdownBox>
            </div>
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
                      <span className={styles.mark}>#{item.assignmentId}</span>·
                      由
                      <span
                        className={styles.clickable}
                        style={{ paddingLeft: 5 }}
                        onClick={() => goPage(`${item.assigneeUserAccount}`)}>
                        {item?.updateName}
                      </span>
                      <span className={styles.updateTime}>
                        更新于{timeDistance(item.updateTime).time}前
                      </span>
                      {item.milestonesId ? (
                        <span
                          className={styles.clickable}
                          onClick={() => {
                            onCLickSearch &&
                              onCLickSearch('milestonesId', {
                                value: item.milestonesId,
                                label: item.milestonesTitle,
                              })
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
                    <div style={{ flexWrap: 'wrap' }}>
                      {item.assigneeUserId ? (
                        <>
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
                                    : item.assigneeUserAvatar?.substring(
                                        0,
                                        4
                                      ) !== 'http' &&
                                      item.assigneeUserAvatar !== '' &&
                                      `/api/file/selectFile/${item.assigneeUserAvatar}`
                                }
                                className={styles.roleAvatar}>
                                {item.assigneeUserName &&
                                  item.assigneeUserName[0]}
                              </Avatar>
                            </span>
                          </Tooltip>
                          {/* <div style={{ fontSize: 12 }}>
                          更新于{timeDistance(item.updateTime).time}前
                        </div> */}
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.itemComments}>
                      {item?.commentNum > 0 ? (
                        <span
                          className={styles.clickableDiscolor}
                          onClick={() => listGoTo(item)}>
                          <Icon type="message" />
                          {item?.commentNum}
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
            <Empty />
          )}
        </ul>
      </div>
    </div>
  )
}
export default TaskList

import { useState } from 'react'
import { Icon } from 'uiw'
import { DropdownBox } from '@/components'

import styles from './index.module.less'

const ListHead = (props) => {
  const {
    taskState,
    labelsListData,
    teamMembersListData,
    milestonesListData,
    conditionChange,
    searchOptions,
    activeKey,
  } = props

  const [onTab, setOnTab] = useState(activeKey || '1')

  // 任务排序
  const taskSort = [
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

  // 选项变化回调
  const optionsChange = (value) => {
    // const param = { [type]: value }
    conditionChange && conditionChange({ ...value })
  }

  return (
    <div className={styles.listHead}>
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
          onSelect={(value) => optionsChange({ assignmentUserId: value })}>
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
            const valueInfo = taskSort.filter((s) => s.key === key)[0].value
            optionsChange(valueInfo)
          }}>
          <span className={styles.clickableDiscolor}>
            排序
            <Icon type="down" />
          </span>
        </DropdownBox>
      </div>
    </div>
  )
}
export default ListHead

import { useState } from 'react'
import { Icon } from 'uiw'
import { DropdownBox } from '@/components'

import styles from './index.module.less'

const ListHead = (props) => {
  const {
    // taskState,
    labelsListData,
    teamMembersListData,
    milestonesListData,
    conditionChange,
    searchOptions,
    activeKey,
    taskNum,
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

  /**
   * 选项变化回调
   * @param {Array} data 数据
   * @param {number | string} value 当前数据
   * @param {number} form 类型
   */
  const optionsChange = (data, value, form) => {
    conditionChange && conditionChange({ ...data }, value, form)
  }

  return (
    <div className={styles.listHead}>
      <div className={styles.itemLeft}>
        <p>
          <span
            className={onTab === '1' ? styles.action : ''}
            onClick={() => {
              setOnTab('1')
              optionsChange({ code: 'open' }, 'open', 1)
            }}>
            <Icon type="circle-o" />
            {taskNum?.open} 打开
          </span>
          <span
            className={onTab === '2' ? styles.action : ''}
            onClick={() => {
              setOnTab('2')
              optionsChange({ code: 'close' }, 'close', 1)
            }}>
            <Icon type="check" />
            {taskNum?.close} 关闭
          </span>
          {/* {taskState.map((item, index) => {
            return (
              <span
                key={index}
                className={`${styles.clickableDiscolor}  
                      ${item.onTab === onTab ? styles.action : ''}`}
                style={{ color: item.color }}
                onClick={() => {
                  setOnTab(item.onTab)
                  optionsChange({ assignmentStatus: item.onTab }, item.onTab, 1)
                }}>
                <Icon type={item.icon} />
                {item.title}
              </span>
            )
          })} */}
        </p>
      </div>
      <div className={styles.itemRight}>
        <DropdownBox
          listData={teamMembersListData}
          title="创建人"
          columnType="member"
          columnKey="userId"
          searchValue={['memberName', 'userAcount']}
          selectData={searchOptions.createId}
          onSelect={(data, value) =>
            optionsChange({ createId: data }, value, 2)
          }>
          <span className={styles.clickableDiscolor}>
            &ensp;创建人&ensp;
            {/* <Icon type="down" /> */}
            <span className={styles.dropdownIcon}></span>
          </span>
        </DropdownBox>
        <DropdownBox
          listData={labelsListData}
          title="标签"
          columnType="label"
          columnKey="id"
          searchValue={['name']}
          selectData={searchOptions.labels}
          onSelect={(data, value) => optionsChange({ labels: data }, value, 2)}>
          <span className={styles.clickableDiscolor}>
            &ensp;标签&ensp;
            {/* <Icon type="down" /> */}
            <span className={styles.dropdownIcon}></span>
          </span>
        </DropdownBox>
        <DropdownBox
          listData={milestonesListData}
          title="里程碑"
          columnType="milestone"
          columnKey="milestonesId"
          searchValue={['milestonesTitle']}
          selectData={searchOptions.milestonesId}
          onSelect={(data, value) =>
            optionsChange({ milestonesId: data }, value, 2)
          }>
          <span className={styles.clickableDiscolor}>
            &ensp;里程碑&ensp;
            {/* <Icon type="down" /> */}
            <span className={styles.dropdownIcon}></span>
          </span>
        </DropdownBox>
        <DropdownBox
          listData={teamMembersListData}
          title="指派人"
          columnType="member"
          columnKey="userId"
          searchValue={['memberName', 'userAcount']}
          selectData={searchOptions.assignmentUserId}
          onSelect={(data, value) =>
            optionsChange({ assignmentUserId: data }, value, 2)
          }>
          <span className={styles.clickableDiscolor}>
            &ensp;指派人&ensp;
            {/* <Icon type="down" /> */}
            <span className={styles.dropdownIcon}></span>
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
          selectData={[4]}
          onSelect={(_, key) => {
            const valueInfo = taskSort.filter((s) => s.key === key)[0].value
            optionsChange(valueInfo)
          }}>
          <span className={styles.clickableDiscolor}>
            &ensp;排序&ensp;
            {/* <Icon type="down" /> */}
            <span className={styles.dropdownIcon}></span>
          </span>
        </DropdownBox>
      </div>
    </div>
  )
}
export default ListHead

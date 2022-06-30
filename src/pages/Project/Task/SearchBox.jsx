import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Input, Form } from 'uiw'
import styles from './index.module.less'

const taskStatus = {
  未开始: 1,
  进行中: 2,
  已完成: 3,
  已逾期: 4,
}

// // 任务排序
// const taskSorts = [
//   {
//     key: 3,
//     value: { orderByColumn: 'createTime', isAsc: 'asc' },
//     label: '创建时间升序',
//   },
//   {
//     key: 4,
//     value: { orderByColumn: 'createTime', isAsc: 'desc' },
//     label: '创建时间降序',
//   },
//   {
//     key: 5,
//     value: { orderByColumn: 'updateTime', isAsc: 'asc' },
//     label: '更新时间升序',
//   },
//   {
//     key: 6,
//     value: { orderByColumn: 'updateTime', isAsc: 'desc' },
//     label: '更新时间降序',
//   },
// ]

const SearchBox = (props) => {
  const {
    project: { membersList },
    labels: { listData: labelsListData },
    projectTasks: { searchValue, searchOptions },
    milestone: { milepostaData },
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const form = useRef()

  const { projectId } = props

  useEffect(() => {
    form.current.setFieldValue('searchValue', searchValue)
  }, [searchValue])

  useEffect(() => {
    ParsingInputValue(searchValue, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const ParsingInputValue = (value, type) => {
    console.log(value, type)
    const newSearchValue = ` ${value} `
    const newSearchOptions = {
      assignmentStatus: '1',
      createId: [], // 创建人
      labels: [], // 标签
      milestonesId: [], // 里程碑
      assignmentUserId: [], // 指派人
      orderByColumn: 'createTime',
      isAsc: 'asc',
    }
    if (value.trim() !== searchValue.trim() || type === 1) {
      const LABEL = /标签:(?<labels>.*?)\s/g
      const MILESTONES = /里程碑:(?<milestonesId>.*?)\s/g
      const CREATE = /创建人:(?<createId>.*?)\s/g
      const ASSIGNMENTUSER = /指派人:(?<assignmentUserId>.*?)\s/g
      const STATE = /状态:(?<assignmentStatus>.*?)\s/g

      if (newSearchValue.match(STATE)?.length) {
        for (const match of newSearchValue.matchAll(STATE)) {
          newSearchOptions.assignmentStatus =
            taskStatus[match?.groups.assignmentStatus.trim()]
        }
      }

      if (newSearchValue.match(LABEL)?.length) {
        for (const match of newSearchValue.matchAll(LABEL)) {
          labelsListData.map((item) => {
            if (item.name.trim() === match?.groups.labels.trim()) {
              newSearchOptions.labels.push(item.id)
            }
            return null
          })
        }
      }
      if (newSearchValue.match(MILESTONES)?.length) {
        for (const match of newSearchValue.matchAll(MILESTONES)) {
          milepostaData.map((item) => {
            if (
              item.milestonesTitle.trim() === match?.groups.milestonesId.trim()
            ) {
              newSearchOptions.milestonesId.push(item.milestonesId)
            }
            return null
          })
        }
      }
      if (newSearchValue.match(CREATE)?.length) {
        for (const match of newSearchValue.matchAll(CREATE)) {
          membersList.map((item) => {
            if (item.userAcount.trim() === match?.groups.createId.trim()) {
              newSearchOptions.createId.push(item.userId)
            }
            return null
          })
        }
      }
      if (newSearchValue.match(ASSIGNMENTUSER)?.length) {
        for (const match of newSearchValue.matchAll(ASSIGNMENTUSER)) {
          membersList.map((item) => {
            if (
              item.userAcount.trim() === match?.groups.assignmentUserId.trim()
            ) {
              newSearchOptions.assignmentUserId.push(item.userId)
            }
            return null
          })
        }
      }
    }
    dispatch({
      type: 'projectTasks/update',
      payload: {
        searchValue: value,
        searchOptions: { ...searchOptions, ...newSearchOptions },
      },
    })
  }

  return (
    <div className={styles.searchBox}>
      <Form
        ref={form}
        fields={{
          searchValue: {
            children: <Input preIcon="search" placeholder="输入任务名查询" />,
          },
        }}
        onSubmit={({ initial, current }) => {
          dispatch.projectTasks.getTaskPagingData({ projectId })
        }}
        onChange={({ initial, current }) => {
          ParsingInputValue(current.searchValue)
        }}
        style={{ width: '100%' }}>
        {({ fields }) => {
          return (
            <div className={styles.taskHeadBox}>
              <div className={styles.searchTask}>{fields?.searchValue}</div>
              <div className={styles.newTask}>
                <Button type="primary">新建任务</Button>
              </div>
            </div>
          )
        }}
      </Form>
    </div>
  )
}

export default SearchBox

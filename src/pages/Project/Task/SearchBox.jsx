import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Input, Form } from 'uiw'
import styles from './index.module.less'

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
          const newSearchValue = ` ${current.searchValue} `
          const newSearchOptions = {
            assignmentStatus: '1',
            createId: [], // 创建人
            labels: [], // 标签
            milestonesId: [], // 里程碑
            assignmentUserId: [], // 指派人
            orderByColumn: 'createTime',
            isAsc: 'asc',
          }
          if (current.searchValue.trim() !== searchValue.trim()) {
            const LABEL = /标签:(?<labels>.*?)\s/g
            const MILESTONES = /里程碑:(?<milestonesId>.*?)\s/g
            const CREATE = /创建人:(?<createId>.*?)\s/g
            const ASSIGNMENTUSER = /指派人:(?<assignmentUserId>.*?)\s/g
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
                    item.milestonesTitle.trim() ===
                    match?.groups.milestonesId.trim()
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
                  if (
                    item.userAcount.trim() === match?.groups.createId.trim()
                  ) {
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
                    item.userAcount.trim() ===
                    match?.groups.assignmentUserId.trim()
                  ) {
                    newSearchOptions.assignmentUserId.push(item.userId)
                  }
                  return null
                })
              }
            }
          }
          console.log('newSearchOptions===>', newSearchOptions)
          dispatch({
            type: 'projectTasks/update',
            payload: {
              searchValue: current.searchValue,
              searchOptions: { ...searchOptions, ...newSearchOptions },
            },
          })
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

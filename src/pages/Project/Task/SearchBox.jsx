import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Input, Form } from 'uiw'
import styles from './index.module.less'

const SearchBox = () => {
  const {
    projectTasks: { searchValue },
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const form = useRef()

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
        onChange={({ initial, current }) => {
          const newSearchValue = `${current.searchValue} `
          if (current.searchValue.trim() !== searchValue.trim()) {
            const LABEL = /标签:(?<labels>.*?)\s/g
            const MILESTONES = /里程碑:(?<milestonesId>.*?)\s/g
            const CREATE = /创建人:(?<createId>.*?)\s/g
            const ASSIGNMENTUSER = /指派人:(?<assignmentUserId>.*?)\s/g
            if (LABEL.exec(newSearchValue)?.length) {
              for (const match of newSearchValue.matchAll(LABEL)) {
                console.log('labels,======>', match)
              }
            }
            if (MILESTONES.exec(newSearchValue)?.length) {
              for (const match of newSearchValue.matchAll(MILESTONES)) {
                console.log('milestonesId,======>', match)
              }
            }
            if (CREATE.exec(newSearchValue)?.length) {
              for (const match of newSearchValue.matchAll(CREATE)) {
                console.log('createId,======>', match)
              }
            }
            if (ASSIGNMENTUSER.exec(newSearchValue)?.length) {
              for (const match of newSearchValue.matchAll(ASSIGNMENTUSER)) {
                console.log('assignmentUserId,======>', match)
              }
            }
          }
          dispatch({
            type: 'projectTasks/update',
            payload: { searchValue: current.searchValue },
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

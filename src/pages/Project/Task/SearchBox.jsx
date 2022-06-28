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
          if (current.searchValue.trim() === searchValue.trim()) {
            console.log('没变化')
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

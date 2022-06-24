import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import styles from './index.module.less'
import { Input, Form } from 'uiw'
import { useParams } from 'react-router-dom'

const Search = () => {
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const form = useRef()
  const conditionChange = async (params) => {
    dispatch({
      type: 'usersManagement/selectPageList',
      payload: {
        ...params,
        page: 1,
        pageSize: 10,
        projectId: projectId,
      },
    })
  }
  return (
    <div>
      <Form
        ref={form}
        fields={{
          searchParam: {
            children: (
              <Input preIcon="search" placeholder="输入成员账号或姓名查询" />
            ),
          },
        }}
        onSubmit={({ initial, current }) => conditionChange(current)}
        style={{ width: '100%' }}>
        {({ fields }) => {
          return <div className={styles.userHeadBox}>{fields?.searchParam}</div>
        }}
      </Form>
    </div>
  )
}

export default Search

import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import styles from './index.module.less'
import { Input, Form, Icon } from 'uiw'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

const Search = () => {
  const dispatch = useDispatch()
  const { projectId } = useParams()
  const [value, setValue] = useState('')
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
              <Input
                preIcon="search"
                placeholder="输入成员账号或姓名查询"
                onChange={(e) => {
                  setValue(e.target.value)
                }}
                addonAfter={
                  value.length > 0 && (
                    <Icon
                      type="close"
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        form.current.resetForm()
                        setValue('')
                      }}
                    />
                  )
                }
              />
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

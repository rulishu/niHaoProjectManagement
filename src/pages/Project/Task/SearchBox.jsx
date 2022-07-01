import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Form } from 'uiw'
import styles from './index.module.less'

// 任务状态对象
const taskStatus = {
  未开始: 1,
  进行中: 2,
  已完成: 3,
  已逾期: 4,
}

const SearchBox = (props) => {
  const {
    projectTasks: { searchValue, searchOptions },
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userAccount, projectId } = useParams()
  const form = useRef()
  const { searchConfigObj } = props

  useEffect(() => {
    form.current.setFieldValue('searchValue', searchValue)
  }, [searchValue])

  useEffect(() => {
    ParsingInputValue(searchValue, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const ParsingInputValue = (value, type) => {
    const newSearchValue = ` ${value} `
    const newSearchOptions = {
      assignmentStatus: '',
      createId: [], // 创建人
      labels: [], // 标签
      milestonesId: [], // 里程碑
      assignmentUserId: [], // 指派人
      orderByColumn: 'createTime',
      isAsc: 'asc',
    }

    if (value.trim() !== searchValue.trim() || type === 1) {
      const STATE = /状态:(?<assignmentStatus>.*?)\s/g
      // 解析任务状态
      if (newSearchValue.match(STATE)?.length) {
        for (const match of newSearchValue.matchAll(STATE)) {
          newSearchOptions.assignmentStatus =
            taskStatus[match?.groups.assignmentStatus.trim()] || 999
        }
      }
      Object.entries(searchConfigObj).map((item) => {
        if (newSearchValue.match(item[1].regular)?.length) {
          for (const match of newSearchValue.matchAll(item[1].regular)) {
            item[1].dataSource.map((dataItem) => {
              if (
                dataItem[item[1].name].trim() === match?.groups[item[0]].trim()
              ) {
                newSearchOptions[item[0]].push(dataItem[item[1].key])
                return null
              }
              newSearchOptions[item[0]]?.push(match?.groups[item[0]])
              return null
            })
          }
        }
        return null
      })
    }
    dispatch({
      type: 'projectTasks/update',
      payload: {
        searchValue: value,
        searchOptions: { ...searchOptions, ...newSearchOptions },
      },
    })
  }

  // 跳转到 任务详情方法
  const goIssue = () => {
    dispatch({
      type: 'project/update',
      payload: {
        issueType: 'add',
        fromData: {
          assignmentTitle: '',
          assignmentType: 1,
          description: '',
          projectId,
          labels: [],
        },
      },
    })
    navigate(`/${userAccount}/${projectId}/task/newIssue`)
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
                <Button type="primary" onClick={() => goIssue()}>
                  新建任务
                </Button>
              </div>
            </div>
          )
        }}
      </Form>
    </div>
  )
}

export default SearchBox

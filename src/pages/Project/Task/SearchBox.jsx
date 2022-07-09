import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Form } from 'uiw'
import { useLocation } from 'react-router-dom'
import { history } from '@uiw-admin/router-control'
import styles from './index.module.less'

// 任务状态对象
const taskStatus = {
  打开: { type: 'code', value: '1' },
  关闭: { type: 'code', value: '2' },
  未开始: { type: 'assignmentStatus', value: '1' },
  进行中: { type: 'assignmentStatus', value: '2' },
  已完成: { type: 'assignmentStatus', value: '3' },
  已逾期: { type: 'assignmentStatus', value: '4' },
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
  const urlSearch = useLocation().search
  const location = useLocation()

  // 解析url中搜索参数
  const urlParsingObj = {
    状态: 'state',
    创建人: 'create',
    指派人: 'assigned',
    标签: 'label',
    里程碑: 'milestone',
  }

  useEffect(() => {
    form.current.setFieldValue('searchValue', searchValue)
  }, [searchValue])

  useEffect(() => {
    let newSearchValue = searchValue
    // 将newSearchValue转化成数组
    newSearchValue = newSearchValue.split(' ')
    // 去除重复
    newSearchValue = [...new Set(newSearchValue)]
    //去除空项
    newSearchValue = newSearchValue.filter((item) => item)
    // 将数组转化成字符串
    newSearchValue = newSearchValue.join(' ')
    // newSearchValue 中逗号替换成空格
    newSearchValue = newSearchValue.replace(/,/g, ' ')
    ParsingInputValue(newSearchValue, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  /**
   * 输入框字符串解析为接口所需参数对象
   * @param {string} value 输入框字符串的值
   * @param {number} type 类型 1：字符串发生改变
   */
  const ParsingInputValue = (value, type) => {
    let currentUrlParams = new URLSearchParams(urlSearch)
    const newSearchValue = ` ${value} `
    const newSearchOptions = {
      // assignmentStatus: '',
      // code: '1',
      createId: [], // 创建人
      labels: [], // 标签
      milestonesId: [], // 里程碑
      assignmentUserId: [], // 指派人
      orderByColumn: 'createTime',
      isAsc: 'desc',
    }

    if (value.trim() !== searchValue.trim() || type === 1) {
      const STATE = /状态:(?<state>.*?)\s/g
      // 解析任务状态
      if (newSearchValue.match(STATE)?.length) {
        for (const match of newSearchValue.matchAll(STATE)) {
          if (taskStatus[match?.groups.state?.trim()]) {
            const { type, value } = taskStatus[match?.groups.state?.trim()]
            newSearchOptions.assignmentStatus = null
            newSearchOptions.code = null
            newSearchOptions[type] = value
            currentUrlParams.set('state', match?.groups.state)
          }
        }
      }
      if (!newSearchValue.match(STATE)) {
        newSearchOptions.assignmentStatus = ''
        newSearchOptions.code = null
      }
      Object.entries(searchConfigObj).forEach((item) => {
        if (newSearchValue.match(item[1].regular)?.length) {
          for (const match of newSearchValue.matchAll(item[1].regular)) {
            currentUrlParams.append(
              urlParsingObj[item[1].title],
              match?.groups[item[0]]
            )
            item[1].dataSource.forEach((dataItem) => {
              if (
                dataItem[item[1].name].trim() === match?.groups[item[0]].trim()
              ) {
                newSearchOptions[item[0]].push(dataItem[item[1].key])
              }
            })
          }
          if (
            newSearchOptions[item[0]].length !==
            newSearchValue.match(item[1].regular)?.length
          ) {
            newSearchOptions[item[0]].push(0)
          }
        }
      })
      // 获取路由参数
      let currentUrlParamsArr = decodeURI(currentUrlParams.toString()).split(
        '&'
      )
      currentUrlParamsArr = [...new Set(currentUrlParamsArr)]
      let valueArr = newSearchValue.split(' ')
      valueArr = valueArr.filter((item) => item)
      valueArr = [...new Set(valueArr)]
      valueArr = valueArr.map((item) => {
        return item.split(':')[1]
      })
      currentUrlParamsArr = currentUrlParamsArr.filter((item) => {
        const itemArr = item.split('=')
        return valueArr.includes(itemArr[1])
      })
      currentUrlParamsArr = currentUrlParamsArr.join('&')
      let urlParams = new URLSearchParams(currentUrlParamsArr)
      history.push('#' + location.pathname + '?' + urlParams.toString())
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
            children: <Input preIcon="search" placeholder="请输入条件查询" />,
          },
        }}
        onSubmit={({ initial, current }) => {
          dispatch.projectTasks.getTaskPagingData({ projectId })
          dispatch.projectTasks.countAssignment({ projectId })
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

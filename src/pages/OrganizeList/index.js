import { useState } from 'react'
import { Tabs, Button, Input, Icon, OverlayTrigger, Tooltip, Avatar } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
import { Container } from '@/components'
import styles from './index.module.less'
import newDebounce from '@/utils/debounce'
import './index.css'
import AddDrawer from './AddDrawer'

const OrganizeList = (props) => {
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const [queryForm, setQueryForm] = useState({
    pageSize: 20,
    status: '',
    name: '',
  })
  const [sorting, setSorting] = useState(1)
  // 下拉框是否可见
  const [isPulldown, setIsPulldown] = useState(false)

  // 一级组织筛选 相同数据过滤
  const lastData = (data) => {
    const dataSouce = data?.filter(function (item) {
      return item.parentId === 0
    })
    function uniqueFunc(arr, uniId) {
      const res = new Map()
      return arr?.filter(
        (item) => !res.has(item[uniId]) && res.set(item[uniId], 1)
      )
    }
    return uniqueFunc(dataSouce, dataSouce?.length + 1)
  }

  const table = useTable('/api/organization/selectOrganizationProject', {
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: lastData(data?.data?.rows),
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        ...queryForm,
        pageSize: 10,
        page: pageIndex,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const sortingList = [
    { value: 3, title: '修改时间' },
    { value: 2, title: '创建时间' },
    { value: 1, title: '名称' },
  ]

  // 渲染下拉框
  const card = (
    <div className={styles.dropdownMenu}>
      <ul>
        {sortingList.map((item) => (
          <li
            key={item.value}
            onClick={() => {
              setQueryForm({
                ...queryForm,
                order: item.value,
              })
              setIsPulldown(false)
              setSorting(item.value)
              table.onSearch()
            }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )

  // tabs 的 标题BOX
  const tabsPaneLabel = (title, num) => {
    return (
      <div className={styles.tabsPaneLabel}>
        <span className={styles.title}>{title}</span>
        <span className={styles.num}>{num}</span>
      </div>
    )
  }

  // 新增组织
  const onAdd = () => {
    dispatch({
      type: 'organizeList/updateState',
      payload: {
        addVisible: true,
      },
    })
  }

  return (
    <Container>
      <div className={styles.warp}>
        <div className={styles.container}>
          <div className={styles.projectHead}>
            <h1>组织</h1>
            <Button type="primary" size="large" onClick={() => onAdd()}>
              新建组织
            </Button>
          </div>
          <div className={styles.projectHeadArea}>
            <div className={styles.areaLeft}>
              <Tabs
                type="line"
                activeKey="1"
                className="projectListTabs"
                onTabClick={(tab, key, e) => {
                  const newStatus =
                    tab === '1'
                      ? ''
                      : tab === '2'
                      ? 1
                      : tab === '3'
                      ? 2
                      : tab === '4'
                      ? 3
                      : tab === '0'
                      ? 0
                      : ''
                  setQueryForm({
                    ...queryForm,
                    status: newStatus,
                  })
                  table.onSearch()
                }}>
                <Tabs.Pane
                  label={tabsPaneLabel(
                    '我的组织',
                    table.formatData.length || 0
                  )}
                  key="1"></Tabs.Pane>
                {/* <Tabs.Pane
                  label={tabsPaneLabel('公开组织', proNum?.nogoing || 0)}
                  key="0"></Tabs.Pane> */}
              </Tabs>
            </div>
            <div className={styles.areaRight}>
              <div>
                <Input
                  placeholder="按名称筛选"
                  onChange={(e) => {
                    const nameSearch = () => {
                      setQueryForm({
                        ...queryForm,
                        organizationName: e.target.value,
                      })
                      table.onSearch()
                    }
                    newDebounce(nameSearch, 500)
                  }}
                />
              </div>
              <div className={styles.dropdown}>
                <OverlayTrigger
                  placement="bottomRight"
                  trigger="click"
                  isOpen={isPulldown}
                  onVisibleChange={(open) => setIsPulldown(open)}
                  overlay={card}>
                  <div className={styles.toggle}>
                    <span>
                      {sortingList.map(
                        (item) => item.value === sorting && item.title
                      )}
                    </span>
                    <Icon type={isPulldown ? 'up' : 'down'} />
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div className={styles.projectProTable}>
            <ProTable
              tableHeadHidden={true}
              className="proProTable"
              paginationProps={{ style: { display: 'none' } }}
              table={table}
              columns={[
                {
                  key: 'avatar',
                  width: 30,
                  render: (text, _, rowData) => {
                    return (
                      <div className={styles.avatarContainer}>
                        <Avatar
                          shape="square"
                          size="large"
                          icon="user"></Avatar>
                      </div>
                    )
                  },
                },
                {
                  key: 'organizationName',
                  render: (text, keyName, rowData) => {
                    return (
                      <div className={styles.projectInfo}>
                        <h2 className={styles.projectName}>
                          {rowData?.organizationName}
                        </h2>
                        <div className={styles.infoBottomBx}>
                          <span>{rowData?.textDescribe}</span>
                        </div>
                      </div>
                    )
                  },
                },
                {
                  key: 'controls',
                  render: (text, _, rowData) => {
                    return (
                      <div>
                        <Tooltip
                          placement="top"
                          content={<strong>成员</strong>}>
                          <div>
                            <Icon type="user" />
                            <span>
                              {Number(rowData?.teamMember || 0) >= 100
                                ? '...'
                                : rowData?.teamMember}
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                    )
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
      <AddDrawer />
    </Container>
  )
}

export default OrganizeList

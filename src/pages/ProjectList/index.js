import { useState, useEffect } from 'react'
import { Tabs, Button, Input, Icon, OverlayTrigger, Avatar, Tooltip } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { Container } from '@/components'
import styles from './index.module.less'
import timeDistance from '@/utils/timeDistance'
import newDebounce from '@/utils/debounce'
import EditDrop from './EditDrop.jsx'
import ProjectManagement from '@/components/ProjectManagement/index'
import './index.css'

const ProjectList = (props) => {
  const { router } = props
  const token = localStorage.getItem('token')
  const {
    projectlist: { proNum },
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [queryForm, setQueryForm] = useState({
    pageSize: 20,
    status: '',
    type: '20',
    name: '',
    order: 3,
  })
  const [sorting, setSorting] = useState(1)
  // 下拉框是否可见
  const [isPulldown, setIsPulldown] = useState(false)
  useEffect(() => {
    dispatch.projectlist.selectNumber({
      type: queryForm.type,
      name: queryForm.name,
    })
  }, [dispatch, queryForm.name, queryForm.type])
  const table = useTable('/api/project/selectOneInfo', {
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        ...queryForm,
        page: pageIndex,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  const goSpecifyPage = (option = { path: String, projectUrl: String }) => {
    if (option.path === '/task') {
      router.navigate(`${option?.projectUrl}${option?.path}`)
    } else {
      router.navigate(`${option?.projectUrl}${option?.path}`)
    }

    // e.stopPropagation()禁止冒泡
  }

  const sortingList = [
    { value: 3, title: '修改时间' },
    { value: 2, title: '创建时间' },
    { value: 1, title: '名称' },
  ]

  //刷新界面
  const refresh = () => {
    table.onSearch()
    dispatch.projectlist.selectNumber({
      type: queryForm.type,
      name: queryForm.name,
    })
  }

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
  const updateUserRole = (rowData) => {
    dispatch({
      type: 'projectlist/update',
      payload: {
        userRole: rowData?.userRole,
      },
    })
  }
  return (
    <Container>
      <div className={styles.warp}>
        <div className={styles.container}>
          <div className={styles.projectHead}>
            <h1>项目</h1>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                dispatch.projectUpdate.updataProject({ drawerType: 'add' })
              }}>
              新建项目
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
                  label={tabsPaneLabel('全部', proNum?.all || 0)}
                  key="1"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel('未开始', proNum?.nogoing || 0)}
                  key="0"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel('进行中', proNum?.ongoing || 0)}
                  key="2"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel('已关闭', proNum?.closed || 0)}
                  key="3"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel('已挂起', proNum?.hangUp || 0)}
                  key="4"></Tabs.Pane>
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
                        name: e.target.value,
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
          <div className={styles.projectNavBlock}>
            <Tabs
              type="line"
              activeKey="1"
              className="projectListTabs"
              onTabClick={(tab, key, e) => {
                setQueryForm({
                  ...queryForm,
                  type: tab === '1' ? '20' : '10',
                })
                table.onSearch()
              }}>
              <Tabs.Pane label="所有项目" key="1"></Tabs.Pane>
              <Tabs.Pane label="我的" key="2"></Tabs.Pane>
            </Tabs>
          </div>
          <div className={styles.projectProTable}>
            <ProTable
              tableHeadHidden={true}
              className="proProTable"
              paginationProps={{ pageSize: 10 }}
              table={table}
              columns={[
                {
                  key: 'avatar',
                  width: 30,
                  render: (text, _, rowData) => {
                    return (
                      <div className={styles.avatarContainer}>
                        <Avatar
                          size="small"
                          className={styles.listImg}
                          src={
                            rowData.projectAvatar !== ''
                              ? `/api/file/selectFile/${rowData.projectAvatar}`
                              : ''
                          }>
                          {rowData?.name[0]}
                        </Avatar>
                      </div>
                    )
                  },
                },
                {
                  key: 'name',
                  render: (text, keyName, rowData) => {
                    return (
                      <div className={styles.projectInfo}>
                        <div className={styles.infoTopBox}>
                          <h2
                            className={styles.projectName}
                            onClick={() => {
                              router.navigate(rowData?.projectUrl)
                              updateUserRole(rowData)
                            }}>
                            {text}
                          </h2>
                          <span
                            className={styles.projectRole}
                            style={{ backgroundColor: '#e9daff' }}>
                            {rowData?.userRole}
                          </span>
                          <span
                            className={styles.projectRole}
                            style={{
                              backgroundColor:
                                rowData?.status === 1
                                  ? '#e8edff'
                                  : rowData?.status === 2
                                  ? '#ffcdcd'
                                  : rowData?.status === 3
                                  ? '#c9d1d9'
                                  : '#ffebb1',
                            }}>
                            {rowData?.status !== 0
                              ? rowData?.status !== 1
                                ? rowData?.status === 2
                                  ? '已关闭'
                                  : '已挂起'
                                : '进行中'
                              : '未开始'}
                          </span>
                        </div>
                        <div className={styles.infoBottomBx}>
                          <span>{rowData?.descr}</span>
                        </div>
                      </div>
                    )
                  },
                },
                {
                  // title: '控制',
                  key: 'controls',
                  render: (text, _, rowData) => {
                    return (
                      <div className={styles.projectControls}>
                        <div style={{ maxWidth: 210, display: 'flex' }}>
                          <div
                            className={styles.projectControlsLI}
                            onClick={(e) => {
                              goSpecifyPage({
                                path: '/task',
                                projectUrl: rowData.projectUrl,
                              })
                            }}>
                            <Tooltip
                              placement="top"
                              content={<strong>任务</strong>}>
                              <div style={{ lineHeight: 0 }}>
                                <Icon type="paper-clip" />
                                <span className={styles.num}>
                                  {Number(rowData?.task || 0) >= 100
                                    ? '...'
                                    : rowData?.task}
                                </span>
                              </div>
                            </Tooltip>
                          </div>
                          <div
                            className={styles.projectControlsLI}
                            onClick={(e) => {
                              goSpecifyPage({
                                path: '/usersManagement',
                                projectUrl: rowData.projectUrl,
                              })
                            }}>
                            <Tooltip
                              placement="top"
                              content={<strong>成员</strong>}>
                              <div style={{ lineHeight: 0 }}>
                                <Icon type="user" />
                                <span className={styles.num}>
                                  {Number(rowData?.teamMember || 0) >= 100
                                    ? '...'
                                    : rowData?.teamMember}
                                </span>
                              </div>
                            </Tooltip>
                          </div>
                          <div
                            className={styles.projectControlsLI}
                            onClick={(e) => {
                              goSpecifyPage({
                                path: '/milestone',
                                projectUrl: rowData.projectUrl,
                              })
                            }}>
                            <Tooltip
                              placement="top"
                              content={<strong>里程碑</strong>}>
                              <div style={{ lineHeight: 0 }}>
                                <Icon type="coffee" />
                                <span className={styles.num}>
                                  {Number(rowData?.milestones || 0) >= 100
                                    ? '...'
                                    : rowData?.milestones}
                                </span>
                              </div>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    )
                  },
                },
                {
                  // title: '更新时间',
                  key: 'updateTime',
                  width: 120,
                  render: (text) => {
                    return (
                      <div>
                        更新于{timeDistance(text).time}
                        {timeDistance(text).status ? '前' : '后'}{' '}
                      </div>
                    )
                  },
                },
                {
                  // title: '操作',
                  key: 'edit',
                  width: 50,
                  render: (text, keyName, rowData) => {
                    return (
                      // <div
                      //   onClick={(e) => {
                      //     e.stopPropagation()禁止冒泡
                      //   }}>
                      <EditDrop
                        rowData={rowData}
                        dispatch={dispatch}
                        search={refresh}
                      />
                      // </div>
                    )
                  },
                },
              ]}
            />
          </div>
        </div>
        <ProjectManagement fun={refresh}></ProjectManagement>
      </div>
    </Container>
  )
}

export default ProjectList

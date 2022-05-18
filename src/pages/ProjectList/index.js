import { useState, useEffect } from 'react'
import { Tabs, Button, Input, Icon, OverlayTrigger, Avatar, Tooltip } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { Container } from '@/components'
import styles from './index.module.less'
import timeDistance from '@/utils/timeDistance'
import EditDrop from './EditDrop.jsx'
import './index.css'

const ProjectList = (props) => {
  const { router } = props
  const token = localStorage.getItem('token')
  const { projectlist } = useSelector((state) => state)
  const { proNum } = projectlist
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch.projectlist.selectNumber()
  }, [dispatch])
  //项目状态
  const [projectStatus, setProjectStatus] = useState('')
  //项目名称搜索框的值
  const [projectName, setProjectName] = useState('')
  //所有项目“20”or我的项目“10”
  const [projectType, setProjectType] = useState('20')
  //列表排序
  const [projectOrder, setProjectOrder] = useState('1')
  const [sorting, setSorting] = useState(1)
  // 下拉框是否可见
  const [isPulldown, setIsPulldown] = useState(false)
  let datas = [
    {
      id: 34,
      name: '标题',
      startTime: null,
      dueTime: '2022-03-26',
      milestonesStatus: 2,
      degreeCompletion: 0.0,
      milestonesDesc:
        '里程碑描述\n里程碑描\n里程碑\n里程\n里\n里程\n里程碑\n里程碑描\n里程碑描述',
      projectId: 1320,
      projectName: '项目标题',
      createId: 46,
      createName: '黄来平',
      begin: '2022-03-02 17:32:20',
      updateId: 46,
      updateName: '黄来平',
      end: '2022-03-15 01:07:50',
      participateUser: null,
      closeTaskNum: 0,
      allTaskNum: 0,
      overtime: 1,
      overtimeNum: 4,
      updateTime: '2022-05-18 17:32:20',
    },
    {
      id: 34,
      name: '标题',
      startTime: null,
      dueTime: '2022-03-26',
      milestonesStatus: 2,
      degreeCompletion: 0.0,
      descr:
        '里程碑描述\n里程碑描\n里程碑\n里程\n里\n里程\n里程碑\n里程碑描\n里程碑程\n里\n里程\n里程碑\n里程碑描\n里程碑程\n里\n里程\n里程碑\n里程碑描\n里程碑程\n里\n里程\n里程碑\n里程碑描\n里程碑描述',
      milestonesDesc:
        '里程碑描述\n里程碑描\n里程碑\n里程\n里\n里程\n里程碑\n里程碑描\n里程碑描述',
      projectId: 1320,
      projectName: '项目标题',
      createId: 46,
      createName: '黄来平',
      begin: '2022-03-02 17:32:20',
      updateId: 46,
      updateName: '黄来平',
      end: '2022-03-15 01:07:50',
      participateUser: null,
      closeTaskNum: 0,
      allTaskNum: 0,
      overtime: 1,
      overtimeNum: 4,
      updateTime: '2022-05-30 00:50:00',
    },
    {
      id: 34,
      name: '标题',
      startTime: null,
      dueTime: '2022-03-26',
      milestonesStatus: 2,
      degreeCompletion: 0.0,
      milestonesDesc:
        '里程碑描述\n里程碑描\n里程碑\n里程\n里\n里程\n里程碑\n里程碑描\n里程碑描述',
      projectId: 1320,
      projectName: '项目标题',
      createId: 46,
      createName: '黄来平',
      begin: '2022-03-02 17:32:20',
      updateId: 46,
      updateName: '黄来平',
      end: '2022-03-15 01:07:50',
      participateUser: null,
      closeTaskNum: 0,
      allTaskNum: 0,
      overtime: 1,
      overtimeNum: 4,
      updateTime: '2022-02-06 17:32:20',
    },
  ]

  const table = useTable('/api/project/selectOneInfo', {
    // const table = useTable('https://randomuser.me/api', {
    formatData: (data) => {
      if (data?.data) {
        return {
          total: data?.data?.total,
          data: data?.data?.list,
        }
      }
      return { data: datas }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: 1,
        pageSize: 99999999,
        status: projectStatus,
        type: projectType,
        name: projectName,
        order: projectOrder,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const goSpecifyPage = (type, option = {}) => {
    type === 1 && router.navigate(`${option?.path}`)
    type === 2 && router.navigate(`${option?.path}`)
    type === 3 && router.navigate(`${option?.path}/${type !== 1 && option?.id}`)
    // e.stopPropagation()禁止冒泡
  }

  const sortingList = [
    { value: 1, title: '名称' },
    { value: 2, title: '创建时间' },
    { value: 3, title: '修改时间' },
  ]

  // 渲染下拉框
  const card = (
    <div className={styles.dropdownMenu}>
      <ul>
        {sortingList.map((item) => (
          <li
            key={item.value}
            onClick={() => {
              setProjectOrder(item.value)
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

  return (
    <div className={styles.warp}>
      <Container>
        <div className={styles.container}>
          <div className={styles.projectHead}>
            <h1>项目</h1>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                dispatch.global.updataProject({ drawerType: 'add' })
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
                  if (tab === '1') {
                    setProjectStatus('')
                  } else if (tab === '2') {
                    setProjectStatus(1)
                  } else if (tab === '3') {
                    setProjectStatus(3)
                  } else if (tab === '4') {
                    setProjectStatus(2)
                  }
                  table.onSearch()
                }}>
                <Tabs.Pane
                  label={tabsPaneLabel('全部', proNum.all ? proNum.all : 0)}
                  key="1"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel(
                    '进行中',
                    proNum.ongoing ? proNum.ongoing : 0
                  )}
                  key="2"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel(
                    '已关闭',
                    proNum.closed ? proNum.closed : 0
                  )}
                  key="3"></Tabs.Pane>
                <Tabs.Pane
                  label={tabsPaneLabel(
                    '已挂起',
                    proNum.hangUp ? proNum.hangUp : 0
                  )}
                  key="4"></Tabs.Pane>
              </Tabs>
            </div>
            <div className={styles.areaRight}>
              <div>
                <Input
                  placeholder="按名称筛选"
                  onBlur={(e) => {
                    if (e.target.value !== projectName) {
                      setProjectName(e.target.value)
                      table.onSearch()
                    }
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
                if (tab === '1') {
                  setProjectType('20')
                } else if (tab === '2') {
                  setProjectType('10')
                }
                table.onSearch()
              }}>
              <Tabs.Pane label="所有项目" key="1"></Tabs.Pane>
              <Tabs.Pane label="我的" key="2"></Tabs.Pane>
            </Tabs>
          </div>
          <div className={styles.projectProTable}>
            <ProTable
              // tableHeadHidden={true}
              // tableBackgroundColor="#fff"
              className="proProTable"
              // onCell={() => router.navigate('/projectOverview/333')}
              paginationProps={{ pageSize: 10 }}
              table={table}
              columns={[
                {
                  // title: '头像',
                  key: 'avatar',
                  width: 50,
                  render: (text, _, rowData) => {
                    return (
                      <div className={styles.avatarContainer}>
                        <Avatar
                          size="small"
                          className={styles.listImg}
                          src={
                            rowData?.fileIds !== null && rowData?.fileIds
                              ? rowData?.fileIds[0]
                              : ''
                          }>
                          {rowData?.name[0]}
                        </Avatar>
                      </div>
                    )
                  },
                },
                {
                  // title: '项目名称',
                  key: 'name',
                  render: (text, keyName, rowData) => {
                    return (
                      <div className={styles.projectInfo}>
                        <div className={styles.infoTopBox}>
                          <h2
                            className={styles.projectName}
                            onClick={() =>
                              router.navigate(`/projectOverview/${rowData.id}`)
                            }>
                            nihao /{text}
                          </h2>
                          <span className={styles.projectRole}>管理员</span>
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
                        <div
                          className={styles.projectControlsLI}
                          onClick={(e) => {
                            goSpecifyPage(1, {
                              path: '/project/task',
                              id: rowData.id,
                            })
                          }}>
                          <Tooltip
                            placement="top"
                            content={<strong>任务</strong>}>
                            <div>
                              <Icon type="paper-clip" />
                            </div>
                          </Tooltip>
                          <span className={styles.num}>
                            {rowData?.taskNum || 1}
                          </span>
                        </div>
                        <div
                          className={styles.projectControlsLI}
                          onClick={(e) => {
                            goSpecifyPage(2, { path: '/users', id: rowData.id })
                          }}>
                          <Tooltip
                            placement="top"
                            content={<strong>成员</strong>}>
                            <div>
                              <Icon type="usergroup-add" />
                            </div>
                          </Tooltip>
                          <span className={styles.num}>
                            {rowData?.memberNum || 1}
                          </span>
                        </div>
                        <div
                          className={styles.projectControlsLI}
                          onClick={(e) => {
                            goSpecifyPage(3, {
                              path: '/milestone',
                              id: rowData.id,
                            })
                          }}>
                          <Tooltip
                            placement="top"
                            content={<strong>里程碑</strong>}>
                            <div>
                              <Icon type="coffee" />
                            </div>
                          </Tooltip>
                          <span className={styles.num}>
                            {rowData?.milestoneNum || 1}
                          </span>
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
                        search={table.onSearch}
                      />
                      // </div>
                    )
                  },
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ProjectList

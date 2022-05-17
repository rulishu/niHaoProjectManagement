import { connect } from 'react-redux'
import { useState } from 'react'
import {
  Tabs,
  Divider,
  Button,
  Input,
  Select,
  Icon,
  Avatar,
  Menu,
  Dropdown,
} from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.module.less'

const ProjectList = (props) => {
  // const { dataList } = props.projectlist;
  const { dispatch } = props
  const [projectStatus, setStatus] = useState('')
  const menu = (id) => (
    <div>
      <Menu bordered style={{ minWidth: 120 }}>
        <Menu.Item
          onClick={() => {
            dispatch.global.updataProject({ drawerType: 'edit', id: id })
          }}
          icon="edit"
          text="编辑项目"
        />
        <Menu.Item icon="delete" text="删除项目" />
      </Menu>
    </div>
  )
  let datas = [
    {
      id: 34,
      companyName: '标题',
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
    },
    {
      id: 34,
      companyName: '标题',
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
    },
    {
      id: 34,
      companyName: '标题',
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
    },
  ]
  const table = useTable('/api/project/selectPageList', {
    formatData: (data) => {
      if (datas) {
        return {
          data: datas,
        }
      }
      return {
        total: data?.data?.total,
        data: data?.data?.list,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      console.log(projectStatus)
      return {
        page: pageIndex,
        pageSize: pageSize,
        projectStatus: projectStatus,
      }
    },
    requestOptions: { method: 'POST' },
  })
  return (
    <div>
      <div className={styles.header}>
        <span>项目</span>
        <div>
          <Button
            type="primary"
            onClick={() => {
              dispatch.global.updataProject({ drawerType: 'add' })
            }}>
            新建项目
          </Button>
        </div>
      </div>
      <Divider />
      <div className={styles.tabsDiv}>
        <Tabs
          style={{ padding: '5px' }}
          type="line"
          activeKey="1"
          onTabClick={(tab, key, e) => {
            if (tab === '1') {
              setStatus('')
            } else if (tab === '2') {
              setStatus('1')
            } else if (tab === '3') {
              setStatus('2')
            } else if (tab === '4') {
              setStatus('3')
            }
            table.onSearch()
          }}>
          <Tabs.Pane label="全部" key="1"></Tabs.Pane>
          <Tabs.Pane label="进行中" key="2"></Tabs.Pane>
          <Tabs.Pane label="已完成" key="3"></Tabs.Pane>
          <Tabs.Pane label="已挂起" key="4"></Tabs.Pane>
        </Tabs>
        <div style={{ display: 'flex', lineHeight: '30px' }}>
          <Input
            placeholder="按名称筛选"
            style={{ maxWidth: 200, margin: '10px' }}
          />
          <Select
            style={{ maxWidth: 200, maxHeight: '30px', margin: '10px' }}
            defaultValue="1">
            <Select.Option value="1">名称</Select.Option>
            <Select.Option value="2">Two</Select.Option>
            <Select.Option value="3">Three</Select.Option>
          </Select>
        </div>
      </div>
      <Tabs
        style={{ padding: '5px' }}
        type="line"
        activeKey="1"
        // onTabClick={(tab, key, e) => {}}
      >
        <Tabs.Pane label="所有项目" key="1"></Tabs.Pane>
        <Tabs.Pane label="我的" key="2"></Tabs.Pane>
      </Tabs>
      <ProTable
        paginationProps={{
          pageSize: 10,
        }}
        table={table}
        columns={[
          {
            title: 'ID',
            key: 'id',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            title: '名字',
            key: 'companyName',
            render: (text, keyName, rowData) => {
              return (
                <div>
                  <Avatar
                    size="small"
                    className={styles.listImg}
                    src={
                      rowData?.fileIds !== null && rowData?.fileIds
                        ? rowData?.fileIds[0]
                        : ''
                    }>
                    {text[0]}
                  </Avatar>
                  {text}
                </div>
              )
            },
          },
          {
            title: '开始时间',
            key: 'begin',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            title: '结束时间',
            key: 'end',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            // title: '操作',
            key: 'edit',
            width: 50,
            render: (text, keyName, rowData) => {
              return (
                <div>
                  <Dropdown trigger="click" menu={menu(rowData.id)}>
                    <div>
                      <Icon type="more" />
                    </div>
                  </Dropdown>
                </div>
              )
            },
          },
        ]}
      />
    </div>
  )
}

const mapStateToProps = ({ projectlist }) => ({
  projectlist: projectlist,
})

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)

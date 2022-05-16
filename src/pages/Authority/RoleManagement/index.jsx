import { Fragment, useEffect } from 'react'
import { Button, Switch, Tooltip, Card, Modal } from 'uiw'
import { connect, useDispatch } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import { ProTable, useTable } from '@uiw-admin/components'
import Detail from './Detail'
import Authorization from './Authorization/index'
import DeletePopover from '@/components/DeletePopover'

const Demo = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'rolemanagement/menuTiers',
    })
  }, [dispatch])

  const updateData = (payload) => {
    dispatch({
      type: 'rolemanagement/update',
      payload,
    })
  }

  const table = useTable('/api/managerRole/selectRole', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.list,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (page, pageSize, formData) => {
      return { page, pageSize, ...formData }
    },
    // swr options
    SWRConfiguration: {
      revalidateOnFocus: false,
    },
  })
  // 操作
  async function handleEditTable(type, record) {
    updateData({
      isView: type === 'view',
      tableType: type,
    })
    if (type === 'add') {
      updateData({ drawerVisible: true, queryInfo: {} })
    }
    if (type === 'edit' || type === 'view') {
      updateData({ drawerVisible: true, queryInfo: record })
    }
    if (type === 'del') {
      const result = await dispatch({
        type: 'rolemanagement/deleteRole',
        payload: { id: record?.id },
      })
      result && table.onSearch()
      return result
    }
    if (type === 'authorize') {
      dispatch({
        type: 'rolemanagement/selectListByRoleId',
        payload: { id: record.id },
      })
      updateData({ drawerVisibleAuth: true, queryInfo: record })
    }
  }

  const updateState = (state, listData) => {
    Modal.show({
      title: '提示',
      confirmText: '确定',
      cancelText: '取消',
      children: `确认要${state ? '启用' : '禁用'}"${listData.name}"角色吗?`,
      onConfirm: async () => {
        await props.dispatch.upDateStatusRole({
          status: state ? 0 : 1,
          id: listData.id,
        })
      },
      onCancel: () => table.onSearch(),
    })
    // await props.dispatch.upDateStatusRole({
    //   status: state ? 0 : 1,
    //   id: listData.id,
    // })
  }

  return (
    <Fragment>
      <Card>
        <ProTable
          // 操作栏按钮
          operateButtons={[
            {
              label: '新增',
              type: 'primary',
              onClick: () => {
                handleEditTable('add', {})
              },
            },
          ]}
          // 搜索栏按钮
          searchBtns={[
            {
              label: '查询',
              type: 'primary',
              onClick: () => {
                table.onSearch()
              },
            },
            {
              label: '重置',
              onClick: () => {
                table.onReset()
              },
            },
          ]}
          // rowSelection={{
          //   // 多选 checkbox 单选radio
          //   type: 'checkbox',
          //   // 选中的键名 column里的key
          //   selectKey: 'name',
          //   // 默认值
          //   defaultSelected: [''],
          // }}
          table={table}
          columns={[
            {
              title: '角色编号',
              key: 'id',
            },
            {
              title: '角色名称',
              key: 'name',
              props: {
                widget: 'input',
                widgetProps: {
                  placeholder: '请输入角色名称',
                },
              },
            },
            {
              title: '备注',
              key: 'desc',
              ellipsis: true,
              render: (desc) => (
                <Tooltip placement="topLeft" content={desc}>
                  {desc}
                </Tooltip>
              ),
            },
            {
              title: '状态',
              key: 'status',
              props: {
                widget: 'select',
                option: [
                  { label: '禁用', value: 1 },
                  { label: '启用', value: 0 },
                ],
              },
              render: (text, key, rowData) => (
                <Switch
                  disabled={rowData.hasUser}
                  checked={rowData.status === 0}
                  onChange={(even) => {
                    updateState(even.target.checked, rowData)
                  }}
                  data-checked="禁用"
                  data-unchecked="启用"></Switch>
              ),
            },
            {
              title: '操作',
              key: 'edit',
              width: 200,
              render: (text, key, rowData) => (
                <div>
                  <AuthBtn path="/api/managerRole/addMenu">
                    <Button
                      size="small"
                      type="primary"
                      onClick={handleEditTable.bind(
                        this,
                        'authorize',
                        rowData
                      )}>
                      授权
                    </Button>
                  </AuthBtn>
                  <AuthBtn path="/api/managerRole/upDateRole">
                    <Button
                      size="small"
                      type="primary"
                      onClick={handleEditTable.bind(this, 'edit', rowData)}>
                      编辑
                    </Button>
                  </AuthBtn>
                  <AuthBtn path="/api/managerRole/selectRole">
                    <Button
                      size="small"
                      type="success"
                      onClick={handleEditTable.bind(this, 'view', rowData)}>
                      查看
                    </Button>
                  </AuthBtn>
                  <AuthBtn path="/api/managerRole/deleteRole">
                    {rowData.hasUser ? (
                      <Tooltip
                        placement="left"
                        content="此角色下存在成员，请先将成员转移到其他角色下再操作">
                        <Button
                          size="small"
                          type="danger"
                          // disabled={rowData.hasUser}
                        >
                          删除
                        </Button>
                      </Tooltip>
                    ) : (
                      <DeletePopover
                        disabled={rowData.hasUser}
                        handleEditTable={() => handleEditTable('del', rowData)}
                      />
                    )}
                  </AuthBtn>
                </div>
              ),
            },
          ]}
        />
      </Card>
      <Detail updateData={updateData} onSearch={table.onSearch} />
      <Authorization updateData={updateData} />
    </Fragment>
  )
}

const mapStateToProps = ({ rolemanagement }) => ({
  rolemanagement: rolemanagement,
})

const mapDispatchToProps = ({ rolemanagement }) => ({
  dispatch: rolemanagement,
})

export default connect(mapStateToProps, mapDispatchToProps)(Demo)

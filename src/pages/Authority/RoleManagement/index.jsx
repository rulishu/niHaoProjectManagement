import { Fragment, useEffect } from 'react'
import { Button, Tag, Tooltip, Card } from 'uiw'
import { connect, useDispatch } from 'react-redux'
// import { AuthBtn } from '@uiw-admin/authorized'
import { ProTable, useTable } from '@uiw-admin/components'
import Detail from './Detail'
// import Authorization from './Authorization/index'
import DeletePopover from '@/components/DeletePopover'
import { changeTime } from '@/utils/timeDistance'
import { searchFun } from '@/utils/publicFun'
import { useSelector } from 'react-redux'

const Demo = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'rolemanagement/getTreeSelect',
    })
  }, [dispatch])

  const {
    rolemanagement: { isOpen, ids },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'rolemanagement/update',
      payload,
    })
  }
  const token = localStorage.getItem('token')
  const table = useTable('/api/system/role/listToken', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.total,
        data: data?.rows,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (page, pageSize, formData) => {
      console.log('formData===>', formData)
      return {
        page,
        pageSize,
        roleKey: formData.roleKey,
        roleName: formData.roleName,
        status: formData.status,
        params: {
          beginTime: changeTime(formData.createTime?.at(0))?.trim(),
          endTime: changeTime(formData.createTime?.at(1))?.trim(),
        },
      }
    },
    // swr options
    SWRConfiguration: {
      revalidateOnFocus: false,
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  // 操作
  async function handleEditTable(type, record) {
    // if (record.roleKey === 'admin') {
    //   Notify.warning({
    //     title: '警告通知',
    //     description: '超级管理员角色不允许操作',
    //   })
    //   return
    // }
    updateData({
      isView: type === 'view',
      tableType: type,
      tablePro: table,
    })
    if (type === 'add') {
      updateData({ drawerVisible: true, queryInfo: {}, checkedKeys: [] })
    }
    if (type === 'edit' || type === 'view') {
      // dispatch({
      //   type: 'rolemanagement/getInfo',
      //   payload: {id:record?.roleId},
      // })
      dispatch({
        type: 'rolemanagement/roleMenuTreeselect',
        payload: record?.roleId,
      })
      updateData({ drawerVisible: true, queryInfo: record })
    }
    if (type === 'del') {
      updateData({ isOpen: true, ids: [record.roleId] })

      // const result = await dispatch({
      //   type: 'rolemanagement/getDelete',
      //   payload: { ids: [record.roleId] },
      // })
      // result && table.onSearch()
      // return result
    }
    // if (type === 'authorize') {
    //   dispatch({
    //     type: 'rolemanagement/selectListByRoleId',
    //     payload: { id: record?.roleId },
    //   })
    //   updateData({ drawerVisibleAuth: true, queryInfo: record })
    // }
  }

  // const updateState = (state, rowData) => {
  //   Modal.show({
  //     title: '提示',
  //     confirmText: '确定',
  //     cancelText: '取消',
  //     children: `确认要${state ? '"启用"' : '"停用"'}"${
  //       rowData.roleName
  //     }"角色吗?`,
  //     onConfirm: async () => {
  //       await props.dispatch.changeStatus({
  //         status: state ? 0 : 1,
  //         roleId: rowData.roleId,
  //       })
  //     },
  //     onCancel: () => table.onSearch(),
  //   })
  //   // await props.dispatch.upDateStatusRole({
  //   //   status: state ? 0 : 1,
  //   //   id: listData.id,
  //   // })
  // }
  const onConfirm = () => {
    dispatch({
      type: 'rolemanagement/getDelete',
      payload: { ids: ids },
    })
  }
  const onClosed = () => {
    updateData({ isOpen: false })
  }
  return (
    <Fragment>
      <Card>
        <DeletePopover
          isOpen={isOpen}
          onConfirm={() => onConfirm()}
          onClosed={() => onClosed()}
        />
        <ProTable
          // 操作栏按钮
          operateButtons={[
            {
              label: '新增',
              type: 'primary',
              icon: 'plus',
              onClick: () => {
                handleEditTable('add', {})
              },
            },
          ]}
          // 搜索栏按钮
          searchBtns={searchFun(table)}
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
              key: 'roleId',
              align: 'center',
              ellipsis: true,
            },
            {
              title: '角色名称',
              key: 'roleName',
              align: 'center',
              ellipsis: true,
              props: {
                widget: 'input',
                widgetProps: {
                  placeholder: '请输入角色名称',
                },
              },
            },
            {
              title: '权限字符',
              key: 'roleKey',
              align: 'center',
              ellipsis: true,
              props: {
                widget: 'input',
                widgetProps: {
                  placeholder: '请输入权限字符',
                },
              },
            },
            {
              title: '显示顺序',
              key: 'roleSort',
              align: 'center',
              ellipsis: true,
            },
            {
              title: '状态',
              key: 'status',
              align: 'center',
              ellipsis: true,
              props: {
                widget: 'select',
                option: [
                  { label: '停用', value: '1' },
                  { label: '正常', value: '0' },
                ],
              },
              render: (text) => (
                <div>
                  {text === '1' ? (
                    <Tag light color="#dc3545">
                      停用
                    </Tag>
                  ) : (
                    <Tag light color="#28a745">
                      正常
                    </Tag>
                  )}
                </div>
              ),
            },
            {
              title: '创建时间',
              key: 'createTime',
              align: 'center',
              ellipsis: true,
              props: {
                // label: '进入时间-离开时间',
                widget: 'dateInputRange',
                format: 'YYYY-MM-DD',
              },
            },
            {
              title: '操作',
              key: 'edit',
              align: 'center',
              width: 200,
              render: (text, key, rowData) => (
                <div>
                  {/* <AuthBtn path="/api/managerRole/addMenu">
                  <Button
                    size="small"
                    type="primary"
                    onClick={handleEditTable.bind(this, 'authorize', rowData)}>
                    授权
                  </Button>
                  </AuthBtn> */}
                  {/* <AuthBtn path="/api/managerRole/upDateRole"> */}
                  <Button
                    size="small"
                    type="primary"
                    icon="edit"
                    disabled={rowData.roleKey === 'admin' ? true : false}
                    onClick={handleEditTable.bind(this, 'edit', rowData)}>
                    编辑
                  </Button>
                  {rowData.hasUser ? (
                    <Tooltip
                      placement="left"
                      content="此角色下存在成员，请先将成员转移到其他角色下再操作">
                      <Button
                        size="small"
                        type="danger"
                        icon="delete"
                        // disabled={rowData.hasUser}
                      >
                        删除
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      size="small"
                      type="danger"
                      icon="delete"
                      disabled={
                        rowData.hasUser || rowData.roleKey === 'admin'
                          ? true
                          : false
                      }
                      onClick={() => handleEditTable('del', rowData)}>
                      删除
                    </Button>
                  )}
                  {/* </AuthBtn> */}
                </div>
              ),
            },
          ]}
        />
      </Card>
      <Detail updateData={updateData} onSearch={table.onSearch} />
      {/* <Authorization updateData={updateData} /> */}
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

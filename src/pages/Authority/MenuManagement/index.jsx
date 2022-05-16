import { Fragment } from 'react'
import { Button, Tooltip } from 'uiw'
import { useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import Detail from './Detail'
import DeletePopover from '@/components/DeletePopover'
import './style.css'

const Demo = () => {
  const dispatch = useDispatch()

  const updateData = (payload) => {
    dispatch({
      type: 'menumanagement/update',
      payload,
    })
  }

  const table = useTable('/api/menu/queryByPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.list,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (page, pageSize, formData) => {
      return { ...formData }
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
    if (type === 'addChild') {
      updateData({ drawerVisible: true, queryInfo: { parentId: record?.id } })
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
      updateData({ drawerVisibleAuth: true })
    }
  }

  return (
    <Fragment>
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
        className="menuTable"
        table={table}
        // data={dataSource}
        columns={[
          {
            title: '菜单名称',
            key: 'menuName',
            width: 220,
            props: {
              widget: 'input',
              widgetProps: {
                placeholder: '请输入菜单名称',
              },
            },
          },
          {
            title: '菜单图标',
            key: 'icon',
            ellipsis: true,
          },
          {
            title: '路由地址',
            key: 'path',
            ellipsis: true,
            render: (address) => (
              <Tooltip placement="topLeft" content={address}>
                {address}
              </Tooltip>
            ),
          },
          {
            title: '菜单类型',
            key: 'menuType',
            ellipsis: true,
          },
          {
            title: '排序',
            key: 'orderNum',
            ellipsis: true,
          },
          // {
          //   title: '创建人',
          //   key: 'createName',
          //   ellipsis: true,
          //   align: 'center',
          // },
          // {
          //   title: '创建时间',
          //   key: 'createTime',
          //   ellipsis: true,
          //   align: 'center',
          // },
          {
            title: '操作',
            key: 'edit',
            width: 200,
            render: (text, key, rowData) => {
              return (
                <div>
                  <Button
                    size="small"
                    type="primary"
                    onClick={handleEditTable.bind(this, 'addChild', rowData)}>
                    添加下级
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={handleEditTable.bind(this, 'edit', rowData)}>
                    编辑
                  </Button>
                  <Button
                    size="small"
                    type="success"
                    onClick={handleEditTable.bind(this, 'view', rowData)}>
                    查看
                  </Button>
                  <DeletePopover
                    handleEditTable={() => handleEditTable('del', rowData)}
                  />
                </div>
              )
            },
          },
        ]}
      />
      <Detail updateData={updateData} onSearch={table.onSearch} />
    </Fragment>
  )
}

export default Demo

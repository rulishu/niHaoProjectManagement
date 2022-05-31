import { Fragment, useEffect } from 'react'
import { Button, Tag, Card } from 'uiw'
import { useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import Detail from './Detail'
import DeletePopover from '@/components/DeletePopover'
import './style.css'

const Demo = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: 'menumanagement/getList',
    })
  }, [dispatch])

  const updateData = (payload) => {
    dispatch({
      type: 'menumanagement/update',
      payload,
    })
  }
  const token = localStorage.getItem('token')
  const table = useTable('/api/system/menu/list', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        // total: data?.data?.total,
        data: handleTree(data?.data || [], 'menuId') || [],
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
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  // 操作
  async function handleEditTable(type, record) {
    updateData({
      isView: type === 'view',
      tableType: type,
      tablePro: table,
    })
    if (type === 'add') {
      updateData({ drawerVisible: true, queryInfo: {} })
    }
    if (type === 'addChild') {
      updateData({
        drawerVisible: true,
        queryInfo: { parentId: record?.menuId },
      })
    }
    if (type === 'edit' || type === 'view') {
      // dispatch({
      //   type: 'menumanagement/getList',
      // })
      updateData({ drawerVisible: true, queryInfo: record })
    }
    if (type === 'del') {
      const result = await dispatch({
        type: 'menumanagement/getDelete',
        payload: record?.menuId,
      })
      result && table.onSearch()
      return result
    }
    if (type === 'authorize') {
      updateData({ drawerVisibleAuth: true })
    }
  }

  //构造树型结构数据
  function handleTree(data, id, parentId, children) {
    let config = {
      id: id || 'id',
      parentId: parentId || 'parentId',
      childrenList: children || 'children',
    }

    let childrenListMap = {}
    let nodeIds = {}
    let tree = []

    for (let d of data) {
      let parentId = d[config.parentId]
      if (childrenListMap[parentId] == null) {
        childrenListMap[parentId] = []
      }
      nodeIds[d[config.id]] = d
      childrenListMap[parentId].push(d)
    }

    for (let d of data) {
      let parentId = d[config.parentId]
      if (nodeIds[parentId] == null) {
        tree.push(d)
      }
    }

    for (let t of tree) {
      adaptToChildrenList(t)
    }

    function adaptToChildrenList(o) {
      if (childrenListMap[o[config.id]] !== null) {
        o[config.childrenList] = childrenListMap[o[config.id]]
      }
      if (o[config.childrenList]) {
        for (let c of o[config.childrenList]) {
          adaptToChildrenList(c)
        }
      }
    }
    return tree
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
          className="menuTable"
          table={table}
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
              title: '排序',
              key: 'orderNum',
              ellipsis: true,
            },
            {
              title: '权限标识',
              key: 'perms',
              ellipsis: true,
            },
            {
              title: '组件路径',
              key: 'component',
              ellipsis: true,
            },
            {
              title: '状态',
              key: 'status',
              ellipsis: true,
              props: {
                widget: 'select',
                option: [
                  { label: '停用', value: '1' },
                  { label: '正常', value: '0' },
                ],
              },
              render: (text) => {
                return (
                  <div>
                    {text === 1 ? (
                      <Tag light color="#dc3545">
                        停用
                      </Tag>
                    ) : (
                      <Tag light color="#28a745">
                        正常
                      </Tag>
                    )}
                  </div>
                )
              },
            },
            {
              title: '创建时间',
              key: 'createTime',
              ellipsis: true,
            },
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
                      新增
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      onClick={handleEditTable.bind(this, 'edit', rowData)}>
                      编辑
                    </Button>
                    {/* <Button
                  size="small"
                  type="success"
                  onClick={handleEditTable.bind(this, 'view', rowData)}>
                  查看
                </Button> */}
                    <DeletePopover
                      handleEditTable={() => handleEditTable('del', rowData)}
                    />
                  </div>
                )
              },
            },
          ]}
        />
        <Detail
          updateData={updateData}
          handleTree={handleTree}
          onSearch={table.onSearch}
        />
      </Card>
    </Fragment>
  )
}

export default Demo

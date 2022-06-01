import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Alert, Empty, Tag } from 'uiw'

export default function TabelView() {
  const {
    department: {
      dataSource,
      alertVisible,
      // alertDept,
    },
  } = useSelector((state) => state)
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
  const deptData = handleTree(dataSource || [], 'deptId') || []
  // // 层级遍历
  // const getChildrenDepart = function (data, root) {
  //   let children = []
  //   for (let i = 0; i < data.length; i++) {
  //     if (root === data[i].parentId) {
  //       data[i].children = getChildrenDepart(data, data[i].deptId)
  //       children.push(data[i])
  //     }
  //   }
  //   return children
  // }
  // const dataSourceTreeData = dataSource?.map((code) => ({
  //   ...code,
  //   label: code.deptName,
  //   key: code.parentId,
  // }))
  // const arrSource = getChildrenDepart(dataSourceTreeData, 0) || []
  // const treeData = dataSourceTreeData?.map((e) => e.status === '1')
  const [iterm, setIterm] = useState({})
  const dispatch = useDispatch()
  //   新增
  const onOpen = () => {
    dispatch({
      type: 'department/updateState',
      payload: {
        drawerVisibleText: 'add',
        drawerVisible: true,
        allEditData: {},
      },
    })
  }
  // 删除
  const onDelete = (other, e) => {
    dispatch({
      type: 'department/updateState',
      payload: {
        alertVisible: true,
      },
    })
    // dispatch({
    //   type: 'department/judge',
    //   payload: {
    //     id: other.id,
    //   },
    // })
    setIterm(other)
    e.stopPropagation()
  }
  //   编辑
  const onEdit = (editData, e) => {
    dispatch({
      type: 'department/updateState',
      payload: {
        drawerVisibleText: 'edit',
        drawerVisible: true,
        allEditData: editData,
      },
    })
    dispatch({
      type: 'department/getInfoData',
      payload: {
        editData,
      },
    })
    //
    e.stopPropagation()
  }
  const columns = [
    {
      title: '部门名称',
      key: 'deptName',
    },
    {
      title: '排序',
      key: 'orderNum',
    },
    {
      title: '负责人',
      key: 'leader',
    },
    {
      title: '联系电话',
      key: 'phone',
    },
    {
      title: '邮箱',
      key: 'email',
    },
    {
      title: '部门状态',
      key: 'status',
      props: {
        widget: 'select',
        option: [
          { label: '正常', value: 0 },
          { label: '停用', value: 1 },
        ],
        // widgetProps: {
        //   placeholder: '请输入设备状态',
        // },
      },
      render: (code) => {
        return (
          // <div>
          //   <Badge color={code === '0' ? '#28a745' : '#c2c2c2'} />
          //   {code === '0' ? '正常' : '停用'}
          // </div>
          <div>
            {code === '1' ? (
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
      title: '操作',
      key: 'edit',
      width: 98,
      render: (...other) => {
        const editData = other[2]
        return (
          <div>
            <Button
              size="small"
              type="success"
              onClick={(e) => onEdit(editData, e)}>
              编辑
            </Button>
            <Button
              size="small"
              type="danger"
              onClick={(e) => onDelete(editData, e)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]
  const onClose = () => {
    dispatch({
      type: 'department/updateState',
      payload: {
        alertVisible: false,
      },
    })
  }
  return (
    <div style={{ marginTop: 10, backgroundColor: '#fff', borderRadius: 5 }}>
      <Button
        icon="plus"
        type="primary"
        style={{ margin: 10 }}
        onClick={() => onOpen()}>
        新增
      </Button>
      <Alert
        isOpen={alertVisible}
        confirmText="确认"
        onClosed={() => onClose()}
        type="danger"
        content={'是否确认删除该部门！'}
        onConfirm={() => {
          dispatch({
            type: 'department/getDelete',
            payload: {
              id: iterm.deptId,
            },
          })
        }}></Alert>
      <Table
        // bordered
        rowKey="deptId"
        columns={columns}
        // data={treeData.includes(false) ? arrSource : dataSourceTreeData}
        data={deptData}
        footer={
          // arrSource.length || dataSourceTreeData.length > 0 ? '' : <Empty />
          deptData.length > 0 ? '' : <Empty />
        }
      />
    </div>
  )
}

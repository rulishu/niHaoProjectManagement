import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Alert, Empty, Badge } from 'uiw' // Pagination,Loader, Icon,

export default function TabelView() {
  const {
    department: {
      dataSource,
      // Loading,
      // pageSize,
      // page,
      alertVisible,
      alertDept,
    },
  } = useSelector((state) => state)
  // 层级遍历
  const getChildrenDepart = function (data, root) {
    let children = []
    for (let i = 0; i < data.length; i++) {
      if (root === data[i].parentId) {
        data[i].children = getChildrenDepart(data, data[i].deptId)
        children.push(data[i])
      }
    }
    return children
  }
  const dataSourceTreeData = dataSource?.map((code) => ({
    ...code,
    label: code.deptName,
    key: code.parentId,
  }))
  const arrSource = getChildrenDepart(dataSourceTreeData, 0) || []
  const treeData = dataSourceTreeData?.map((e) => e.status === '1')
  const [iterm, setIterm] = useState({})
  const dispatch = useDispatch()
  // const [childArr, setChildArr] = useState([]);
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
    dispatch({
      type: 'department/judge',
      payload: {
        id: other.id,
      },
    })
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
  // 翻页
  // const PaginationChange = async (page: number, pageSize: number) => {
  //   await dispatch({
  //     type: "department/updateState",
  //     payload: { page: page, pageSize: pageSize },
  //   });
  //   await dispatch({
  //     type: "department/getList",
  //   });
  // };
  const columns = [
    // {
    //   title: '部门ID',
    //   key: 'deptId',
    // },
    {
      title: '部门名称',
      key: 'deptName',
    },
    // {
    //   title: '祖级列表',
    //   key: 'ancestors',
    //   render: (code) => {
    //     console.log(code)
    //     const dataSourceText = dataSource?.map(code=>)
    //     return (
    //       <div>
    //         {code === '0' ? '正常' : '停用'}
    //       </div>
    //     )
    //   },
    // },
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
        widgetProps: {
          placeholder: '请输入设备状态',
        },
      },
      render: (code) => {
        return (
          <div>
            <Badge color={code === '0' ? '#28a745' : '#c2c2c2'} />
            {code === '0' ? '正常' : '停用'}
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
        content={
          alertDept
            ? '该部门存在下级部门, 请先删除下级部门'
            : '是否确认删除该部门！'
        }
        onConfirm={() => {
          if (alertDept) {
            onClose()
          } else {
            dispatch({
              type: 'department/getDelete',
              payload: {
                id: iterm.id,
              },
            })
          }
        }}></Alert>
      {/* <Loader
        vertical
        color="#23252b"
        tip="数据加载中..."
        indicator={
          <Icon
            type="loading"
            spin={true}
            style={{ verticalAlign: "text-top" }}
          />
        }
        style={{ width: "100%" }}
        loading={Loading}
      > */}
      <Table
        bordered
        rowKey="deptId"
        columns={columns}
        data={treeData.includes(false) ? arrSource : dataSourceTreeData}
        footer={
          arrSource.length || dataSourceTreeData.length > 0 ? (
            ''
          ) : (
            // <Pagination
            //   current={page}
            //   pageSize={pageSize}
            //   total={total}
            //   divider
            //   onChange={(...other) => PaginationChange(other[0], other[2])} //
            // />
            <Empty />
          )
        }
      />
      {/* </Loader> */}
    </div>
  )
}

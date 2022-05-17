import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Alert, Empty } from 'uiw' // Pagination,Loader, Icon,

export default function TabelView() {
  const {
    department: {
      dataSource,
      // Loading,
      total,
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
      if (root === data[i].pid) {
        data[i].children = getChildrenDepart(data, data[i].id)
        children.push(data[i])
      }
    }
    return children
  }
  const dataSourceTreeData = dataSource?.map((code) => ({
    ...code,
    label: code.fullName,
    key: code.id,
  }))
  const arrSource = getChildrenDepart(dataSourceTreeData, 0)
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
    {
      title: 'id',
      key: 'id',
    },
    {
      title: '部门简称',
      key: 'simpleName',
    },
    {
      title: '部门全称',
      key: 'fullName',
    },
    {
      title: '排序',
      key: 'num',
    },
    {
      title: '备注',
      key: 'tips',
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
        icon="plus-circle-o"
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
        rowKey="id"
        columns={columns}
        data={arrSource}
        footer={
          total > 0 ? (
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

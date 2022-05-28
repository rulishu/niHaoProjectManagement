import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
import { columnsSearch } from './items'
import { Card } from 'uiw'
import Drawer from '../Drawer/index'
// import Modal from '../Modals/index'
import { useParams } from 'react-router-dom'

const Search = () => {
  const dispatch = useDispatch()
  const updateData = (payload) => {
    dispatch({
      type: 'departmentRefactor/updateState',
      payload,
    })
  }
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
  const { projectId } = useParams()
  const token = localStorage.getItem('token')
  const search = useTable('/api/system/dept/listToken', {
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: 10,
        projectId: projectId,
        ...searchValues,
      }
    },
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      const dataSource = data?.data
      const dataSourceTreeData = dataSource?.map((code) => ({
        ...code,
        label: code.deptName,
        key: code.parentId,
      }))
      const arrSource = getChildrenDepart(dataSourceTreeData, 0) || []
      const treeData = dataSourceTreeData?.map((e) => e.status === '1')

      updateData({
        dataSource: data?.data,
        arrSource: arrSource,
        dataSourceTreeData: dataSourceTreeData,
      })
      return {
        total: data?.data?.total,
        data: treeData.includes(false) ? arrSource : dataSourceTreeData,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  // 操作
  function handleEditTable(type, obj) {
    updateData({
      tableType: type,
    })
    if (type === 'add') {
      updateData({
        drawerVisible: true,
        queryInfo: {},
      })
    }
    if (type === 'edit') {
      updateData({
        drawerVisible: true,
        queryInfo: obj,
      })
    }
    if (type === 'del') {
      updateData({
        delectVisible: true,
        id: obj?.id,
      })
    }
  }
  return (
    <Fragment>
      <Card>
        <ProTable
          searchBtns={[
            {
              label: '查询',
              type: 'primary',
              htmlType: 'submit',
              onClick: () => search.onSearch(),
              icon: 'search',
            },
            {
              label: '重置',
              onClick: () => search?.onReset(),
              icon: 'reload',
            },
          ]}
          paginationProps={{
            pageSizeOptions: [10, 20, 30],
            pageSize: 10,
          }}
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
          table={search}
          columns={columnsSearch(handleEditTable)}
        />
      </Card>

      <Drawer updateData={updateData} onSearch={search.onSearch} />
      {/* <Modal onSearch={search.onSearch} />  */}
    </Fragment>
  )
}

export default Search

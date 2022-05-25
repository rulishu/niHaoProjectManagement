import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
import { columnsSearch } from './items'
import { Card } from 'uiw'
import Drawer from '../Drawer/index'
import Modal from '../Modals/index'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Search = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: 'routeManagement/getInfo',
      payload: {
        callback: '',
      },
    })
  }, [dispatch])
  const {
    routeManagement: { userInfo },
  } = useSelector((state) => state)
  const updateData = (payload) => {
    dispatch({
      type: 'usersManagement/updateState',
      payload,
    })
  }
  const { projectId } = useParams()
  const token = localStorage.getItem('token')

  const search = useTable('/api/member/selectProjectMember', {
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
      return {
        total: data?.data?.total,
        data: data?.data?.rows || [],
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
    if (type === 'member' || type === 'group') {
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
        userId: obj?.userId,
        projectId: obj?.projectId,
      })
    }
  }
  return (
    <Fragment>
      <Card>
        {/* <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 20,
          }}>
          <Button
            size="big"
            type="primary"
            icon="user-add"
            onClick={() => handleEditTable('member')}>
            邀请成员
          </Button>
          <Button
            size="big"
            icon="usergroup-add"
            type="primary"
            onClick={() => handleEditTable('group')}>
            邀请团队
          </Button>
        </div> */}
        <ProTable
          formCol={2}
          searchBtns={[
            {
              label: '邀请成员',
              htmlType: 'submit',
              type: 'primary',
              onClick: () => handleEditTable('member'),
              icon: 'user-add',
            },
            {
              label: '邀请团队',
              htmlType: 'submit',
              type: 'primary',
              onClick: () => handleEditTable('group'),
              icon: 'usergroup-add',
            },
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
            // pageSizeOptions: [10, 20, 30],
            pageSize: 10,
          }}
          table={search}
          columns={columnsSearch(handleEditTable, userInfo)}
        />
      </Card>

      <Drawer updateData={updateData} onSearch={search.onSearch} />
      <Modal onSearch={search.onSearch} />
    </Fragment>
  )
}

export default Search

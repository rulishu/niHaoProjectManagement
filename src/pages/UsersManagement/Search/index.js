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
  const { projectId } = useParams()
  useEffect(() => {
    dispatch({
      type: 'routeManagement/getInfo',
      payload: {
        callback: '',
      },
    })
    dispatch({
      type: 'routeManagement/queryFuzzyAllProjectMember',
      payload: {
        projectId: projectId,
      },
    })
  }, [dispatch, projectId])
  const {
    routeManagement: { userInfo, dataUser },
    projectlist: { userRole },
  } = useSelector((state) => state)
  const updateData = (payload) => {
    dispatch({
      type: 'usersManagement/updateState',
      payload,
    })
  }
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
        total: data?.data?.total || 0,
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
        type: 'del',
        userId: obj?.userId,
        projectId: obj?.projectId,
      })
    }
    if (type === 'out') {
      updateData({
        delectVisible: true,
        userId: obj?.userId,
        type: 'out',
        projectId: obj?.projectId,
      })
    }
  }
  //权限设置:仅项目管理者可以邀请/编辑删除
  let data = dataUser?.filter(function (item) {
    return item.memberName === userInfo
  })
  const memberRoles = data.map((a) => a.memberRole)
  //超级管理员权限
  const own = localStorage.getItem('key')
  return (
    <Fragment>
      <Card>
        <ProTable
          formCol={4}
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
          operateButtons={[
            {
              label: '邀请成员',
              htmlType: 'submit',
              disabled:
                own === 'false' && Number(memberRoles) !== 3 ? true : false,
              type: 'primary',
              onClick: () => handleEditTable('member'),
              icon: 'user-add',
            },
            {
              label: '邀请团队',
              htmlType: 'submit',
              disabled:
                own === 'false' && Number(memberRoles) !== 3 ? true : false,
              type: 'primary',
              onClick: () => handleEditTable('group'),
              icon: 'usergroup-add',
            },
          ]}
          paginationProps={{
            // pageSizeOptions: [10, 20, 30],
            pageSize: 10,
          }}
          table={search}
          columns={columnsSearch(
            handleEditTable,
            userInfo,
            userRole,
            memberRoles,
            own
          )}
        />
      </Card>

      <Drawer updateData={updateData} onSearch={search.onSearch} />
      <Modal onSearch={search.onSearch} />
    </Fragment>
  )
}

export default Search

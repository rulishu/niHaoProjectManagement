import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Card, Tooltip } from 'uiw'
import { useParams } from 'react-router-dom'
import { ProTable, useTable } from '@uiw-admin/components'
import { searchFun } from '@/utils/publicFun'
import MaintainGroup from './Drawer/maintainGroup'
import Drawer from './Drawer'
import operateFun from '@/components/Operate'

export default function Index() {
  const dispatch = useDispatch()
  const {
    team: { alertShow, id },
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch.rolemanagement?.getAllDepartment()
  }, [dispatch])

  const token = localStorage.getItem('token')
  const { projectId } = useParams()
  const table = useTable('/api/ManagerTeam/selectPage', {
    formatData: (data) => {
      return {
        total: data?.data?.total || 0,
        data: data?.data?.rows || [],
      }
    },
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
        projectId: projectId,
        ...searchValues,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const onOpenDelete = (data) => {
    dispatch({
      type: 'team/updateState',
      payload: {
        alertShow: true,
        id: data,
        tablePro: table,
        queryInfo: {},
      },
    })
  }
  const onOpenUser = (data) => {
    dispatch({
      type: 'team/updateState',
      payload: {
        isUsers: true,
        queryInfo: data,
        tablePro: table,
        teamId: data.id,
      },
    })
    dispatch({
      type: 'team/getMembers',
      payload: { teamId: data.id },
    })
    dispatch({
      type: 'team/getNotTeamUsers',
    })
  }
  const setCloseDrawerVisible = () => {
    dispatch({
      type: 'team/updateState',
      payload: {
        alertShow: false,
      },
    })
  }

  const onOpenEdit = (data) => {
    dispatch({
      type: 'team/updateState',
      payload: {
        drawerType: 'edit',
        drawerVisible: true,
        tablePro: table,
        queryInfo: data,
      },
    })
  }
  return (
    <Fragment>
      <MaintainGroup />
      <Card>
        <Modal
          title="删除提示"
          isOpen={alertShow}
          confirmText="确定"
          cancelText="取消"
          icon="information"
          type="danger"
          onConfirm={() => {
            dispatch({
              type: 'team/deleteTeamById',
              payload: [
                {
                  id: id,
                },
              ],
            })
          }}
          onCancel={() => setCloseDrawerVisible()}
          onClosed={() => setCloseDrawerVisible()}>
          <p>确认删除该条数据吗?</p>
        </Modal>
        <ProTable
          table={table}
          searchBtns={searchFun(table)}
          operateButtons={[
            {
              label: '新增',
              icon: 'plus',
              type: 'primary',
              onClick: () => {
                dispatch({
                  type: 'team/updateState',
                  payload: {
                    drawerType: 'add',
                    drawerVisible: true,
                    tablePro: table,
                    queryInfo: {},
                  },
                })
              },
            },
          ]}
          columns={[
            {
              title: '团队名',
              key: 'teamName',
              props: {
                widget: 'input',
                // 组件属性
                widgetProps: {
                  placeholder: '输入团队名',
                },
              },
              align: 'center',
            },
            // {
            //   title: '创建人',
            //   key: 'createName',
            //   align: 'center',
            // },
            {
              title: '团队描述',
              key: 'teamDes',
              align: 'center',
            },
            {
              title: '团队用户',
              key: 'teamUserNameSplice',
              align: 'center',
              width: 250,
              ellipsis: true,
              render: (address) => (
                <div
                  style={{
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  <Tooltip placement="leftTop" content={address}>
                    <span>{address || ''}</span>
                  </Tooltip>
                </div>
              ),
            },
            {
              title: '创建时间',
              key: 'createTime',
              align: 'center',
            },
            {
              title: '更新人',
              key: 'updateName',
              align: 'center',
            },
            {
              title: '更新时间',
              key: 'updateTime',
              align: 'center',
            },
            {
              title: '操作',
              key: 'edit',
              align: 'center',
              width: 250,
              render: (_, record, data) =>
                operateFun({
                  onUser: () => onOpenUser(data),
                  onEvenEdit: () => onOpenEdit(data),
                  onEvenDelete: () => onOpenDelete(data.id),
                }),
            },
          ]}
        />
        <Drawer />
      </Card>
    </Fragment>
  )
}

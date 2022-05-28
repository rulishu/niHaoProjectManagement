import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Card } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { searchFun } from '@/utils/publicFun'
import Drawer from './Drawer'
import operateFun from '@/components/Operate'

export default function Index() {
  const dispatch = useDispatch()

  const {
    team: { alertShow, ids },
  } = useSelector((state) => state)

  const token = localStorage.getItem('token')
  console.log('token--->', token)
  const table = useTable('/api/ManagerTeam/selectPage', {
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data.rows || [],
      }
    },
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
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
        ids: data,
        tablePro: table,
        queryInfo: {},
      },
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
      <Card>
        <Alert
          isOpen={alertShow}
          confirmText="确认"
          onClosed={() => setCloseDrawerVisible()}
          type="danger"
          content={`是否确认删除本条数据！`}
          onConfirm={() => {
            dispatch({
              type: 'team/deleteTeamById',
              payload: {
                id: [ids],
              },
            })
          }}></Alert>
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
            {
              title: '创建人',
              key: 'createName',
              align: 'center',
            },
            {
              title: '更新人',
              key: 'updateName',
              align: 'center',
            },
            {
              title: '团队用户列表',
              key: 'teamUserList',
              align: 'center',
            },
            {
              title: '团队用户',
              key: 'teamUserNameSplice',
              align: 'center',
            },
            {
              title: '创建时间',
              key: 'createTime',
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
              width: 200,
              render: (_, record, data) =>
                operateFun({
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

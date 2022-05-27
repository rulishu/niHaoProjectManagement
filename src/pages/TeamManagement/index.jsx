import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Card } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { searchFun } from '@/utils/publicFun'
import Drawer from './Drawer'
import operateFun from '@/components/Operate'

export default function Search() {
  const dispatch = useDispatch()

  const {
    team: { alertShow, ids },
  } = useSelector((state) => state)

  const token = localStorage.getItem('token')
  const table = useTable('/api/ManagerTeam/fuzzyNameQuery', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data || [],
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  pageSize 页码
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
        teamName: searchValues.teamName,
        createName: searchValues.createName,
        updateName: searchValues.updateName,
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  const setCloseDrawerVisible = () => {
    dispatch({
      type: 'team/updateState',
      payload: {
        alertShow: false,
      },
    })
  }
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
                ids: [ids],
              },
            })
          }}></Alert>
        <ProTable
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
          searchBtns={searchFun(table)}
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
              // props: {
              //   widget: 'input',
              //   // 组件属性
              //   widgetProps: {
              //     placeholder: '输入创建人',
              //   },
              // },
              align: 'center',
            },
            {
              title: '更新人',
              key: 'updateName',
              // props: {
              //   widget: 'input',
              //   // 组件属性
              //   widgetProps: {
              //     placeholder: '输入更新人',
              //   },
              // },
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
                  onEvenDelete: () => onOpenDelete(data.postId),
                }),
            },
          ]}
          table={table}
        />
        <Drawer />
      </Card>
    </Fragment>
  )
}

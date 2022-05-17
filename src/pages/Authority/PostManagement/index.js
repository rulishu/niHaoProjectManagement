import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { Alert } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import Drawer from './Drawer'
import { searchFun } from '@/utils/publicFun'
import operateFun from '@/components/Operate'

export default function Index() {
  const dispatch = useDispatch()
  const {
    local: { alertShow, ids },
  } = useSelector((state) => state)

  const table = useTable('/api/userDevice/selectPage', {
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        ...searchValues,
      }
    },

    formatData: (data) => {
      return {
        total: data?.data?.total || 0,
        data: data?.data?.rows || [],
      }
    },
  })
  const onOpenDelete = (data) => {
    dispatch({
      type: 'local/updateState',
      payload: {
        alertShow: true,
        ids: data,
        tablePro: table,
      },
    })
  }
  const setCloseDrawerVisible = () => {
    dispatch({
      type: 'local/updateState',
      payload: {
        alertShow: false,
      },
    })
  }
  const onOpenEdit = (data) => {
    dispatch({
      type: 'local/updateState',
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
      <Alert
        isOpen={alertShow}
        confirmText="确认"
        onClosed={() => setCloseDrawerVisible()}
        type="danger"
        content={`是否确认删除本条数据！`}
        onConfirm={() => {
          dispatch({
            type: 'local/getDelete',
            payload: {
              id: ids,
            },
          })
        }}></Alert>
      <ProTable
        table={table}
        bordered
        searchBtns={searchFun(table)}
        operateButtons={[
          {
            label: '新增',
            icon: 'plus',
            type: 'primary',
            onClick: () => {
              dispatch({
                type: 'local/updateState',
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
            title: '岗位名称',
            key: 'deviceName',
            width: 130,
            align: 'center',
            ellipsis: true,
            props: {
              widget: 'input',
              widgetProps: {
                placeholder: '请输入岗位名称',
              },
            },
          },
          {
            title: '岗位编码',
            key: 'deviceNo',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '岗位顺序',
            key: 'deviceAddress',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '备注',
            key: 'devicePurpose',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '岗位状态',
            key: 'status',
            width: 130,
            align: 'center',
            ellipsis: true,
            props: {
              widget: 'select',
              option: [
                { label: '正常', value: 1 },
                { label: '停用', value: 2 },
              ],
              widgetProps: {
                placeholder: '请输入岗位状态',
              },
            },
            render: (code) => {
              return <div>{code === 1 ? '闲置' : '已出售'}</div>
            },
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '警告次数',
            key: 'warnNum',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '操作',
            key: 'edit',
            align: 'center',
            width: 150,
            render: (_, record, data) =>
              operateFun({
                onEvenEdit: () => onOpenEdit(data),
                onEvenDelete: () => onOpenDelete(data.id),
              }),
          },
        ]}
      />
      <Drawer />
    </Fragment>
  )
}

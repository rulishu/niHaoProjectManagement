import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { Alert, Badge } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import Drawer from './Drawer'
import { searchFun } from '@/utils/publicFun'
import operateFun from '@/components/Operate'

const token = localStorage.getItem('token')
export default function Index() {
  const dispatch = useDispatch()
  const {
    local: { alertShow, ids },
  } = useSelector((state) => state)

  const table = useTable('/api/system/post/optionselect', {
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: pageSize,
        postName: searchValues?.postName || '',
        status: searchValues?.status || '',
      }
    },

    formatData: (data) => {
      return {
        total: data?.data?.total || 0,
        data: data?.data || [],
      }
    },
    requestOptions: {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
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
            title: '岗位序号',
            key: 'postId',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '岗位名称',
            key: 'postName',
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
            key: 'postCode',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '岗位排序',
            key: 'postSort',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '岗位排序',
            key: 'createTime',
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
                { label: '正常', value: 0 },
                { label: '停用', value: 1 },
              ],
              widgetProps: {
                placeholder: '请输入岗位状态',
              },
            },
            //
            render: (code) => {
              return (
                <div>
                  <Badge color={code === 0 ? '#28a745' : '#c2c2c2'} />
                  {code === 0 ? '正常' : '停用'}
                </div>
              )
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

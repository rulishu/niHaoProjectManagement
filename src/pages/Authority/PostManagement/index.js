import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { Modal, Tag, Card } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import Drawer from './Drawer'
import { searchFun } from '@/utils/publicFun'
import operateFun from '@/components/Operate'

export default function Index() {
  const token = localStorage.getItem('token')

  const dispatch = useDispatch()
  const {
    postManagement: { alertShow, ids },
  } = useSelector((state) => state)

  const table = useTable('/api/system/post/listToken', {
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
        total: data?.total || 0,
        data: data?.rows || [],
      }
    },
    requestOptions: {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
    },
  })
  const onOpenDelete = (data) => {
    dispatch({
      type: 'postManagement/updateState',
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
      type: 'postManagement/updateState',
      payload: {
        alertShow: false,
      },
    })
  }
  const onOpenEdit = (data) => {
    dispatch({
      type: 'postManagement/updateState',
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
        {/* <Alert
          isOpen={alertShow}
          confirmText="确认"
          onClosed={() => setCloseDrawerVisible()}
          type="danger"
          content={`是否确认删除本条数据！`}
          onConfirm={() => {
            dispatch({
              type: 'postManagement/getDelete',
              payload: {
                ids: [ids],
              },
            })
          }}></Alert> */}
        {/* 统一删除按钮样式 */}
        <Modal
          title="删除提示"
          isOpen={alertShow}
          confirmText="确定"
          cancelText="取消"
          icon="information"
          type="primary"
          onConfirm={() => {
            dispatch({
              type: 'postManagement/getDelete',
              payload: {
                ids: [ids],
              },
            })
          }}
          onCancel={() => setCloseDrawerVisible()}
          onClosed={() => setCloseDrawerVisible()}>
          <p>确认删除该条数据吗?</p>
        </Modal>

        <ProTable
          table={table}
          // bordered
          searchBtns={searchFun(table)}
          operateButtons={[
            {
              label: '新增',
              icon: 'plus',
              type: 'primary',
              onClick: () => {
                dispatch({
                  type: 'postManagement/updateState',
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
              // width: 130,
              align: 'center',
              ellipsis: true,
            },
            {
              title: '岗位名称',
              key: 'postName',
              // width: 130,
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
              // width: 130,
              align: 'center',
              ellipsis: true,
            },
            {
              title: '岗位排序',
              key: 'postSort',
              // width: 130,
              align: 'center',
              ellipsis: true,
            },
            {
              title: '岗位状态',
              key: 'status',
              // width: 130,
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
                    {code === '1' ? (
                      <Tag light color="#dc3545">
                        停用
                      </Tag>
                    ) : (
                      <Tag light color="#28a745">
                        正常
                      </Tag>
                    )}
                  </div>
                )
              },
            },
            {
              title: '备注',
              key: 'remark',
              // width: 130,
              align: 'center',
              ellipsis: true,
            },
            {
              title: '创建时间',
              key: 'createTime',
              width: 180,
              align: 'center',
              ellipsis: true,
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
        />
        <Drawer />
      </Card>
    </Fragment>
  )
}

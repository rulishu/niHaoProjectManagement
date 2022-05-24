import { Fragment } from 'react'
import { Button } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import { deleteTeamById, getPageTeam } from '@/servers/team'
import Drawer from './Drawer'
import DelectModals from '@/components/DelectModals'

export default function Search() {
  const dispatch = useDispatch()

  const {
    team: { systemId, delectVisible },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'team/updateState',
      payload,
    })
  }

  const table = useTable(getPageTeam, {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows || [],
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  pageSize 页码
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
        equipmentName: searchValues.equipmentName,
        team: searchValues.team,
        operate: searchValues.operate,
      }
    },
  })
  // 操作
  function handleEditTable(type, obj) {
    updateData({
      isView: type === 'view',
      tableType: type,
    })
    if (type === 'add') {
      updateData({ drawerVisible: true, queryInfo: {} })
    }
    if (type === 'edit' || type === 'view') {
      updateData({ drawerVisible: true, queryInfo: obj })
    }
    if (type === 'del') {
      updateData({ delectVisible: true, systemId: obj?.id })
    }
  }

  return (
    <Fragment>
      <ProTable
        bordered
        operateButtons={[
          {
            label: '新增',
            type: 'primary',
            onClick: () => {
              handleEditTable('add', {})
            },
          },
        ]}
        searchBtns={[
          {
            label: '查询',
            type: 'primary',
            htmlType: 'submit',
            onClick: () => {
              table.onSearch()
            },
          },
          {
            label: '重置',
            onClick: () => {
              updateData({ queryInfo: {} })
              table.onReset()
            },
          },
        ]}
        columns={[
          {
            title: '设备名称',
            key: 'equipmentName',
            props: {
              widget: 'input',
              // 组件属性
              widgetProps: {
                placeholder: '输入设备名称',
              },
            },
            align: 'center',
          },
          {
            title: '设备类型',
            key: 'equipmentType',
            props: {
              widget: 'input',
              // 组件属性
              widgetProps: {
                placeholder: '输入设备类型',
              },
            },
            align: 'center',
          },
          {
            title: '更新人',
            key: 'operate',
            props: {
              widget: 'input',
              // 组件属性
              widgetProps: {
                placeholder: '输入更新人',
              },
            },
            align: 'center',
          },
          {
            title: '创建时间',
            key: 'createTime',
            props: [
              {
                label: '创建开始时间',
                widget: 'dateInput',
                key: 'beginTime',
                // 组件属性
                widgetProps: {
                  format: 'YYYY-MM-DD HH:mm:ss',
                  datePickerProps: {
                    showTime: true,
                    todayButton: '今天',
                  },
                  placeholder: '选择创建开始时间',
                },
              },
              {
                label: '创建结束时间',
                widget: 'dateInput',
                key: 'endTime',
                // 组件属性
                widgetProps: {
                  format: 'YYYY-MM-DD HH:mm:ss',
                  datePickerProps: {
                    showTime: true,
                    todayButton: '今天',
                  },
                  placeholder: '选择创建结束时间',
                },
              },
            ],
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
            render: (text, key, rowData) => (
              <div style={{ textAlign: 'center' }}>
                <Button
                  size="small"
                  icon="edit"
                  onClick={() => handleEditTable('edit', rowData)}>
                  编辑
                </Button>
                <Button
                  size="small"
                  icon="eye-o"
                  onClick={() => handleEditTable('view', rowData)}>
                  查看
                </Button>
                <Button
                  size="small"
                  icon="delete"
                  onClick={() => handleEditTable('del', rowData)}>
                  删除
                </Button>
              </div>
            ),
          },
        ]}
        table={table}
      />
      <Drawer updateData={updateData} onSearch={table.onSearch} />
      {/* <Modals onSearch={table.onSearch} /> */}
      <DelectModals
        deleteById={deleteTeamById}
        delectVisible={delectVisible}
        modelsType="team/updateState"
        parameter={{ id: systemId }}
        onSearch={table.onSearch}
      />
    </Fragment>
  )
}

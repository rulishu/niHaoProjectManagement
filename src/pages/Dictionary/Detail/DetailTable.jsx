import { Fragment } from 'react'
import { Button, Notify, Tooltip } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import { ProTable, useTable } from '@uiw-admin/components'
import DeletePopover from '@/components/DeletePopover'
import DetailModal from './DetailModal'

const DetailTable = () => {
  const dispatch = useDispatch()
  const {
    dictionary: { queryInfo },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'dictionary/update',
      payload,
    })
  }

  const table = useTable('/api/dict/queryByPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.list || [],
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
        dictTypeCode: queryInfo.dictTypeCode,
        dictSort: 2,
        ...searchValues,
      }
    },
  })

  // 操作
  async function handleEditTable(type, record) {
    updateData({
      tableType: 'detail',
      modalType: type,
    })
    if (type === 'add') {
      updateData({ modalVisible: true, detailInfo: {} })
    }
    if (type === 'edit') {
      updateData({ modalVisible: true, detailInfo: record })
    }
    if (type === 'del') {
      const result = await dispatch({
        type: 'dictionary/deleteById',
        payload: [record?.dictId],
      })
      if (result.code === 200) {
        Notify.success({ title: result?.message })
        table.onSearch()
      }
    }
  }

  return (
    <Fragment>
      <ProTable
        operateButtons={[
          {
            label: '新增',
            type: 'primary',
            onClick: () => {
              handleEditTable('add')
            },
          },
        ]}
        // 搜索栏按钮
        searchBtns={[
          {
            label: '搜索',
            type: 'primary',
            onClick: () => {
              table.onSearch()
            },
          },
          {
            label: '重置',
            onClick: () => {
              table.onReset()
            },
          },
        ]}
        // rowSelection={{
        //   // 多选 checkbox 单选radio
        //   type: 'checkbox',
        //   // 选中的键名 column里的key
        //   selectKey: 'bugId',
        //   // 默认值
        //   // defaultSelected: ['']
        // }}
        table={table}
        columns={[
          {
            title: '字典编码',
            key: 'dictCode',
            ellipsis: true,
            props: {
              widget: 'input',
              initialValue: '',
              widgetProps: {
                placeholder: '输入字典编码',
              },
            },
            render: (text) => (
              <Tooltip placement="topLeft" content={text}>
                {text}
              </Tooltip>
            ),
          },
          {
            title: '字典名称',
            key: 'dictName',
            ellipsis: true,
            props: {
              widget: 'input',
              initialValue: '',
              widgetProps: {
                placeholder: '输入字典名称',
              },
            },
            render: (text) => (
              <Tooltip placement="topLeft" content={text}>
                {text}
              </Tooltip>
            ),
          },
          {
            title: '创建人',
            key: 'createName',
          },
          {
            title: '创建时间',
            key: 'createTime',
          },
          {
            title: '更新人',
            key: 'updateName',
          },
          {
            title: '更新时间',
            key: 'updateTime',
          },
          {
            title: '标签背景颜色',
            key: 'dictColour',
          },
          {
            title: '操作',
            key: 'edit',
            width: 150,
            align: 'center',
            render: (text, key, rowData) => (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <AuthBtn path="/api/dict/edit">
                  <Button
                    size="small"
                    type="primary"
                    onClick={handleEditTable.bind(this, 'edit', rowData)}>
                    编辑
                  </Button>
                </AuthBtn>
                <AuthBtn path="/api/dict/deleteByTypeId">
                  <DeletePopover
                    handleEditTable={() => handleEditTable('del', rowData)}
                  />
                </AuthBtn>
              </div>
            ),
          },
        ]}
      />
      <DetailModal updateData={updateData} onSearch={table.onSearch} />
    </Fragment>
  )
}

export default DetailTable

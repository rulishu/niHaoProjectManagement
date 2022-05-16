import { Fragment } from 'react'
import { Button, Tag, Card, Tooltip } from 'uiw'
import { useDispatch } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import { ProTable, useTable } from '@uiw-admin/components'
import DeletePopover from '@/components/DeletePopover'
import Detail from './Detail'

function Dictionary() {
  const dispatch = useDispatch()

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
        dictSort: 1,
        ...searchValues,
      }
    },
  })

  // 操作
  async function handleEditTable(type, record) {
    updateData({
      isView: type === 'view',
      tableType: type,
    })
    if (type === 'add') {
      updateData({ drawerVisible: true })
    }
    if (type === 'edit' || type === 'view' || type === 'detail') {
      updateData({ drawerVisible: true, queryInfo: record })
    }
    if (type === 'del') {
      const result = await dispatch({
        type: 'dictionary/deleteByTypeId',
        payload: [record?.dictId],
      })
      if (result.code === 200) {
        table.onSearch()
      }
    }
  }

  return (
    <Fragment>
      <Card>
        <ProTable
          operateButtons={[
            {
              render: (
                <AuthBtn path="/api/dict/add">
                  <Button
                    type="primary"
                    onClick={() => {
                      handleEditTable('add', {})
                    }}>
                    新增
                  </Button>
                </AuthBtn>
              ),
            },
          ]}
          // 搜索栏按钮
          searchBtns={[
            {
              label: '查询',
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
              title: '字典类型编码',
              key: 'dictTypeCode',
              ellipsis: true,
              props: {
                widget: 'input',
                initialValue: '',
                widgetProps: {
                  placeholder: '输入字典类型编码',
                },
              },
              render: (text) => (
                <Tooltip placement="topLeft" content={text}>
                  {text}
                </Tooltip>
              ),
            },
            {
              title: '字典类型名称',
              key: 'dictTypeName',
              ellipsis: true,
              render: (text, key, rowData) => (
                <Tooltip placement="topLeft" content={text}>
                  <Button
                    type="link"
                    onClick={handleEditTable.bind(this, 'detail', rowData)}>
                    {text}
                  </Button>
                </Tooltip>
              ),
              props: {
                widget: 'input',
                initialValue: '',
                widgetProps: {
                  placeholder: '输入字典类型名称',
                },
              },
            },
            {
              title: '状态',
              key: 'deleteMark',
              props: {
                widget: 'select',
                option: [
                  { label: '正常', value: 0 },
                  { label: '停用', value: 2 },
                ],
              },
              render: (text) => {
                return (
                  <div>
                    {text === 2 ? (
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
              title: '操作',
              key: 'edit',
              width: 150,
              render: (text, key, rowData) => (
                <div>
                  <AuthBtn path="/api/dict/queryById">
                    <Button
                      size="small"
                      type="primary"
                      onClick={handleEditTable.bind(this, 'detail', rowData)}>
                      查看
                    </Button>
                  </AuthBtn>
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
      </Card>
      <Detail updateData={updateData} onSearch={table.onSearch} />
    </Fragment>
  )
}

export default Dictionary

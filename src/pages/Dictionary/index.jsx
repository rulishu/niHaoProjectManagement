import { Fragment } from 'react'
import { Button, Tag, Card, Tooltip, Notify } from 'uiw'
import { useDispatch } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import { ProTable, useTable } from '@uiw-admin/components'
import DeletePopover from '@/components/DeletePopover'
import Detail from './Detail'
import { searchFun } from '@/utils/publicFun'
import { changeDate } from '@/utils/utils'
import { useSelector } from 'react-redux'

function Dictionary() {
  const dispatch = useDispatch()
  const {
    dictionary: { isOpen, ids },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'dictionary/update',
      payload,
    })
  }
  const token = localStorage.getItem('token')
  const table = useTable('/api/system/dict/type/list', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.total,
        data: data?.rows || [],
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize,
        // dictSort: 1,
        // ...searchValues,
        dictName: searchValues.dictName,
        dictType: searchValues.dictType,
        status: searchValues.status,
        params: {
          beginTime: changeDate(searchValues.createTime?.at(0))?.trim(),
          endTime: changeDate(searchValues.createTime?.at(1))?.trim(),
        },
      }
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  // 操作
  async function handleEditTable(type, record) {
    console.log(record)
    updateData({
      isView: type === 'view',
      tableType: type,
      tablePro: table,
    })
    if (type === 'add') {
      updateData({ drawerVisible: true, queryInfo: record })
    }
    if (type === 'edit' || type === 'view' || type === 'detail') {
      updateData({ drawerVisible: true, queryInfo: record })
    }
    if (type === 'del') {
      updateData({ isOpen: true, ids: [record?.dictId] })

      // const result = await dispatch({
      //   type: 'dictionary/deleteByTypeId',
      //   payload: { ids: [record?.dictId] },
      // })
      // if (result.code === 200) {
      //   table.onSearch()
      // }
    }
  }
  const onConfirm = () => {
    dispatch({
      type: 'dictionary/deleteByTypeId',
      payload: { ids },
    }).then((data) => {
      if (data?.code === 200) {
        table.onSearch()
        Notify.success({ title: data?.message })
      }
    })
  }
  const onClosed = () => {
    updateData({ isOpen: false })
  }
  return (
    <Fragment>
      <Card>
        <DeletePopover
          isOpen={isOpen}
          onConfirm={() => onConfirm()}
          onClosed={() => onClosed()}
        />
        <ProTable
          operateButtons={[
            {
              render: (
                <AuthBtn path="/api/dict/add">
                  <Button
                    type="primary"
                    icon="plus"
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
          searchBtns={searchFun(table)}
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
              key: 'dictId',
              ellipsis: true,
              align: 'center',
              // props: {
              //   widget: 'input',
              //   initialValue: '',
              //   widgetProps: {
              //     placeholder: '输入字典类型编码',
              //   },
              // },
              render: (text) => (
                <Tooltip placement="topLeft" content={text}>
                  {text}
                </Tooltip>
              ),
            },
            {
              title: '字典类型名称',
              key: 'dictName',
              ellipsis: true,
              align: 'center',
              render: (text, key, rowData) => (
                <Tooltip placement="topLeft" content={text}>
                  {text}
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
              title: '字典类型',
              key: 'dictType',
              ellipsis: true,
              align: 'center',
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
                  placeholder: '输入字典类型',
                },
              },
            },
            {
              title: '状态',
              key: 'status',
              align: 'center',
              ellipsis: true,
              props: {
                widget: 'select',
                option: [
                  { label: '正常', value: '0' },
                  { label: '停用', value: '1' },
                ],
              },
              render: (text) => {
                return (
                  <div>
                    {text === '1' ? (
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
              align: 'center',
              ellipsis: true,
            },
            {
              title: '创建时间',
              key: 'createTime',
              align: 'center',
              width: 200,
              // ellipsis: true,
              props: {
                widget: 'dateInputRange',
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
            {
              title: '操作',
              key: 'edit',
              width: 240,
              align: 'center',
              render: (text, key, rowData) => (
                <div>
                  <AuthBtn path="/api/dict/queryById">
                    <Button
                      size="small"
                      type="success"
                      icon="eye"
                      onClick={handleEditTable.bind(this, 'detail', rowData)}>
                      查看
                    </Button>
                  </AuthBtn>
                  {/* <Divider type="vertical" /> */}
                  <AuthBtn path="/api/dict/edit">
                    <Button
                      size="small"
                      type="primary"
                      icon="edit"
                      onClick={handleEditTable.bind(this, 'edit', rowData)}>
                      编辑
                    </Button>
                  </AuthBtn>
                  {/* <Divider type="vertical" /> */}
                  <AuthBtn path="/api/dict/deleteByTypeId">
                    <Button
                      size="small"
                      type="danger"
                      icon="delete"
                      onClick={handleEditTable.bind(this, 'del', rowData)}>
                      删除
                    </Button>
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

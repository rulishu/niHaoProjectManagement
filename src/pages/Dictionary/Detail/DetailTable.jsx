import { Fragment } from 'react'
import { Button, Notify, Tooltip, Tag } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import { ProTable, useTable } from '@uiw-admin/components'
import DeletePopover from '@/components/DeletePopover'
import DetailModal from './DetailModal'
import styles from './index.module.less'

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
  const token = localStorage.getItem('token')
  const table = useTable('/api/system/dict/data/list', {
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
        dictType: queryInfo.dictType,
        // dictSort: 2,
        ...searchValues,
      }
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  // 操作
  async function handleEditTable(type, record) {
    updateData({
      tableType: 'detail',
      modalType: type,
      tablePro: table,
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
        payload: { ids: [record?.dictCode] },
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
            width: 80,
            ellipsis: true,
            // props: {
            //   widget: 'input',
            //   initialValue: '',
            //   widgetProps: {
            //     placeholder: '输入字典编码',
            //   },
            // },
            // render: (text) => (
            //   <Tooltip placement="topLeft" content={text}>
            //     {text}
            //   </Tooltip>
            // ),
          },
          {
            title: '字典名称',
            key: 'dictLabel',
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
            title: '字典键值',
            key: 'dictValue',
            render: (text) => {
              return (
                <div>
                  <Tooltip placement="top" content={`${text}`}>
                    <span className={styles.proTableDictValue}>{text}</span>
                  </Tooltip>
                </div>
              )
            },
          },
          {
            title: '排序',
            key: 'dictSort',
            width: 60,
          },
          {
            title: '状态',
            key: 'status',
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
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 150,
          },
          // {
          //   title: '标签背景颜色',
          //   key: 'dictColour',
          // },
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

import { useState, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.module.less'
import { searchFun } from '@/utils/publicFun'
import Detail from './Detail'

const MigrateSource = (props) => {
  // const {
  //   migrate: { source: { listData } },
  //   loading,
  // } = useSelector((state) => state)
  const dispatch = useDispatch()

  const [isVisible, setIsVisible] = useState(false)

  const token = localStorage.getItem('token')
  const table = useTable('/api/system/transfersource/selectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data,
        data: data.data.rows,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (page, pageSize, formData) => {
      return { ...formData }
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  const getDataByIdSource = (id) => {
    setIsVisible(true)
    dispatch({
      type: 'migrate/getDataByIdSource',
      payload: id,
    })
  }

  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <ProTable
            // 操作栏按钮
            operateButtons={[
              {
                label: '新增',
                type: 'primary',
                icon: 'plus',
                onClick: () => {
                  setIsVisible(true)
                },
              },
            ]}
            paginationProps={{ style: { display: 'none' } }}
            // 搜索栏按钮
            searchBtns={searchFun(table)}
            className="menuTable"
            table={table}
            columns={[
              {
                title: '迁移源名称',
                key: 'name',
                width: 200,
                props: {
                  widget: 'input',
                  widgetProps: {
                    placeholder: '请输入迁移源名称',
                  },
                },
              },
              {
                title: '迁移源类型',
                key: 'type',
                width: 120,
                ellipsis: true,
                align: 'center',
              },
              {
                title: '迁移源地址',
                key: 'url',
                width: 220,
                ellipsis: true,
                align: 'center',
              },
              {
                title: '创建时间',
                key: 'createTime',
                width: 180,
                ellipsis: true,
                align: 'center',
              },
              {
                title: '更新时间',
                key: 'updateTime',
                width: 180,
                ellipsis: true,
                align: 'center',
              },
              {
                title: '备注',
                key: 'remark',
                ellipsis: true,
                align: 'center',
              },
              {
                title: '操作',
                key: 'edit',
                width: 120,
                align: 'center',
                render: (text, key, rowData) => {
                  // console.log(text, key, rowData);
                  return (
                    <div>
                      <Button
                        size="small"
                        type="success"
                        icon="eye-o"
                        onClick={() => getDataByIdSource(rowData.id)}
                      />
                      <Button size="small" type="primary" icon="edit" />
                      <Button size="small" type="danger" icon="delete" />
                    </div>
                  )
                },
              },
            ]}
          />
        </div>
      </Card>
      <Detail isVisible={isVisible} setIsVisible={setIsVisible} />
    </Fragment>
  )
}

export default MigrateSource

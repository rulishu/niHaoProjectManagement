import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ProTable, useTable } from '@uiw-admin/components'
import { searchFun } from '@/utils/publicFun'
import { Card, Loader, Button, Tooltip } from 'uiw'
import Detail from './Detail'
import styles from './index.module.less'

const sourceTypeObj = { 10: '项目', 20: 'issue', 30: '里程碑', 40: '标签' }

const MigrateDetail = (props) => {
  const { loading } = useSelector((state) => state)
  const dispatch = useDispatch()

  const [isVisible, setIsVisible] = useState(false)

  // 打开配置
  // type  1：新增 2：编辑 3： 查看
  const getDataByIdDetail = async (id, type) => {
    setIsVisible(true)
    await dispatch({
      type: 'migrate/getDataByIdDetail',
      payload: id,
    })
  }

  const token = localStorage.getItem('token')
  const table = useTable('/api/system/transferdetail/selectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (page, pageSize, formData) => {
      return { page, pageSize, ...formData }
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <Loader
            loading={loading.effects.migrate.getPagingDataDetail}
            style={{ width: '100%' }}
            tip="loading...">
            <ProTable
              // 搜索栏按钮
              searchBtns={searchFun(table)}
              className="menuTable"
              table={table}
              columns={[
                {
                  title: '迁移任务id',
                  key: 'transferId',
                  width: 180,
                  ellipsis: true,
                  props: {
                    widget: 'input',
                    widgetProps: {
                      placeholder: '请输入迁移任务id',
                    },
                  },
                },
                {
                  title: '迁移类型',
                  key: 'transferType',
                  width: 180,
                  ellipsis: true,
                  render: (text) => <div>{sourceTypeObj[+text]}</div>,
                },
                {
                  title: '更新数量',
                  key: 'updateNumber',
                  width: 180,
                  ellipsis: true,
                },
                {
                  title: '新增数量',
                  key: 'addNumber',
                  width: 180,
                  ellipsis: true,
                },
                {
                  title: '最后的编号',
                  key: 'fineCode',
                  width: 180,
                  ellipsis: true,
                },
                {
                  title: '操作',
                  key: 'view',
                  width: 60,
                  align: 'center',
                  render: (text, key, rowData) => {
                    return (
                      <div>
                        <Tooltip placement="top" content={'查看详情'}>
                          <Button
                            size="small"
                            type="success"
                            icon="eye-o"
                            onClick={() => getDataByIdDetail(rowData.id)}
                          />
                        </Tooltip>
                      </div>
                    )
                  },
                },
              ]}
            />
          </Loader>
        </div>
      </Card>
      <Detail isVisible={isVisible} setIsVisible={setIsVisible} />
    </Fragment>
  )
}

export default MigrateDetail

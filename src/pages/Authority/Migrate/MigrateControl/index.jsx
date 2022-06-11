import { Fragment } from 'react'
import { Card } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { searchFun } from '@/utils/publicFun'
import { columns } from './item'

const MigrateControl = (props) => {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const table = useTable('/api/system/transfer/selectPage', {
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

  // 跳转到迁第三方同步数据页面

  const goMigrateControlSynch = (id, tabKey) => {
    navigate(`/Authority/migrate/control/${id}`, {
      state: { tabKey },
    })
  }

  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <>
            <ProTable
              // 操作栏按钮
              operateButtons={[]}
              searchBtns={searchFun(table)}
              table={table}
              columns={columns({ goMigrateControlSynch })}
            />
          </>
        </div>
      </Card>
    </Fragment>
  )
}

export default MigrateControl

import { useSelector } from 'react-redux'
import Head from './Head'
import styles from './index.module.less'
import { ProTable, useTable } from '@uiw-admin/components'
import { columns } from './items'

const ProjectAuth = () => {
  const {
    projectAuth: { dataList },
  } = useSelector((state) => state)

  const table = useTable('https://randomuser.me/api', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: 1,
        data: dataList,
      }
    },
  })
  const onTable = (type, obj) => {
    console.log('type', type)
    if (type === 'edit') {
      console.log('type', type)
    }
  }
  return (
    <div className={styles.userWrap}>
      <Head />
      <ProTable
        paginationProps={{
          pageSizeOptions: [10, 20, 30],
          pageSize: 10,
        }}
        table={table}
        columns={columns(onTable)}
      />
    </div>
  )
}

export default ProjectAuth

import { useSelector } from 'react-redux'
import Head from './Head'
import styles from './index.module.less'
import { ProTable, useTable } from '@uiw-admin/components'

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

  return (
    <div className={styles.userWrap}>
      <Head />
      <ProTable
        paginationProps={{
          pageSizeOptions: [10, 20, 30],
          pageSize: 10,
        }}
        table={table}
        columns={[
          {
            title: '编号',
            key: 'code',
          },
          {
            title: '分组名称',
            key: 'name',
          },
          {
            title: '分组描述',
            key: 'mshu',
          },
          {
            title: '用户列表',
            key: 'gender',
          },
        ]}
      />
    </div>
  )
}

export default ProjectAuth

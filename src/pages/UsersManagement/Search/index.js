import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
import { columnsSearch } from './item'
import { Button } from 'uiw'
import styles from './index.module.less'

const Search = () => {
  const dispatch = useDispatch()

  const updateData = (payload) => {
    dispatch({
      type: 'usersManagement/updateState',
      payload,
    })
  }

  const search = useTable('api/selectPage', {
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        pageSize: 10,
        ...searchValues,
      }
    },
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows || [],
      }
    },
  })
  // 操作
  function handleEditTable(type) {
    updateData({
      tableType: type,
    })
  }

  return (
    <Fragment>
      <div className={styles.containButton}>
        <Button
          size="big"
          icon="plus-circle-o"
          onClick={() => handleEditTable('del')}>
          从一个项目导入
        </Button>
        <Button
          size="big"
          icon="plus-circle-o"
          onClick={() => handleEditTable('del')}>
          邀请群组
        </Button>
        <Button
          size="big"
          type="primary"
          icon="plus-circle-o"
          onClick={() => handleEditTable('del')}>
          邀请成员
        </Button>
      </div>

      <ProTable
        // bordered
        // operateButtons={[
        //     {
        //         label: '新增',
        //         type: 'primary',
        //         icon: 'plus-circle-o',
        //         onClick: () => {
        //             handleEditTable('add', {})
        //         },
        //     }
        // ]}
        // searchBtns={[
        //     {
        //         label: '查询',
        //         type: 'primary',
        //         htmlType: 'submit',
        //         onClick: () => search.onSearch(),
        //         icon: 'search',
        //     },
        //     {
        //         label: '重置',
        //         onClick: () => search?.onReset(),
        //         icon: 'reload',
        //     },
        // ]}
        table={search}
        columns={columnsSearch(handleEditTable)}
      />
    </Fragment>
  )
}

export default Search

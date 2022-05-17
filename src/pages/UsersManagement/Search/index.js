import { Fragment } from 'react'
import { ProTable, useTable } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
import { columnsSearch } from './items'
import { Button } from 'uiw'
import { SearchBar } from '@/components'
import styles from './index.module.less'
import Drawer from '../Drawer/index'
import Modal from '../Modals/index'

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
        data: data?.data?.rows || [{ code: '1' }],
      }
    },
  })
  // 操作
  function handleEditTable(type, obj) {
    updateData({
      tableType: type,
    })
    if (type === 'edit') {
      updateData({
        drawerVisible: true,
        queryInfo: obj,
      })
    }
    if (type === 'del') {
      updateData({
        delectVisible: true,
        id: obj?.id,
      })
    }
  }
  const SearchBarOption = [
    { value: 1, text: '已打开' },
    { value: 3, text: '已关闭' },
    { value: '', text: '所有' },
  ]
  return (
    <Fragment>
      <div className={styles.containButton}>
        <Button
          size="big"
          type="primary"
          icon="user-add"
          onClick={() => handleEditTable('member')}>
          邀请成员
        </Button>
        <Button
          size="big"
          icon="usergroup-add"
          type="primary"
          onClick={() => handleEditTable('group')}>
          邀请群组
        </Button>
      </div>
      <div>
        <SearchBar
          isDrop={true}
          option={SearchBarOption}
          onSearch={(value, selectValue) => console.log(value, selectValue)}
        />
      </div>

      <ProTable table={search} columns={columnsSearch(handleEditTable)} />

      <Drawer updateData={updateData} onSearch={search.onSearch} />
      <Modal onSearch={search.onSearch} />
    </Fragment>
  )
}

export default Search

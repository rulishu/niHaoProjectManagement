import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import SearchView from './SearchView'
import TabelView from './TabelView'
import DrawerView from './DrawerView'
import { Card } from 'uiw'

export default function Search() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: 'department/getList',
    })
  }, [dispatch])
  return (
    <>
      <Card>
        {/* 搜索框 */}
        <SearchView />
        {/* 表格 */}
        <TabelView />
      </Card>
      {/* 新增表单 */}
      <DrawerView />
    </>
  )
}

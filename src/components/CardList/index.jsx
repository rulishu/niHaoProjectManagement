import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { List, Card } from 'uiw'

const CardList = (props) => {
  const { data } = props
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({ type: 'home/selectPageList' })
  }, [dispatch])

  const updateData = (payload) => {
    dispatch({
      type: 'home/update',
      payload,
    })
  }
  const handleTable = (id) => {
    updateData({ id: id })
  }
  return (
    <List
      dataSource={data}
      bordered={false}
      header={<div>请先选择项目：</div>}
      renderItem={(item, index) => {
        return (
          <List.Item
            {...item}
            key={index}
            style={{
              width: 300,
              display: 'inline-block',
              border: 'none',
              cursor: 'pointer',
            }}>
            <Card onClick={handleTable.bind(this, item.id)}>{item.name}</Card>
          </List.Item>
        )
      }}
    />
  )
}
export default CardList

import { Card } from 'uiw'
import { useDispatch } from '@uiw-admin/router-control'

const Demo = () => {
  const dispatch = useDispatch()

  const updateData = (payload) => {
    dispatch({
      type: 'demo/updateState',
      payload,
    })
  }

  const One = (item) => (
    <div
      onClick={() => {
        updateData()
      }}>
      {item}
    </div>
  )

  const arr = [1, 2]

  return <Card>{arr.map((item) => One(item))}</Card>
}

export default Demo

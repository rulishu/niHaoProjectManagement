import { List } from 'uiw'
// import { useSelector, useDispatch } from 'react-redux'
import Config from './Config'
const MigrateControl = (props) => {
  // const {
  //   migrateControl: { },
  // } = useSelector((state) => state)
  // const dispatch = useDispatch()

  return (
    <div>
      <Config />
      <List
        dataSource={[1]}
        noHover
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>
  )
}

export default MigrateControl

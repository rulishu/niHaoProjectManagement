import { Empty, Avatar } from 'uiw'
import styles from './index.module.less'

const AddList = (props) => {
  const liList = (data) => {
    if (!data?.length) {
      return <Empty />
    } else {
      return data?.map((item, index) => {
        return (
          <li
            key={index}
            onClick={() => props.optionEvent(item)}
            className={styles.tagBut}>
            <Avatar size="small">{item?.nickName[0]}</Avatar>
            {'  ' + item.nickName + '  ' + item.email}
          </li>
        )
      })
    }
  }
  return (
    <>
      <ul style={{ height: '150px', width: '320px', overflowY: 'scroll' }}>
        {liList(props.data)}
      </ul>
    </>
  )
}

export default AddList

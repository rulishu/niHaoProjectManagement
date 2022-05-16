import { useSelector } from 'react-redux'
import UserBoxs from './Components'
import Head from './Head'
import styles from './index.module.less'

const ProjectAuth = () => {
  const {
    projectAuth: { dataList },
  } = useSelector((state) => state)

  const handleEdit = (value) => {
    console.log('value: ', value)
  }

  return (
    <div className={styles.userWrap}>
      <Head />
      <div className={styles.child}>
        {(dataList || []).map((item2, index2) => (
          <UserBoxs key={index2} data={item2} handleEdit={handleEdit} />
        ))}
      </div>
    </div>
  )
}

export default ProjectAuth

import styles from './index.module.less'
import { Exceptions404 } from '@uiw-admin/exceptions'

const ErrorPage = () => {
  return (
    <div className={styles.errorPage}>
      <Exceptions404 />
    </div>
  )
}
export default ErrorPage

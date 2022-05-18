import styles from './index.module.less'

export default function Container({ children, theme, ...others }) {
  return (
    <div className={styles.box}>
      <div
        className={styles.container}
        {...others}
        style={{ backgroundColor: theme || 'none' }}>
        {children}
      </div>
    </div>
  )
}

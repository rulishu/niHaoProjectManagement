import { Avatar } from 'uiw'
import styles from './index.module.less'

const ColumnDom = (props) => {
  const { itemData, columnType } = props

  // 标签
  const labelLi = (data) => {
    return (
      <div className={styles.labelLi}>
        <span
          className={styles.piece}
          style={{ backgroundColor: data?.color }}></span>
        <span className={styles.label}>{data?.name}</span>
      </div>
    )
  }

  // 指派人
  const memberLi = (data) => {
    return (
      <div className={styles.memberLi}>
        <Avatar
          size="small"
          src={data?.avatar && `/api/file/selectFile/${data?.avatar}`}
          className={styles.roleAvatar}>
          {data.memberName && data.memberName[0]}
        </Avatar>
        <div className={styles.userInfo}>
          <span className={styles.name}>{data?.memberName}</span>
          <span className={styles.account}>{data?.userAcount}</span>
        </div>
      </div>
    )
  }

  // 里程碑
  const milestoneLi = (data) => {
    return (
      <div className={styles.milestoneLi}>
        <span>{data.milestonesTitle}</span>
      </div>
    )
  }

  const liBoxObj = {
    label: labelLi,
    member: memberLi,
    milestone: milestoneLi,
  }

  return (
    <div className={styles.columnDom}>{liBoxObj[columnType]?.(itemData)}</div>
  )
}

export default ColumnDom

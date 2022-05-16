import styles from './index.module.less'

/**
 * This is a label component
 * @props status: bumber statusList: {} size: string className: className
 * @return JSX.Element
 * projectStatus.className : {blue:蓝色, brown:褐色, green:绿色, gray:灰色, yellow:黄色, red:红色, purple:紫色}
 * size: big 大  small：小（默认）
 * className : className
 */
const StatusTag = (props) => {
  const projectStatus = props.statusList || {
    0: { title: '未开始', className: 'brown' },
    1: { title: '进行中', className: 'blue' },
    2: { title: '已挂起', className: 'red' },
    3: { title: '已关闭', className: 'gray' },
  }
  const item = projectStatus[props.status]
  return (
    <div className={styles.statusTag}>
      <span
        className={`${styles[item.className]} ${styles[props.size]} ${
          props.className && props.className
        } `}>
        {item.title}
      </span>
    </div>
  )
}

export default StatusTag

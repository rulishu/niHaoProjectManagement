import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'

/**
 * This is a label
 * @param {color} string 颜色
 * @param {value} string 值
 * @param {link?} string 跳转路径
 * @param {bold?} string 字体粗细
 * @param {linkOption?} navigate 配置
 * @return JSX.Element
 */

// 颜色
const colorObj = {
  blue: '#2c7ef8',
  brown: '#d99156',
  green: '#41b349',
  gray: '#a7a8bd',
  yellow: '#fbb957',
  red: '#ed3321',
  purple: '#813c85',
  black: '#303030',
}
// 字体粗细
const boldObj = {
  bold: 'bold',
  middle: '500',
  none: 'none',
}

const LinkText = (props) => {
  const navigate = useNavigate()
  const {
    color = 'blue',
    value,
    link,
    bold = 'none',
    linkOption,
    ...params
  } = props
  // 跳转路径
  const goPage = () => {
    navigate(link, linkOption)
  }
  return (
    <span
      {...params}
      style={{ color: colorObj[color], fontWeight: boldObj[bold] }}
      className={styles.textTitle}
      onClick={() => goPage()}>
      {props.children || value}
    </span>
  )
}
export default LinkText

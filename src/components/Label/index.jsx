import styles from './index.module.less'

/**
 * 标签组件
 * @props color value
 * @return JSX.Element
 * className : className
 */
const Label = (props) => {
  const { color, value, ...param } = props

  // 三位颜色补全为6位
  const completionColor = (color) => {
    return (
      '#' +
      color
        .slice(color.startsWith('#') ? 1 : 0)
        .split('')
        .map((x) => x + x)
        .join('')
    )
  }

  // 获取颜色深浅
  const getColorShade = (color) => {
    let newColor = color
    if (newColor.length === 4) {
      newColor = completionColor(color)
    }
    const r = parseInt(newColor.substr(1, 2), 16)
    const g = parseInt(newColor.substr(3, 2), 16)
    const b = parseInt(newColor.substr(5, 2), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? 'black' : 'white'
  }

  return (
    <label
      className={styles.labelWrap}
      style={{
        backgroundColor: color,
        color: getColorShade(color),
      }}
      {...param}>
      {props?.children || value}
    </label>
  )
}

export default Label

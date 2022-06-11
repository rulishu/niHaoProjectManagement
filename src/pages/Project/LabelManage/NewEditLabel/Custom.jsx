import { useState } from 'react'
import { Input } from 'uiw'
import Github from '@uiw/react-color-github'
import styles from './index.module.less'

// 自定义颜色受控组件
const Custom = (props) => {
  const { value, onChange } = props
  const [color, setColor] = useState(value)

  // 受控组件 onChange 事件
  const change = (data) => {
    setColor(data)
    onChange(data)
  }

  return (
    <div className={styles.customBox}>
      <div className={styles.colInput}>
        <span
          className={styles.colBlock}
          style={{ backgroundColor: color }}></span>
        <Input value={color || ''} onInput={(e) => change(e.target.value)} />
      </div>
      <div className={styles.explain}>
        <p>请输入十六进制颜色码,例如：#b8b8b8</p>
        <p>或者您可以选择下面的建议颜色之一</p>
      </div>
      <div className={styles.colSelect}>
        <Github
          className={styles.colSelectBlock}
          color={color}
          onChange={(e) => change(e.hex)}
        />
      </div>
    </div>
  )
}

export default Custom

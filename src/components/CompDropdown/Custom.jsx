import { useState } from 'react'
import { Input } from 'uiw'
import Github from '@uiw/react-color-github'
import styles from './template.module.less'

// 自定义颜色受控组件
const Custom = (props) => {
  const { onChange } = props
  const [color, setColor] = useState(props?.color)

  // 受控组件 onChange 事件
  const change = (data) => {
    setColor(data)
    onChange(data)
  }

  return (
    <div>
      <div className={styles.colSelect}>
        <Github
          className={styles.colSelectBlock}
          color={color}
          onChange={(e) => change(e.hex)}
        />
      </div>
      <div className={styles.colInput}>
        <span
          className={styles.colBlock}
          style={{ backgroundColor: color }}></span>
        <Input
          value={color || ''}
          onInput={(e) => change(e.target.value)}
          placeholder="请选择或输入标签背景颜色"
        />
      </div>
    </div>
  )
}

export default Custom

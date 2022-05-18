import { useState, useRef, useEffect } from 'react'
import { Button, Input, Select } from 'uiw'
import styles from './index.module.less'

import Tribute from 'tributejs'

const tribute = new Tribute({
  noMatchTemplate: function () {
    return '<span style:"visibility: hidden;"></span>'
  },
  trigger: '@',
  values: [
    { key: 'Phil Heartman', value: 'pheartman' },
    { key: 'Gordon Ramsey', value: 'gramsey' },
  ],
})

/**
 * This is the search bar component
 * @props onSearch: 点击按钮回调函数, butText:按钮文字
 * @return JSX.Element
 * className : className
 */
const SearchBar = (props) => {
  const { onSearch, butText, isDrop, option } = props
  const [inputValue, setInputValue] = useState()
  const [selectValue, setSelectValue] = useState('1')

  const ref = useRef()
  const isBundle = useRef(false)

  useEffect(() => {
    if (ref.current && !isBundle.current) {
      console.log('a', ref)
      isBundle.current = true
      tribute.attach(ref.current)
      ref.current.addEventListener('tribute-replaced', (e) => {
        console.log('ref', ref.current, ref.current.Input)
      })
    }
  }, [ref.current?.value])

  const defOption = [
    { value: 1, text: '打开' },
    { value: 2, text: '关闭' },
    { value: '', text: '所有' },
  ]

  const selectOption = (defaultValue, option) => {
    return (
      <Select
        defaultValue={defaultValue}
        style={{ flex: 1 }}
        onChange={(e) => {
          setSelectValue(e.target.value)
        }}>
        {option.map((item, index) => (
          <Select.Option key={index} value={item.value}>
            {item.text}
          </Select.Option>
        ))}
      </Select>
    )
  }

  return (
    <div className={styles.searchBar}>
      {isDrop && selectOption('1', option || defOption)}
      <Input
        ref={ref}
        style={{ flex: 6 }}
        placeholder="请输入内容"
        onInput={(e) => {
          setInputValue(e.target.value)
        }}
      />
      <Button
        type="light"
        style={{ flex: 1 }}
        onClick={() => {
          onSearch(inputValue, selectValue)
        }}>
        {butText || '搜索'}
      </Button>
    </div>
  )
}

export default SearchBar

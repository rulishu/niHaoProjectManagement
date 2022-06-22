import { useState, useEffect } from 'react'
import { Input, Icon, Button, OverlayTrigger } from 'uiw'
import ColumnDom from './ColumnDom'
import styles from './index.module.less'

const DropdownBox = (props) => {
  const {
    listData, // dataList
    columnDom,
    columnType,
    title,
    open = false,
    isRadio = false, // isRadio
    columnKey,
    searchValue = [columnKey], // 搜索key
    selectData, // 初始选中数组
    isCancel = true, // 能取消选中
    onSelect, // 每次点击选择触发
    onClose, // 组件关闭的回调
  } = props

  // 弹窗是否显示
  const [isOpen, setIsOpen] = useState(false)

  // 保存多选数据
  const [options, setOptions] = useState([])

  const [newListData, setNewListData] = useState(listData)

  // 弹窗 open 发生变化
  useEffect(() => setNewListData(listData), [listData])

  // 弹窗 open 发生变化
  useEffect(() => setIsOpen(open), [open])

  // 选中数组发生变化
  useEffect(() => setOptions(selectData || []), [selectData])

  // 点击选择触发
  const optionEvent = (key) => {
    const exists = options?.includes(key)
    if (isRadio) {
      setOptions(exists && isCancel ? [] : [key])
      return
    }
    const params = exists
      ? options?.filter((i) => i !== key)
      : [...options, key]
    setOptions(params)
    onSelect && onSelect()
  }

  const inputSearch = (value) => {
    const newData = value
      ? listData?.filter((item) => {
          return searchValue
            .map((searchArrItem) => {
              const data =
                typeof item[searchArrItem] === 'string'
                  ? item[searchArrItem]
                  : `${item[searchArrItem]}`
              if (data?.search(value) !== -1) return item
              return undefined
            })
            .filter((s) => s).length
        })
      : listData
    setNewListData(newData)
  }

  const listContent = (
    <div className={styles.listContent}>
      <header className={styles.listHead}>
        <span className={styles.title}>{title}</span>
        <Button
          size="small"
          icon="close"
          basic
          type="dark"
          onClick={() => {
            setIsOpen(false)
            onClose && onClose(options, false)
          }}
        />
      </header>
      <div className={styles.selectInputBox}>
        <Input
          placeholder="请输入内容"
          onInput={(e) => inputSearch(e.target.value)}
        />
      </div>
      <ul className={styles.listUl}>
        {newListData?.map((item, index) => {
          return (
            <li key={index} onClick={() => optionEvent(item?.[columnKey])}>
              <div className={styles.check}>
                {options?.includes(item?.[columnKey]) && <Icon type="check" />}
              </div>
              <div>
                {columnDom ? (
                  columnDom(item)
                ) : (
                  <ColumnDom
                    itemData={item}
                    columnType={columnType || 'label'}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div className={styles.dropdownBox}>
      <OverlayTrigger
        isOpen={isOpen}
        placement="bottomRight"
        overlay={listContent}
        trigger="click"
        autoAdjustOverflow={true}
        usePortal={false}
        onVisibleChange={(is) => {
          if (!is) {
            onClose && onClose(options, is)
          }
        }}>
        <div>{props?.children}</div>
      </OverlayTrigger>
    </div>
  )
}

export default DropdownBox

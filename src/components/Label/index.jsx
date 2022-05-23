import { useState, useEffect } from 'react'
import { Card, Button, Icon } from 'uiw'
import CreateLabel from './CreateLabel'
import LabelBox from './LabelBox'
import styles from './index.module.less'
import columns from './columns.js'

/**
 * This is a label
 * @param {listData} array 数据源
 * @param {isOpen} boolean 组件是否显示
 * @param {loading?} boolean 组件的loading状态 默认为 false
 * @param {runLabel?} function 管理标签按钮回调
 * @param {searchLabel?} function(value,result[]) 标签搜索框改变触发回调
 * @param {selectLabel?} function(value,result[]) 标签选择回调函数
 * @param {createTag?} function(initial, current) 新建标签提交回调函数
 * @param {createTagChange?} function(initial, current) 新建标签变化回调函数
 * @param {isTagClose?} boolean 是否在 Tag 展示关闭按钮
 * @param {closeLabel?} function 点击关闭 label 触发回调
 * @return JSX.Element
 */
const Label = (props) => {
  const {
    form,
    title,
    template,
    labelHeader, // Label 数据头
    isRadio = false,
    shape,
    listData,
    isOpen,
    loading,
    selectLabel,
    runLabel,
    searchLabel,
    createTag,
    createTagChange,
    isTagClose = true,
    closeLabel,
  } = props

  // 模板解构一些参数
  const { title: tempTitle } = template && columns[template]?.params
  const { form: tempForm } = template && columns[template]

  // labelStatus 1: 选择标签页, 2: 创建标签页
  const [labelStatus, setLabelStatus] = useState(1)

  const [open, setOpen] = useState(isOpen || false)
  // 保存多选数据
  const [options, setOptions] = useState()

  // 判断使用组件头方法
  const newHeader = () => {
    return labelHeader || (template && columns[template].header)
  }

  useEffect(() => {
    setOptions(
      listData
        ?.map((s) => {
          if (s.check) return s.key
          return undefined
        })
        .filter((s) => s)
    )
  }, [listData])

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const optionEvent = (key) => {
    if (isRadio) {
      setOptions([key])
      selectLabel && selectLabel(key, key)
      return
    }
    const exists = options?.includes(key)
    const newArr = exists
      ? options?.filter((i) => i !== key)
      : [...options, key]
    selectLabel && selectLabel(key, newArr)
    setOptions(() => newArr)
  }

  const tagList = (data) => {
    return (
      <div
        className={
          shape === 'input'
            ? styles.inputShape
            : shape === 'label'
            ? styles.tagList
            : ''
        }
        onClick={() => shape === 'input' && setOpen(!open)}>
        {/* 多选与单选 */}
        {!isRadio ? (
          data?.map((item) => (
            <div
              key={item?.key}
              className={item.color ? styles.tagListLi : styles.noColorTag}
              style={{ backgroundColor: item.color, borderColor: item?.color }}>
              {newHeader()?.map((headItem) => (
                <span className={styles.tagTitle}>
                  {headItem.resultsShow && headItem?.component(item, headItem)}
                </span>
              ))}
              {isTagClose && (
                <span
                  className={styles.tagBut}
                  onClick={() => optionEvent(item?.key)}>
                  <Icon className={styles.tagIcon} type="close" />
                </span>
              )}
            </div>
          ))
        ) : (
          <div>
            {newHeader()?.map((headItem) => (
              <span>
                {headItem.resultsShow && headItem?.component(data[0], headItem)}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.label}>
      <div>{tagList(listData?.filter((s) => options?.includes(s?.key)))}</div>
      {open && (
        <Card className={styles.labelCard} bodyClassName={styles.labelCardBody}>
          <div className={styles.labelHead}>
            {labelStatus === 2 && (
              <div className={styles.headBut}>
                <Button
                  icon="arrow-left"
                  basic
                  type="dark"
                  className={styles.headClose}
                  onClick={() => {
                    setLabelStatus(1)
                  }}
                />
              </div>
            )}
            <p className={styles.headTitle}>
              {labelStatus === 1
                ? `指定${title || tempTitle}`
                : `创建${title || tempTitle}`}
            </p>
            <div className={styles.headBut}>
              <Button
                icon="close"
                basic
                type="dark"
                className={styles.headClose}
                onClick={() => {
                  setOpen(false)
                  closeLabel && closeLabel()
                }}
              />
            </div>
          </div>
          {labelStatus === 1 && (
            <LabelBox
              labelHeader={newHeader()}
              isRadio={isRadio}
              listData={listData}
              options={options}
              optionEvent={optionEvent}
              setLabelStatus={setLabelStatus}
              searchLabel={searchLabel}
              runLabel={runLabel}
              loading={loading || false}
              title={title || tempTitle}
            />
          )}
          {labelStatus === 2 && (
            <CreateLabel
              setLabelStatus={setLabelStatus}
              createTag={createTag}
              createTagChange={createTagChange}
              form={form || tempForm}
            />
          )}
        </Card>
      )}
    </div>
  )
}

export default Label

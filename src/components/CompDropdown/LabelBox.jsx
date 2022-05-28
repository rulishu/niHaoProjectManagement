import { useState, useEffect } from 'react'
import { Input, Icon, Empty, Loader } from 'uiw'
import styles from './index.module.less'

const LabelBox = (props) => {
  const {
    labelHeader,
    isRadio,
    listData,
    setLabelStatus,
    options,
    optionEvent,
    searchLabel,
    runLabel,
    loading,
    title,
  } = props

  const [newListData, setNewListData] = useState(listData)

  useEffect(() => {
    if (listData !== newListData) setNewListData(listData)
  }, [listData, newListData])

  const labelList = (data) => {
    if (!data?.length) {
      return <Empty />
    }
    return data?.map((item, index) => {
      return (
        <li
          key={item.key || index}
          className={styles.labelListLi}
          onClick={() => optionEvent(item?.key)}>
          {!isRadio && (
            <div className={styles.liLeft}>
              {options?.includes(item?.key) && <Icon type="check" />}
            </div>
          )}
          <div className={styles.liRight}>
            {labelHeader.map((headItem, index) => (
              <div
                style={{ width: headItem?.width }}
                width={headItem.width}
                key={index}>
                {headItem?.component ? (
                  headItem?.component(item, headItem, index)
                ) : (
                  <div>{item[headItem.dataIndex]}</div>
                )}
              </div>
            ))}
          </div>
        </li>
      )
    })
  }

  return (
    <div className={styles.labelBox}>
      <div className={styles.searchBox}>
        <Input
          preIcon="search"
          placeholder="search"
          size="small"
          onInput={(e) => {
            const searchArr = labelHeader
              .map((item) => {
                if (item.isSearch) return item.dataIndex
                return undefined
              })
              .filter((s) => s)
            const newData = listData?.filter(
              (item) =>
                searchArr
                  .map((searchArritem) => {
                    if (item[searchArritem].search(`${e.target.value}`) !== -1)
                      return item
                    return undefined
                  })
                  .filter((s) => s).length
            )
            setNewListData(newData)
            searchLabel && searchLabel(e.target.value, newData)
          }}
        />
      </div>
      <ul className={styles.labelList}>
        <Loader
          tip="loading..."
          vertical
          style={{ width: '100%' }}
          loading={loading}>
          <div>{labelList(newListData)}</div>
        </Loader>
      </ul>
      <div className={styles.labelFoot}>
        <div
          className={styles.footBut}
          onClick={() => {
            setLabelStatus(2)
          }}>
          创建{title}
        </div>
        <div className={styles.footBut} onClick={() => runLabel && runLabel()}>
          管理{title}
        </div>
      </div>
    </div>
  )
}

export default LabelBox

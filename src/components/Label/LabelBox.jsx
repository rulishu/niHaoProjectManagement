import { useState, useEffect } from 'react'
import { Input, Icon, Empty, Loader } from 'uiw'
import styles from './index.module.less'

const LabelBox = (props) => {
  const {
    listData,
    setLabelStatus,
    options,
    optionEvent,
    searchLabel,
    runLabel,
    loading,
  } = props

  const [newListData, setNewListData] = useState(listData)

  useEffect(() => {
    if (listData !== newListData) setNewListData(listData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listData])

  const labelList = (data) => {
    if (!data?.length) {
      return <Empty />
    }
    return data?.map((item) => {
      return (
        <li
          key={item.key}
          className={styles.labelListLi}
          onClick={() => optionEvent(item?.key)}>
          <div className={styles.liLeft}>
            {options?.includes(item?.key) && <Icon type="check" />}
          </div>
          <div className={styles.liRight}>
            <p>
              <span
                className={styles.piece}
                style={{ backgroundColor: item?.color }}></span>
              <span className={styles.title}>{item?.title}</span>
            </p>
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
            const newData = listData?.filter(
              (item) => item?.title?.search(`${e.target.value}`) !== -1
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
          创建标签
        </div>
        <div className={styles.footBut} onClick={() => runLabel()}>
          管理标签
        </div>
      </div>
    </div>
  )
}

export default LabelBox

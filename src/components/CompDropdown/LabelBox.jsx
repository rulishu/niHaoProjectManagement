import { useState, useEffect } from 'react'
import { Input, Icon, Empty, Loader } from 'uiw'
import styles from './index.module.less'

const LabelBox = (props) => {
  const {
    labelHeader,
    isAllowsForNo,
    listData,
    setLabelStatus,
    options,
    optionEvent,
    searchLabel,
    runLabel,
    loading,
    title,
    actionButtons,
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
    return data?.map((item, index) => {
      return (
        <li
          style={{ padding: `${title === '人员' ? '0 8px' : '0 12px'}` }}
          key={item.key || index}
          className={styles.labelListLi}
          onClick={() => optionEvent(item?.key)}>
          {/* {!isRadio && ( */}
          <div className={styles.liLeft}>
            {options?.includes(item?.key) && <Icon type="check" />}
          </div>
          {/* )} */}
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
          placeholder="搜索"
          size="small"
          onInput={(e) => {
            const searchArr = labelHeader
              .map((item) => {
                if (item.isSearch) return item.dataIndex
                return undefined
              })
              .filter((s) => s)
            const newData = listData?.filter((item) => {
              return searchArr
                .map((searchArrItem) => {
                  if (item[searchArrItem].search(`${e.target.value}`) !== -1)
                    return item
                  return undefined
                })
                .filter((s) => s).length
            })
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
          <div>
            <ul>
              {isAllowsForNo && (
                <>
                  <li
                    className={styles.labelClean}
                    onClick={() => optionEvent(null, 0)}>
                    <div className={styles.liLeft}>
                      {newListData.filter((s) => s.check).length ? (
                        ''
                      ) : (
                        <Icon type="check" />
                      )}
                    </div>
                    无
                  </li>
                  <li className={styles.labelDivider}></li>
                </>
              )}
              {labelList(newListData)}
            </ul>
          </div>
        </Loader>
      </ul>
      <div className={styles.labelFoot}>
        {!actionButtons?.create?.isHide && (
          <div
            className={styles.footBut}
            onClick={() => {
              setLabelStatus(2)
            }}>
            {actionButtons?.create?.title || `创建${title}`}
          </div>
        )}
        {!actionButtons?.manage?.isHide && (
          <div
            className={styles.footBut}
            onClick={() => runLabel && runLabel()}>
            {actionButtons?.manage?.title || `管理${title}`}
          </div>
        )}
      </div>
    </div>
  )
}

export default LabelBox

import { useState, useEffect } from 'react'
import {
  Pagination,
  Row,
  Col,
  Checkbox,
  List,
  Loader,
  Popover,
  Card,
  Avatar,
} from 'uiw'
import styles from './index.module.less'
import './style.css'

// 使用list 实现 table 功能
/**
 * @param {listData} array 数据源
 * @param {listHeader} json {title:文字，dataIndex:渲染字段, key：key值，className?:类名， span?:24栅格, tooltip?:{}文字提示 ,ellipsis?:超出省略}
 * @param {isEmpty} boolean 是否在数据为空时展示空组件
 * @param {loading?} boolean 组件的loading状态 默认为 false
 * @param {pagination?} object {onChange,current,pageSize,total,divider,alignment,size} 分页设置
 * @param {LiOnClick?} any 每列点击事件 ，返回列所点击表项数据与索引
 * @param {component?} function () {return listItemData, componentParam} 渲染的组件 ，返回此列的数据，返回该组件的参数
 * @param {listFoot?} function () {} NewTableList组件的底部
 */

const NewTableList = (props) => {
  // 是否全选
  const [checkAll, setCheckAll] = useState(false)
  // 是否半选
  const [indeterminate, setIndeterminate] = useState(false)
  // 勾选的数组
  const [checkedList, setCheckedList] = useState([])

  const {
    listData,
    listHeader,
    loading,
    LiOnClick,
    isCheckbox,
    checkCallback,
    pagination,
    listFoot,
  } = props

  useEffect(() => {
    setCheckedList(() => [])
    setCheckAll(false)
    setIndeterminate(false)
  }, [listData])

  // 多选框 onChange 事件
  const checkCallbacks = (type, check, checkList, currentCheck) => {
    const lists = Array.from(
      new Set(checkList.map((item) => listData[+item]))
    ).filter((s) => s)
    checkStatus()
    if (type === 'checkOnChange' && checkCallback?.checkOnChange) {
      const currentItem = listData.filter((_, index) => index === +currentCheck)
      checkCallback?.checkOnChange(check, lists, currentItem)
    }
    type === 'checkAllOnChange' &&
      checkCallback?.checkAllOnChange &&
      checkCallback?.checkAllOnChange(check, lists)
  }

  // 全选
  const onCheckAllChange = (e) => {
    const checkAll = listData.map((_, index) => `${index}`)
    !e.target.checked && setCheckedList(() => [])
    e.target.checked && setCheckedList(() => checkAll)
    setIndeterminate(false)
    setCheckedList((newCheckedList) => {
      checkCallbacks('checkAllOnChange', e.target.checked, newCheckedList)
      return newCheckedList
    })
  }

  // 检查全选框状态函数
  const checkStatus = () => {
    setCheckedList((checkedLists) => {
      setCheckAll(() => checkedLists.length === listData.length)
      setIndeterminate(
        () => checkedLists.length && checkedLists.length < listData.length
      )
      return checkedLists
    })
  }

  const isTooltip = (node, value, param) => (
    <Popover
      placement="top"
      content={
        <Card
          bordered={false}
          style={{ width: param?.width, ...param?.styles, overflow: 'hidden' }}>
          <div>{value}</div>
        </Card>
      }
      {...param}>
      {node}
    </Popover>
  )

  const listHeaders = (
    <Row style={{ width: '100%' }}>
      {isCheckbox && (
        <Col span="1">
          <Checkbox
            checked={checkAll}
            indeterminate={indeterminate}
            onChange={(e) => onCheckAllChange(e)}
            value={-1}>
            <span></span>
          </Checkbox>
        </Col>
      )}
      {listHeader?.map((item) => (
        <Col span={item.span} key={item.key}>
          {item.title}
        </Col>
      ))}
    </Row>
  )
  return (
    <div className="list-content">
      <div className={styles.list}>
        <Loader
          tip="加载中..."
          style={{ width: '100%' }}
          loading={loading || false}>
          <Checkbox.Group
            name="newTableList"
            value={checkedList}
            onChange={(e, list) => {
              if (+e.target.value !== -1) {
                const newList = Array.from(new Set(checkedList)).filter(
                  (s) => s
                )
                e.target.checked &&
                  setCheckedList(() => [...newList, e.target.value])
                if (!e.target.checked) {
                  newList.splice(newList.indexOf(e.target.value), 1)
                  setCheckedList(() => newList)
                }
                checkStatus()
                setCheckedList((newCheckedList) => {
                  checkCallbacks(
                    'checkOnChange',
                    e.target.checked,
                    newCheckedList,
                    e.target.value
                  )
                  return newCheckedList
                })
              }
            }}>
            <List
              dataSource={listData}
              bordered={false}
              noHover={true}
              header={listHeaders}
              renderItem={(item, index) => {
                return (
                  <List.Item
                    key={index}
                    onClick={(e) => {
                      LiOnClick && LiOnClick(item, index)
                    }}>
                    <Row className={styles.listItem}>
                      {isCheckbox && (
                        <Col span="1">
                          <Checkbox
                            key={index}
                            value={`${index}`}
                            checked={checkedList.includes(`${index}`)}
                            onClick={(e) => e.stopPropagation()}>
                            <span></span>
                          </Checkbox>
                        </Col>
                      )}
                      {listHeader?.map((itemA) => {
                        return (
                          <Col span={+itemA.span} key={`${itemA.key}+`}>
                            {itemA?.tooltip ? (
                              isTooltip(
                                <div
                                  className={`${itemA?.className || ''} ${
                                    itemA?.ellipsis ? styles.ellipsis : ''
                                  } `}>
                                  {(itemA?.dataIndex === 'companyName' ||
                                    itemA?.dataIndex === 'name') && (
                                    <Avatar
                                      size="small"
                                      className={styles.listImg}
                                      src={`/api/file/selectFile/${item?.fileIds?.[0]}`}>
                                      {itemA?.component
                                        ? itemA?.component(item, itemA)
                                        : item[itemA?.dataIndex]}
                                    </Avatar>
                                  )}
                                  {itemA?.component
                                    ? itemA?.component(item, itemA)
                                    : item[itemA?.dataIndex]}
                                </div>,
                                item[itemA?.dataIndex],
                                { ...itemA.tooltip }
                              )
                            ) : (
                              <div
                                className={`${itemA?.className || ''} ${
                                  itemA?.ellipsis ? styles.ellipsis : ''
                                } `}>
                                {itemA?.component
                                  ? itemA?.component(item, itemA)
                                  : item[itemA?.dataIndex]}
                              </div>
                            )}
                          </Col>
                        )
                      })}
                    </Row>
                  </List.Item>
                )
              }}
            />
          </Checkbox.Group>
        </Loader>
        {pagination && (
          <div className={styles.listFoot}>
            {listFoot && listFoot()}
            <Pagination
              onChange={pagination?.pageChange}
              current={pagination?.current}
              pageSize={pagination?.pageSize}
              total={pagination?.total}
              divider={pagination?.divider || true}
              alignment={pagination?.alignment || 'right'}
              size={pagination?.size || 'default'}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NewTableList

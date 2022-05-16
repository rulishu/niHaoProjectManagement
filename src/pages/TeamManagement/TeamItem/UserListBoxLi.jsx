import { useState, useEffect } from 'react'
import { Avatar, Row, Col, Input, Button, Empty } from 'uiw'
import styles from './index.module.less'
import './index.css'

const UserListBoxLi = (props) => {
  const { upDateItem, actionListItem, item, index, userList } = props
  const [isAnimation, setIsAnimation] = useState(false) // 下拉框动画
  const [dropDownBox, setDropDownBox] = useState(userList) // 下拉框内容
  const [inputValue, setInputValue] = useState(0) // 搜索框内容
  const [isShow, setIsShow] = useState(false) // 搜索框内容

  useEffect(() => {
    userList?.length && setDropDownBox(userList)
  }, [userList])

  useEffect(() => {
    !isShow && setInputValue(0)
  }, [isShow])

  // 模糊搜索回调
  const searchInput = (value) => {
    setInputValue(value)
    const newData = userList?.filter(
      (item) => item?.userName?.search(`${value}`) !== -1
    )
    setDropDownBox(newData)
  }

  const userListBoxLi = (listArr, index) => {
    return listArr.map((item, idx) => {
      return (
        <li
          className={styles.userListItem}
          key={idx}
          onClick={(e) => {
            setInputValue(0)
            upDateItem(item, index)
          }}>
          <div className={styles.userAvatar}>
            <Avatar
              src={
                item?.uuid ? `/api/file/selectFile/${item?.uuid}` : item?.path
              }>
              {item?.userName}
            </Avatar>
          </div>
          <div className={styles.userName}>{item?.userName}</div>
          <div className={styles.roleName}>{item?.roleName}</div>
        </li>
      )
    })
  }

  return (
    <div>
      <Row gutter={10} className={styles.listItemsRow}>
        <Col span="1">
          <Avatar
            src={
              item?.uuid ? `/api/file/selectFile/${item?.uuid}` : item?.path
            }>
            {item?.userName}
          </Avatar>
        </Col>
        <Col span="10" className={styles.userNameBox}>
          <Input
            value={
              inputValue !== 0 && !Object.keys(item).length
                ? inputValue
                : item.userName || ''
            }
            onBlur={() => setIsShow(false)}
            onClick={() => {
              setIsAnimation(true)
              setIsShow(true)
              searchInput('')
            }}
            onChange={(e) => searchInput(e.target.value)}
            className={styles.userName}
          />
          <div className={styles.userListBox}>
            <div
              className={isAnimation ? styles.animation : styles.unanimation}>
              <ul>
                {dropDownBox?.length ? (
                  userListBoxLi(dropDownBox, index)
                ) : (
                  <Empty />
                )}
              </ul>
            </div>
          </div>
        </Col>
        <Col span="4">
          <Input value={item?.roleName || ''} disabled />
        </Col>
        <Col span="2">
          <Input
            value={item?.sex === 0 ? '男' : item?.sex === 1 ? '女' : ''}
            disabled
          />
        </Col>
        <Col span="5">
          <Input value={item?.joinTeamTime || ''} disabled />
        </Col>
        <Col span="2">
          <Button
            icon="plus"
            basic
            size="small"
            type="primary"
            onClick={() => actionListItem('add', index)}></Button>
          <Button
            icon="close"
            basic
            size="small"
            type="danger"
            onClick={() => actionListItem('del', index)}></Button>
        </Col>
      </Row>
    </div>
  )
}

export default UserListBoxLi

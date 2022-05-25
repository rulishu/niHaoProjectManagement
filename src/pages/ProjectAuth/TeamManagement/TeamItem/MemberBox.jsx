import { useState, useEffect } from 'react'
import { Table, Avatar, Button, List } from 'uiw'
import { useSelector } from 'react-redux'
import styles from './index.module.less'
import UserListBoxLi from './UserListBoxLi'
import './index.css'

const MemberBox = (props) => {
  const {
    team: { teamMemberList },
  } = useSelector((state) => state)
  const { isEdit, setIsEdit, saveEdit, userList } = props
  const [listItems, setListItems] = useState([{}])

  useEffect(() => {
    teamMemberList.length && setListItems(teamMemberList)
  }, [teamMemberList])

  const columns = [
    {
      title: '姓名',
      ellipsis: true,
      key: 'userName',
      render: (text, _, rowDat) => {
        return (
          <span>
            <Avatar
              src={
                rowDat?.uuid
                  ? `/api/file/selectFile/${rowDat?.uuid}`
                  : rowDat?.path
              }>
              {text}
            </Avatar>
            {text}
          </span>
        )
      },
    },
    {
      title: '角色',
      key: 'roleName',
    },
    {
      title: '加入时间',
      key: 'joinTeamTime',
      width: 160,
    },
    {
      title: '邮箱',
      key: 'userEmail',
    },
    {
      title: '手机号',
      key: 'userPhone',
    },
    {
      title: '性别',
      key: 'sex',
      render: (text) => (
        <span>{text === 0 ? '男' : text === 1 ? '女' : ''}</span>
      ),
    },

    {
      title: '操作',
      key: 'edit',
      width: 98,
      render: (text, key, rowData, rowNumber, columnNumber) => (
        <div>
          <Button
            size="small"
            type="danger"
            // onClick={() => console.log('rowData===?', rowData)}
          >
            移出
          </Button>
        </div>
      ),
    },
  ]

  // 点击下拉框回调
  const upDateItem = (item, index) => {
    listItems.splice(index, 1, item)
    setListItems([...listItems])
  }

  // 增加和删除List项
  const actionListItem = (type, index) => {
    let newData = listItems
    if (type === 'add') index ? newData.splice(index, 0, {}) : newData.push({})
    if (type === 'del') {
      if (listItems.length <= 1) return
      newData = listItems.filter((_, idx) => idx !== index)
    }
    setListItems([...newData])
  }

  return (
    <div>
      {isEdit ? (
        <div className={styles.editMemberBox}>
          <List
            dataSource={listItems.map((item, index) => (
              <UserListBoxLi
                key={index}
                upDateItem={upDateItem}
                actionListItem={actionListItem}
                item={item}
                index={index}
                userList={userList}
              />
            ))}
            renderItem={(item) => (
              <List.Item className="editMemberList">{item}</List.Item>
            )}
          />
          <div className={styles.editButtonGroup}>
            <Button
              type="primary"
              style={{ width: 100 }}
              onClick={() => saveEdit(listItems)}>
              保存
            </Button>
            <Button style={{ width: 100 }} onClick={() => setIsEdit(false)}>
              返回
            </Button>
          </div>
        </div>
      ) : (
        <Table columns={columns} data={teamMemberList} />
      )}
    </div>
  )
}

export default MemberBox

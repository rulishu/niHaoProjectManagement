import { useState, useEffect } from 'react'
import { Modal, Table, Checkbox, Tree, Card, Row, Col, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

const AddUser = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState([])
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)
  const [inputValue1, setInputValue1] = useState([])
  const [indeterminate1, setIndeterminate1] = useState(false)
  const [checkAll1, setCheckAll1] = useState(false)
  const [num, setNum] = useState(false)
  const [userInside, setUserInside] = useState([]) //组内用户全选 获取全部用户id
  const [userOutside, setUserOutside] = useState([]) //组外用户全选 获取全部用户id
  const {
    team: { isUsers, teamData, teamMemberList, teamId, modalState },
  } = useSelector((state) => state)
  const {
    rolemanagement: { arrLeverTop },
  } = useSelector((state) => state)

  useEffect(() => {
    let oldInputValue = []
    teamMemberList.map((item, index) => oldInputValue.push(item.value))
    let newInputValue = oldInputValue.filter((n) => n)
    setInputValue(newInputValue)
    if (newInputValue.length > 0) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
    }
  }, [teamMemberList])

  // 关闭弹窗
  const onClose = () => {
    setCheckAll1(false)
    dispatch({
      type: 'team/updateState',
      payload: {
        isUsers: false,
      },
    })
  }
  const columns = [
    {
      title: '人员类型',
      width: 100,
      key: 'personnelType',
    },
    {
      title: '人员',
      width: 500,
      key: 'personnel',
    },
  ]

  //组内用户
  const onChange = (e, list) => {
    let oldData = []
    teamMemberList.map((item, index) => oldData.push(item.value))
    let newData = oldData.filter((n) => n)
    setInputValue(list)
    setIndeterminate(!!list.length && list.length < newData.length)
    setCheckAll(list.length === teamMemberList.length)
  }
  //组内用户
  const onCheckAllChange = (e) => {
    let oldData = []
    teamMemberList.map((item, index) => oldData.push(item.value))
    let newData = oldData.filter((n) => n)
    setUserInside(newData)
    setInputValue(e.target.checked ? newData : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  //组外用户
  const onChange1 = (e, list) => {
    let oldData = []
    teamData.map((item, index) => oldData.push(item.value))
    //过滤null
    let newData = oldData.filter((n) => n)
    setInputValue1(list)
    setIndeterminate1(!!list.length && list.length < newData.length)
    setCheckAll1(list.length === teamData.length)
  }
  //组外用户
  const onCheckAllChange1 = (e) => {
    let oldData = []
    teamData.map((item, index) => oldData.push(item.value))
    //过滤null
    let newData = oldData.filter((n) => n)
    setUserOutside(newData)
    setNum(true)
    setInputValue1(e.target.checked ? newData : [])
    setIndeterminate1(false)
    setCheckAll1(e.target.checked)
  }

  const dataSource = [
    {
      personnelType: (
        <Checkbox
          checked={checkAll}
          indeterminate={indeterminate}
          onChange={(e) => onCheckAllChange(e)}>
          组内用户
        </Checkbox>
      ),
      personnel: (
        <Checkbox.Group
          style={{ width: 660, display: 'flex', flexWrap: 'wrap' }}
          name="softwareReq"
          value={inputValue}
          onChange={(e, data) => onChange(e, data)}>
          {teamMemberList.map((item, idx) => (
            <Checkbox
              style={{ width: 300, marginBottom: 5 }}
              key={idx}
              value={item.value}>
              {item.label}@{item.account}
            </Checkbox>
          ))}
        </Checkbox.Group>
      ),
    },
    {
      personnelType: (
        <Checkbox
          checked={checkAll1}
          indeterminate={indeterminate1}
          onChange={(e) => onCheckAllChange1(e, num)}>
          组外用户
        </Checkbox>
      ),
      personnel: (
        <Checkbox.Group
          style={{ width: 660, display: 'flex', flexWrap: 'wrap' }}
          name="softwareReq"
          value={inputValue1}
          onChange={(e, data) => onChange1(e, data)}>
          {teamData.map((item, idx) => (
            <Checkbox
              style={{ width: 300, marginBottom: 5 }}
              key={idx}
              value={item.value}>
              {item.label}@{item.account}
            </Checkbox>
          ))}
        </Checkbox.Group>
      ),
    },
  ]
  const onConfirm = () => {
    if (checkAll !== true && checkAll1 !== true) {
      dispatch({
        type: 'team/updateMembers',
        payload: {
          teamId: teamId,
          userIdList: inputValue1,
          num: num,
        },
      })
    } else if (checkAll === true && checkAll1 === false) {
      dispatch({
        type: 'team/updateMembers',
        payload: {
          teamId: teamId,
          userIdList:
            userInside === '' ? inputValue1 : inputValue1.concat(userInside),
          num: num,
        },
      })
    } else if (checkAll1 === true && checkAll === false) {
      dispatch({
        type: 'team/updateMembers',
        payload: {
          teamId: teamId,
          userIdList: userOutside,
          num: num,
        },
      })
    } else if (checkAll1 === true && checkAll === true) {
      dispatch({
        type: 'team/updateMembers',
        payload: {
          teamId: teamId,
          userIdList: userOutside?.concat(userInside),
          num: num,
        },
      })
    }
  }
  return (
    <Modal
      title="分组用户管理"
      isOpen={isUsers}
      type="primary"
      width={1000}
      maxWidth={1100}
      useButton={false}
      // confirmText="保存"
      // cancelText="取消"
      // onConfirm={() => onConfirm()}
      maskClosable={false}
      onClosed={onClose}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Row gutter={10}>
          <Col fixed>
            <Card title="部门结构" noHover={true}>
              <Tree
                data={arrLeverTop}
                showLine
                icon={(data, { isOpen, noChild }) => {
                  if (noChild) {
                    return 'file-text'
                  }
                }}
                // onExpand={(key, expanded, data) => {
                //   console.log(key, expanded, data)
                // }}
                // onSelected={(key, selected, item, evn) => {
                //   console.log(key, selected, item, evn)
                // }}
              />
            </Card>
          </Col>
        </Row>
        <Table bordered columns={columns} data={dataSource} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '10px 0',
        }}>
        <Button
          type="primary"
          style={{ width: 80 }}
          onClick={() => onConfirm()}
          loading={modalState}>
          保存
        </Button>
      </div>
    </Modal>
  )
}

export default AddUser

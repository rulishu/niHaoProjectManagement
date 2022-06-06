import { useState } from 'react'
import { Modal, Table, Checkbox, Tree, Card, Row, Col } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

const AddUser = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState([])
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(true)

  const [inputValue1, setInputValue1] = useState([])
  const [indeterminate1, setIndeterminate1] = useState(false)
  const [checkAll1, setCheckAll1] = useState(false)
  const [num, setNum] = useState(false)

  const {
    team: { isUsers, teamData, teamMemberList, teamId },
  } = useSelector((state) => state)
  const {
    rolemanagement: { arrLeverTop },
  } = useSelector((state) => state)
  // 关闭弹窗
  const onClose = () => {
    dispatch({
      type: 'team/updateState',
      payload: { isUsers: false },
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
    //过滤null
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
              style={{ width: 150, marginBottom: 5 }}
              key={idx}
              value={item.value}>
              {item.label}
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
              style={{ width: 150, marginBottom: 5 }}
              key={idx}
              value={item.value}>
              {item.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      ),
    },
  ]
  const onConfirm = () => {
    dispatch({
      type: 'team/updateMembers',
      payload: {
        teamId: teamId,
        userIdList: inputValue1,
        num: num,
      },
    })
  }
  return (
    <Modal
      title="分组用户管理"
      isOpen={isUsers}
      type="primary"
      width={1000}
      maxWidth={1100}
      confirmText="保存"
      cancelText="取消"
      onConfirm={() => onConfirm()}
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
    </Modal>
  )
}

export default AddUser

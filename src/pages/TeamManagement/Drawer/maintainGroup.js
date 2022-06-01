import { useState } from 'react'
import { Modal, Table, Checkbox, Tree, Card, Row, Col } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

const AddUser = () => {
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState([])
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  const [inputValue1, setInputValue1] = useState([])
  const [indeterminate1, setIndeterminate1] = useState(false)
  const [checkAll1, setCheckAll1] = useState(false)

  const {
    team: { isUsers, teamData, teamMemberList },
  } = useSelector((state) => state)
  // console.log('teamData===>33333', teamData)
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

  const onChange = (e, list) => {
    setInputValue(list)
    setIndeterminate(!!list.length && list.length < teamMemberList.length)
    setCheckAll(list.length === teamMemberList.length)
  }
  const onCheckAllChange = (e) => {
    setInputValue(e.target.checked ? teamMemberList : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  //---------
  const onChange1 = (e, list) => {
    setInputValue1(list)
    setIndeterminate1(!!list.length && list.length < teamData.length)
    setCheckAll1(list.length === teamData.length)
  }
  const onCheckAllChange1 = (e) => {
    setInputValue1(e.target.checked ? teamData : [])
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
              value={item.label}>
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
          onChange={(e) => onCheckAllChange1(e)}>
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
              value={item.label}>
              {item.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      ),
    },
  ]
  return (
    <Modal
      title="分组用户管理"
      isOpen={isUsers}
      type="primary"
      width={1000}
      maxWidth={1100}
      confirmText="保存"
      cancelText="取消"
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

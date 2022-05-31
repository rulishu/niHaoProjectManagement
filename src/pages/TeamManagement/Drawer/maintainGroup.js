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
    team: { isUsers, teamData },
  } = useSelector((state) => state)
  console.log('teamData===>33333', teamData)
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

  const demandList = [
    '苏州城外的微笑',
    '张飞',
    '诸葛',
    '董小姐',
    '程响',
    '许嵩天使',
    '许嵩素颜',
    '许嵩医生',
    '许嵩浅唱',
    '许嵩山水之间',
    '许嵩违章动物',
    '许嵩拆西墙',
    '周杰伦兰亭序',
    '周杰伦告白气球',
    '周杰伦晴天',
    '周杰伦七里香',
    '周杰伦稻香',
    '周杰伦听爸爸的话哦',
  ]

  const onChange = (e, list) => {
    setInputValue(list)
    setIndeterminate(!!list.length && list.length < demandList.length)
    setCheckAll(list.length === demandList.length)
  }
  const onCheckAllChange = (e) => {
    setInputValue(e.target.checked ? demandList : [])
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
          {demandList.map((item, idx) => (
            <Checkbox
              style={{ width: 150, marginBottom: 5 }}
              key={idx}
              value={item}>
              {item}
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

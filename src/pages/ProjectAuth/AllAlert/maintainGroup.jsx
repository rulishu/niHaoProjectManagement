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

  const [inputValue2, setInputValue2] = useState([])
  const [indeterminate2, setIndeterminate2] = useState(false)
  const [checkAll2, setCheckAll2] = useState(false)
  const {
    projectAuth: { isUsers },
  } = useSelector((state) => state)

  // 关闭弹窗
  const onClose = () => {
    dispatch({
      type: 'projectAuth/update',
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

  const data = [
    {
      label: '人事部',
      key: '0-0-0',
      children: [
        {
          label: '招聘部',
          key: '0-1-0',
          children: [
            { label: '新洲区', key: '0-1-1' },
            { label: '武昌区', key: '0-1-2' },
            {
              label: 'xx部',
              key: '0-1-3',
              children: [
                { label: '汉南区1', key: '0-1-3-1' },
                { label: '汉南区2', key: '0-1-3-2' },
                { label: '汉南区3', key: '0-1-3-3' },
              ],
            },
          ],
        },
        { label: '福利部', key: '0-2-0' },
      ],
    },
    {
      label: '研发部',
      key: '1-0-0',
      children: [
        { label: '黄浦区', key: '1-0-1' },
        { label: '卢湾区', key: '1-0-2' },
        {
          label: '徐汇区',
          key: '1-0-3',
          children: [
            { label: '半淞园路街道', key: '1-1-0' },
            { label: '南京东路街道', key: '1-2-0' },
            { label: '外滩街道', key: '1-3-0' },
          ],
        },
      ],
    },
    {
      label: '市场部',
      key: '2-0-0',
      children: [
        { label: '东城区', key: '2-1-0' },
        { label: '西城区', key: '2-2-0' },
        {
          label: '崇文区',
          key: '2-3-0',
          children: [
            { label: '东花市街道', key: '2-3-1' },
            { label: '体育馆路街道', key: '2-3-2' },
            { label: '前门街道', key: '2-3-3' },
          ],
        },
      ],
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
  const projectList = ['老铁', '老李', '隔壁老王']
  const softwareReqList = [
    '胡歌',
    '盆浴盐',
    '彭于晏',
    '张学友',
    '黎明',
    '洗脚妹',
    '凤姐',
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
    setIndeterminate1(!!list.length && list.length < projectList.length)
    setCheckAll1(list.length === projectList.length)
  }
  const onCheckAllChange1 = (e) => {
    setInputValue1(e.target.checked ? projectList : [])
    setIndeterminate1(false)
    setCheckAll1(e.target.checked)
  }

  //---------
  const onChange2 = (e, list) => {
    setInputValue2(list)
    setIndeterminate2(!!list.length && list.length < softwareReqList.length)
    setCheckAll2(list.length === softwareReqList.length)
  }

  const onCheckAllChange2 = (e) => {
    setInputValue2(e.target.checked ? softwareReqList : [])
    setIndeterminate2(false)
    setCheckAll2(e.target.checked)
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
          {projectList.map((item, idx) => (
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
          checked={checkAll2}
          indeterminate={indeterminate2}
          onChange={(e) => onCheckAllChange2(e)}>
          外部人员
        </Checkbox>
      ),
      personnel: (
        <Checkbox.Group
          style={{ width: 660, display: 'flex', flexWrap: 'wrap' }}
          name="softwareReq"
          value={inputValue2}
          onChange={(e, data) => onChange2(e, data)}>
          {softwareReqList.map((item, idx) => (
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
                data={data}
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

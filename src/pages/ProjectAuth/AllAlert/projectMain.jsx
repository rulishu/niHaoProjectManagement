import { useState } from 'react'
import { Modal, Table, Checkbox } from 'uiw'
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

  const [inputValue3, setInputValue3] = useState([])
  const [indeterminate3, setIndeterminate3] = useState(false)
  const [checkAll3, setCheckAll3] = useState(false)

  const [inputValue4, setInputValue4] = useState([])
  const [indeterminate4, setIndeterminate4] = useState(false)
  const [checkAll4, setCheckAll4] = useState(false)
  const {
    projectAuth: { isMain },
  } = useSelector((state) => state)

  // 关闭弹窗
  const onClose = () => {
    dispatch({
      type: 'projectAuth/update',
      payload: { isMain: false },
    })
  }
  const columns = [
    {
      title: '模块',
      width: 100,
      key: 'modular',
    },
    {
      title: '方法',
      width: 500,
      key: 'method',
    },
  ]

  const demandList = [
    '提软件需求',
    '批量创建',
    '编辑软件需求',
    '导出软件需求',
    '删除软件需求',
    '软件需求详情',
    '变更软件需求',
    '评审软件需求',
    '批量评审',
    '撤销评审',
    '关闭软件需求',
    '批量关闭',
    '批量修改计划',
    '批量修改阶段',
    '指派软件需求',
    '批量指派',
    '激活软件需求',
    '零用例软件需求',
    '批量编辑',
    '导入软件需求',
    '显示导入内容',
    '导出模板',
    '导入需求库',
    '批量导入需求库',
    '查看关联需求',
    '软件需求列表',
  ]
  const projectList = [
    '编辑项目',
    '项目权限分组',
    '项目创建分组',
    '项目维护权限',
    '团队管理',
    '维护分组用户',
    '项目复制分组',
    '项目编辑分组',
    '启动项目',
    '挂起项目',
    '关闭项目',
    '激活项目',
    '删除项目',
    '项目概况',
    '项目白名单',
    '项目添加白名单',
    '项目删除白名单',
    '关联产品',
    '动态',
    '版本',
    'Bug列表',
    '用例列表',
    '测试单',
    '测试报告',
    '执行列表',
    '团队列表',
    '移除成员',
    '测试',
  ]
  const softwareReqList = [
    '软件需求列表01',
    '软件需求详情02',
    '关联软件需求',
    '按计划关联软件需求',
    '移除软件需求01',
    '批量移除软件需求91',
    '从需求库中导入01',
  ]
  const executionList = [
    '添加执行',
    '日历',
    '日志日历',
    '冲刺日志',
    '工时明细',
    '更新工时',
    '删除任务关系',
    '维护任务关系',
    '查看任务关系',
    '甘特图',
  ]
  const versionList = [
    '创建版本',
    '编辑版本',
    '删除版本',
    '版本详情',
    '关联软件需求01',
    '移除软件需求',
    '批量移除软件需求',
    '关联Bug',
    '移除Bug',
    '批量移除Bug',
    '版本列表',
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

  //---------
  const onChange3 = (e, list) => {
    setInputValue3(list)
    setIndeterminate3(!!list.length && list.length < executionList.length)
    setCheckAll3(list.length === executionList.length)
  }

  const onCheckAllChange3 = (e) => {
    setInputValue3(e.target.checked ? executionList : [])
    setIndeterminate3(false)
    setCheckAll3(e.target.checked)
  }

  //---------
  const onChange4 = (e, list) => {
    setInputValue4(list)
    setIndeterminate4(!!list.length && list.length < versionList.length)
    setCheckAll4(list.length === versionList.length)
  }

  const onCheckAllChange4 = (e) => {
    setInputValue4(e.target.checked ? versionList : [])
    setIndeterminate4(false)
    setCheckAll4(e.target.checked)
  }

  const dataSource = [
    {
      modular: (
        <Checkbox
          checked={checkAll}
          indeterminate={indeterminate}
          onChange={(e) => onCheckAllChange(e)}>
          软件需求
        </Checkbox>
      ),
      method: (
        <Checkbox.Group
          style={{ width: 1000, display: 'flex', flexWrap: 'wrap' }}
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
      modular: (
        <Checkbox
          checked={checkAll1}
          indeterminate={indeterminate1}
          onChange={(e) => onCheckAllChange1(e)}>
          项目
        </Checkbox>
      ),
      method: (
        <Checkbox.Group
          style={{ width: 1000, display: 'flex', flexWrap: 'wrap' }}
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
      modular: (
        <Checkbox
          checked={checkAll2}
          indeterminate={indeterminate2}
          onChange={(e) => onCheckAllChange2(e)}>
          项目软件需求
        </Checkbox>
      ),
      method: (
        <Checkbox.Group
          style={{ width: 1000, display: 'flex', flexWrap: 'wrap' }}
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
    {
      modular: (
        <Checkbox
          checked={checkAll3}
          indeterminate={indeterminate3}
          onChange={(e) => onCheckAllChange3(e)}>
          执行
        </Checkbox>
      ),
      method: (
        <Checkbox.Group
          style={{ width: 1000, display: 'flex', flexWrap: 'wrap' }}
          name="softwareReq"
          value={inputValue3}
          onChange={(e, data) => onChange3(e, data)}>
          {executionList.map((item, idx) => (
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
      modular: (
        <Checkbox
          checked={checkAll4}
          indeterminate={indeterminate4}
          onChange={(e) => onCheckAllChange4(e)}>
          版本
        </Checkbox>
      ),
      method: (
        <Checkbox.Group
          style={{ width: 1000, display: 'flex', flexWrap: 'wrap' }}
          name="softwareReq"
          value={inputValue4}
          onChange={(e, data) => onChange4(e, data)}>
          {versionList.map((item, idx) => (
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
      title="所有权限"
      isOpen={isMain}
      type="primary"
      width={1200}
      maxWidth={1300}
      confirmText="保存"
      cancelText="取消"
      maskClosable={false}
      onClosed={onClose}>
      <Table bordered columns={columns} data={dataSource} />
    </Modal>
  )
}

export default AddUser

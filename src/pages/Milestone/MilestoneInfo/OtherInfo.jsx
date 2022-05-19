import { useState } from 'react'
import { Tabs, Avatar, Icon, Row, Col, Button, Empty, Loader } from 'uiw'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'

const OtherInfo = (props) => {
  const { projectId } = props
  const {
    milestone: { listDataInfo, allLabelData },
    dictionary: { dictDataList },
    loading,
  } = useSelector((state) => state)
  const {
    conduct,
    conductSize,
    finish,
    finishSize,
    unassigned,
    unassignedSize,
  } = listDataInfo
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const goProject = (taskId) => {
    dispatch({
      type: 'project/update',
      payload: { editId: taskId },
    })
    navigate(`/project/taskInfo/${projectId}/${taskId}`, {
      state: { editId: taskId },
    })
  }

  const [activeKey, setActiveKey] = useState('1')

  // 标签块
  const lableBox = (value) => {
    const results = dictDataList?.filter((s) => +s.dictValue === +value)[0]
    return (
      <span
        key={results?.dictCode}
        className={styles.taskTags}
        style={{ backgroundColor: results?.listClass || '#813c858c' }}>
        {results?.dictLabel}
      </span>
    )
  }

  // 数字块
  const numBox = (num) => {
    return (
      <span className={styles.numBox}>
        <span className={styles.num}>{num}</span>
      </span>
    )
  }

  // 任务列表
  const issuesListLi = (title, dataList) => {
    return (
      <ul>
        <li className={styles.liHeader}>
          <span>{title}</span>
          <span className={styles.liHeaderRight}>
            <Icon type="tags-o" />
            <span>{dataList?.length || 0}</span>
          </span>
        </li>
        {dataList?.map((item, index) => {
          return (
            <li key={index}>
              <span
                className={styles.taskTitle}
                onClick={() => goProject(item?.assignmentId)}>
                {item?.assignmentTitle}
              </span>
              <div className={styles.taskBody}>
                <span className={styles.taskLink}>#{item.assignmentId}</span>
                {item?.labels?.map((tagItem) => lableBox(tagItem))}
                <span className={styles.taskAssignPerson}>
                  <Avatar size="mini" className={styles.roleAvatar}>
                    {item.userName}
                  </Avatar>
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  // 标签列表
  const lableListLi = (lableListData) => {
    return (
      <ul>
        {lableListData?.map((item) => (
          <li className={styles.lableLiLe}>
            <div className={styles.lableLiLeft}>
              {lableBox(item?.dictValue)}
            </div>
            <div className={styles.lableLiRight}>
              <Button
                basic
                type="light"
                onClick={() => {
                  navigate(`/project/task/${projectId}`, {
                    state: { projectId },
                  })
                }}>
                {item?.open}个已开启任务
              </Button>
              <Button
                basic
                type="light"
                onClick={() => {
                  navigate(`/project/task/${projectId}`, {
                    state: { projectId },
                  })
                }}>
                {item?.close}个已关闭任务
              </Button>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={styles.infoBox}>
      <div className={styles.tabsHead}>
        <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
          <Tabs.Pane
            label={
              <>
                任务
                {numBox(unassignedSize + finishSize + conductSize || 0)}
              </>
            }
            key="1"
          />
          <Tabs.Pane label={<>标签{numBox(allLabelData?.length)}</>} key="2" />
        </Tabs>
      </div>
      {activeKey === '1' && (
        <div>
          <Loader
            tip="加载中..."
            vertical
            style={{ width: '100%' }}
            bgColor="rgba(0, 0, 0, 0.1)"
            loading={loading.effects.milestone.getMilestone}>
            <>
              <Row gutter={30} className={styles.taskList} justify="flex-start">
                <Col span="8">
                  <div className={styles.taskListLi}>
                    {issuesListLi('未开始的任务（打开和未分配）', unassigned)}
                  </div>
                </Col>
                <Col span="8">
                  <div className={styles.taskListLi}>
                    {issuesListLi('正在进行的任务（打开和已分配）', conduct)}
                  </div>
                </Col>
                <Col span="8">
                  <div className={styles.taskListLi}>
                    {issuesListLi('已完成的任务（已关闭）', finish)}
                  </div>
                </Col>
              </Row>
            </>
          </Loader>
        </div>
      )}
      {activeKey === '2' && (
        <div className={styles.lableListLi}>
          <Loader
            tip="加载中..."
            vertical
            style={{ width: '100%' }}
            bgColor="rgba(0, 0, 0, 0.1)"
            loading={loading.effects.milestone.getAllLabel}>
            <>{allLabelData.length ? lableListLi(allLabelData) : <Empty />}</>
          </Loader>
        </div>
      )}
    </div>
  )
}

export default OtherInfo

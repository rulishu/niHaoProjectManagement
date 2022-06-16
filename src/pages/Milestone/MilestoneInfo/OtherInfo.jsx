import { useState } from 'react'
import {
  Tabs,
  Icon,
  Avatar,
  Row,
  Col,
  Button,
  Empty,
  Loader,
  Tooltip,
} from 'uiw'
import styles from './index.module.less'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './index.css'

const OtherInfo = (props) => {
  const { projectId, goTaskListPage } = props
  const { userAccount } = useParams()
  const {
    milestone: { listDataInfo, allLabelData },
    labels: { listData: labelsListData },
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
    navigate(`/${userAccount}/${projectId}/task/taskInfo/${taskId}`, {
      state: { editId: taskId },
    })
  }

  const [activeKey, setActiveKey] = useState('1')

  // 标签块
  const labelBox = (value) => {
    const results = labelsListData?.filter((s) => s.id === value)[0]
    return (
      <span
        key={results?.id}
        className={styles.taskTags}
        style={
          results?.color === '#ffffff'
            ? { backgroundColor: results?.color || '#813c858c', color: '#333' }
            : { backgroundColor: results?.color || '#813c858c' }
        }>
        {results?.name &&
          (results?.name.length <= 10
            ? results?.name
            : results?.name.slice(0, 10) + '...')}
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
                <span
                  className={styles.taskLink}
                  onClick={() => goProject(item?.assignmentId)}>
                  #{item.assignmentId}
                </span>
                {item?.labels?.map((tagLi) => (
                  <span key={tagLi}>{labelBox(tagLi)}</span>
                ))}
                {item.assigneeUserId ? (
                  <Tooltip
                    placement="top"
                    content={<>指派给{item.assigneeUserName}</>}>
                    <div
                      className={styles.taskAssignPerson}
                      onClick={() => {
                        navigate(`/${item.assigneeUserAccount}`, {
                          state: { assigneeUserId: item?.assigneeUserId },
                        })
                      }}>
                      <Avatar
                        size="mini"
                        src={
                          item?.assigneeUserAvatar &&
                          `/api/file/selectFile/${item?.assigneeUserAvatar}`
                        }
                        className={styles.roleAvatar}>
                        {item.assigneeUserName && item.assigneeUserName[0]}
                      </Avatar>
                    </div>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  // 标签列表
  const labelListLi = (labelListData) => {
    return (
      <ul>
        {labelListData?.map((item) => {
          return (
            <li className={styles.labelLiLe} key={item?.labelId}>
              <div className={styles.labelLiLeft}>
                <span
                  className={styles.taskTags}
                  style={{
                    backgroundColor: item?.label?.color || '#813c858c',
                  }}>
                  {item?.label?.name}
                </span>
              </div>
              <div className={styles.labelLiRight}>
                <Button basic type="light" onClick={() => goTaskListPage(2)}>
                  {item?.open}个已开启任务
                </Button>
                <Button basic type="light" onClick={() => goTaskListPage(3)}>
                  {item?.close}个已完成任务
                </Button>
              </div>
            </li>
          )
        })}
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
        <Loader
          tip="加载中..."
          vertical
          style={{ width: '100%', padding: '20px 0' }}
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
      )}
      {activeKey === '2' && (
        <div className={styles.labelListLi}>
          <Loader
            tip="加载中..."
            vertical
            style={{ width: '100%' }}
            bgColor="rgba(0, 0, 0, 0.1)"
            loading={loading.effects.milestone.getAllLabel}>
            <>{allLabelData.length ? labelListLi(allLabelData) : <Empty />}</>
          </Loader>
        </div>
      )}
    </div>
  )
}

export default OtherInfo

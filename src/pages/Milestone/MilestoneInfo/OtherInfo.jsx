import { useState } from 'react'
import { Tabs, Avatar, Icon, Row, Col } from 'uiw'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './index.css'

const OtherInfo = (props) => {
  const { projectId, listDataInfo } = props
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

  const [activeKey] = useState('1')

  const numBox = (num) => {
    return (
      <span className={styles.numBox}>
        <span className={styles.num}>{num}</span>
      </span>
    )
  }

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
                {item?.labels?.map((tagItem) => (
                  <span
                    key={tagItem?.dictId}
                    className={styles.taskTags}
                    style={{ backgroundColor: tagItem?.dictColour }}>
                    {tagItem?.dictName}
                  </span>
                ))}
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

  return (
    <div className={styles.infoBox}>
      <div className={styles.tabsHead}>
        <Tabs activeKey={activeKey}>
          <Tabs.Pane
            label={
              <>
                任务
                {numBox(
                  unassignedSize || 0 + finishSize || 0 + conductSize || 0
                )}
              </>
            }
            key="1"
          />
        </Tabs>
      </div>
      {activeKey === '1' && (
        <div>
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
        </div>
      )}
    </div>
  )
}

export default OtherInfo

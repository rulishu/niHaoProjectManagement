import { useState } from 'react'
import { Tabs, Avatar, Icon, Row, Col } from 'uiw'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './index.css'

const OtherInfo = (props) => {
  const { listDataInfo } = props
  const { conductSize, finishSize, unassignedSize } = listDataInfo
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const goProject = (taskId) => {
    dispatch({
      type: 'project/update',
      payload: { editId: taskId },
    })
    navigate('/project/taskInfo', {
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
        {dataList.map((item, index) => {
          return (
            <li key={index}>
              <span
                className={styles.taskTitle}
                onClick={() => goProject(item?.assignmentId)}>
                {item.taskTitle || '任务标题'}
              </span>
              <div className={styles.taskBody}>
                <span className={styles.taskLink}>#{12}</span>
                {item?.tags?.map((tagItem) => (
                  <span
                    className={styles.taskTags}
                    style={{ backgroundColor: tagItem?.color }}>
                    {tagItem?.title}
                  </span>
                ))}
                <span
                  className={styles.taskTags}
                  style={{ backgroundColor: '#428BCA' }}>
                  标签
                </span>
                <span
                  className={styles.taskTags}
                  style={{ backgroundColor: '#ff0000' }}>
                  BUG
                </span>
                <span
                  className={styles.taskTags}
                  style={{ backgroundColor: '#8fbc8f' }}>
                  标签标签标签标签
                </span>
                <span className={styles.taskAssignPerson}>
                  <Avatar size="mini" className={styles.roleAvatar}>
                    {item.userName || '名字'}
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
                {numBox(unassignedSize + finishSize + conductSize || 0)}
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
                {issuesListLi('未开始的任务（打开和未分配）', [0, 1])}
              </div>
            </Col>
            <Col span="8">
              <div className={styles.taskListLi}>
                {issuesListLi('正在进行的任务（打开和已分配）', [0])}
              </div>
            </Col>
            <Col span="8">
              <div className={styles.taskListLi}>
                {issuesListLi('已完成的任务（已关闭）', [0])}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default OtherInfo

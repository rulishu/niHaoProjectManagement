import { Tabs, Tooltip, List, Avatar, Icon, Card, Row, Col } from 'uiw'
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

  const issuesList = (issuesLists) => {
    return [
      { assignmentTitle: '修改里程碑分页查询返回值', assignmentStatus: 1 },
      {
        assignmentTitle: '项目统计只统计当前登陆人的任务和',
        assignmentStatus: 1,
      },
    ]?.map((item, index) => {
      return (
        <div key={index} className={styles.issuesList}>
          <Tooltip
            placement="top"
            content={<strong>{item.assignmentTitle}</strong>}>
            <div className={styles.title}>
              <span onClick={() => goProject(item?.assignmentId)}>
                {item.assignmentTitle}
              </span>
            </div>
          </Tooltip>
          <div className={styles.text}>
            #{item.assignmentId}
            {typeLabel(item.assignmentStatus)}
            {item.createName}
          </div>
        </div>
      )
    })
  }
  const typeLabel = (type) => {
    const list = [
      { text: '', bg: '#fff' },
      { text: '已打开', bg: '#d99156' }, // 褐色
      { text: '已完成', bg: '#41b349' }, // 绿色
      { text: '已关闭', bg: '#a7a8bd' }, // 紫色
      { text: '已取消', bg: '#c39953' }, // 灰色
      { text: '进行中', bg: '#008ef0' }, // 蓝色
      { text: '已暂停', bg: '#fbb957' }, // 黄色
    ]
    return (
      <div className={styles.type} style={{ backgroundColor: list[type].bg }}>
        {list[type].text}
      </div>
    )
  }

  const numBox = (num) => {
    return (
      <span className={styles.numBox}>
        <span className={styles.num}>{num}</span>
      </span>
    )
  }

  return (
    <div className={styles.infoBox}>
      <Tabs type="line" activeKey="1" className="milesTab">
        <Tabs.Pane
          label={
            <>
              任务
              {numBox(unassignedSize + finishSize + conductSize || 0)}
            </>
          }
          key="1">
          <div className={styles.issList}>
            <Row justify="space-between" gutter={30}>
              <Col>
                <Card
                  title={<span>未开始的任务（打开和未分配）</span>}
                  extra={
                    <span>
                      <Icon type="tags-o" /> {unassignedSize || 0}
                    </span>
                  }>
                  <div>{issuesList(listDataInfo.unassigned)}</div>
                </Card>
              </Col>
              <Col>
                <Card
                  title={<span>未开始的任务（打开和未分配）</span>}
                  extra={
                    <span>
                      <Icon type="tags-o" /> {conductSize || 0}
                    </span>
                  }>
                  <div>{issuesList(listDataInfo.unassigned)}</div>
                </Card>
              </Col>
              <Col>
                <Card
                  title={<span>未开始的任务（打开和未分配）</span>}
                  extra={
                    <span>
                      <Icon type="tags-o" /> {finishSize || 0}
                    </span>
                  }>
                  <div>{issuesList(listDataInfo.unassigned)}</div>
                </Card>
              </Col>
            </Row>

            {/* <ul>
              <li>
                <div className={styles.head}>
                  <span>未开始的任务（打开和未分配）</span>
                  <span className={styles.nums}>{unassignedSize || 0}</span>
                </div>
                <div>{issuesList(listDataInfo.unassigned)}</div>
              </li>
              <li>
                <div className={styles.head}>
                  <span>正在进行的任务（打开和已分配）</span>
                  <span className={styles.nums}>{conductSize || 0}</span>
                </div>
                {issuesList(listDataInfo.finish)}
              </li>
              <li>
                <div className={styles.head}>
                  <span>已完成的任务（已关闭）</span>
                  <span className={styles.nums}>{finishSize || 0}</span>
                </div>
                {issuesList(listDataInfo.conduct)}
              </li>
            </ul> */}
          </div>
        </Tabs.Pane>
        <Tabs.Pane
          label={<>成员{numBox(listDataInfo?.participateUser?.length || 0)}</>}
          key="2">
          <div className={styles.memberBox}>
            <List bordered={false} active={false}>
              {listDataInfo?.participateUser &&
                listDataInfo?.participateUser?.map((userItem, index) => {
                  return (
                    <List.Item key={userItem.id || index}>
                      <div className={styles.roleItem}>
                        <Avatar
                          size="large"
                          className={styles.roleAvatar}
                          src={userItem.path}>
                          {userItem.userName || '名字'}
                        </Avatar>
                        <div className={styles.roleItemInfo}>
                          <div className={styles.roleName}>
                            {userItem.userName || '名字'}
                          </div>
                          <div className={styles.roleVice}>
                            <Icon type="mobile" />
                            <span>{userItem.userPhone || '电话'}</span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )
                })}
            </List>
          </div>
        </Tabs.Pane>
        <Tabs.Pane
          label={<>标签{numBox(listDataInfo?.participateUser?.length || 0)}</>}
          key="2">
          <div className={styles.memberBox}>
            <List bordered={false} active={false}>
              {listDataInfo?.participateUser &&
                listDataInfo?.participateUser?.map((userItem, index) => {
                  return (
                    <List.Item key={userItem.id || index}>
                      <div className={styles.roleItem}>
                        <Avatar
                          size="large"
                          className={styles.roleAvatar}
                          src={userItem.path}>
                          {userItem.userName || '名字'}
                        </Avatar>
                        <div className={styles.roleItemInfo}>
                          <div className={styles.roleName}>
                            {userItem.userName || '名字'}
                          </div>
                          <div className={styles.roleVice}>
                            <Icon type="mobile" />
                            <span>{userItem.userPhone || '电话'}</span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )
                })}
            </List>
          </div>
        </Tabs.Pane>
      </Tabs>
    </div>
  )
}

export default OtherInfo

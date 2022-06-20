import { List, Row, Col, Icon, Tooltip, Avatar } from 'uiw'
import dayjs from 'dayjs'
import styles from './index.module.less'
import { projectStatus } from '../../utils/utils'
import timeDistance from '@/utils/timeDistance'
import { useNavigate } from 'react-router-dom'
import './style.css'

export default function ListItem(props) {
  const navigate = useNavigate()
  const { data, isIssue, listField, listNavigate, delAssignment, labelsData } =
    props

  const listGoTo = (val) => {
    listNavigate(val)
  }

  if (isIssue) {
    return (
      <List
        className={styles.list}
        dataSource={data}
        bordered={false}
        noHover={true}
        renderItem={(item, index) => {
          const creatData = new Date(item.createTime)
          const creatDataTime = creatData.getTime()
          const timestamp = Date.parse(new Date())
          let newColor = {}
          if (timestamp - creatDataTime <= 86400000) {
            newColor = { backgroundColor: '#008ef00f' }
          }
          return (
            <List.Item
              style={newColor}
              key={index}
              extra={
                <div>
                  <div className={styles.listIssueIcon}>
                    {item.assigneeUserName && (
                      <Tooltip
                        placement="top"
                        content={<>指派给{item.assigneeUserName}</>}>
                        <div
                          className={styles.taskUserName}
                          onClick={() => {
                            navigate(`/${item.assigneeUserAccount}`, {
                              state: { assigneeUserId: item?.assigneeUserId },
                            })
                          }}>
                          {/* <Icon type="user" />
                          <span className={styles.listIconSpan}>
                            {item.assigneeUserName.lenght &&
                            item.assigneeUserName.lenght > 4
                              ? item.assigneeUserName.substring(0, 4) + '...'
                              : item.assigneeUserName}
                          </span> */}
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
                    )}
                    <Tooltip placement="top" content="评论">
                      <div className={styles.taskUserMessage}>
                        <Icon type="message" />
                        <span className={styles.listIconSpan}>
                          {item?.commentNum}
                        </span>
                      </div>
                    </Tooltip>
                    <Tooltip placement="top" content="删除">
                      <div
                        className={styles.taskUserDel}
                        onClick={() => delAssignment(item)}>
                        <Icon type="delete" />
                      </div>
                    </Tooltip>
                  </div>
                  <div style={{ textAlign: 'right', color: '#666' }}>
                    {/* {listField?.updateName
                      ? item[listField.updateName]
                      : item?.updateName}
                    更新于
                    {listField?.updateTime
                      ? item[listField.updateTime]
                      : item?.updateTime} */}
                    更新于
                    {
                      timeDistance(
                        listField?.updateTime
                          ? item[listField.updateTime]
                          : item?.updateTime
                      ).time
                    }
                    前
                  </div>
                </div>
              }>
              <Row gutter={10} className={styles.listRow}>
                <Col onClick={() => listGoTo(item)} className={styles.listCol}>
                  <a href={item?.nav} className={styles.listTitle}>
                    {listField?.title ? item[listField.title] : item.title}
                  </a>

                  <div className={styles.listContent}>
                    # {listField?.issueNo ? item[listField.issueNo] : item.id} ·{' '}
                    {listField?.createName
                      ? item[listField?.createName]
                      : item.createName}
                    {' 创建于 '}
                    {listField?.createTime
                      ? item[listField.createTime]
                      : item?.createTime}{' '}
                    {item?.dueDate && (
                      <Tooltip placement="top" content="计划日期">
                        <span
                          className={`dueDate ${
                            dayjs(item?.dueDate)?.diff(
                              dayjs().format('YYYY-MM-DD'),
                              'hour'
                            ) < 0 && item?.assignmentStatus === 4
                              ? 'redDate'
                              : ''
                          }`}>
                          <Icon type="date" />{' '}
                          {listField?.dueDate
                            ? item[listField.dueDate]
                            : item?.dueDate}
                        </span>
                      </Tooltip>
                    )}
                    <div className={styles.listLabels}>
                      {labelsData?.map((list, index) => {
                        if (item?.labels?.includes(list?.id) && index < 4) {
                          return (
                            <Tooltip key={list?.id} content={list?.name}>
                              <span
                                className={
                                  list?.color
                                    ? styles.listIssueStatus
                                    : styles.nolistIssueTag
                                }
                                style={{
                                  color:
                                    list?.color === '#fff' ||
                                    list?.color === '#ffffff' ||
                                    list?.color === '#FFF' ||
                                    list?.color === '#FFFFFF'
                                      ? '#000'
                                      : '#FFF',
                                  backgroundColor: list?.color,
                                  border: '1px solid rgb(240, 240, 240)',
                                  minWidth: 50,
                                  textAlign: 'center',
                                }}>
                                {list?.name && list?.name.length > 5
                                  ? list?.name.substring(0, 5) + '...'
                                  : list?.name}
                              </span>
                            </Tooltip>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                </Col>
              </Row>
            </List.Item>
          )
        }}
      />
    )
  } else {
    return (
      <List
        className={styles.list}
        dataSource={data}
        bordered={false}
        noHover={true}
        renderItem={(item, index) => {
          return (
            <List.Item {...item} key={index}>
              <Row gutter={10} className={styles.listRow}>
                <Col span={18}>
                  <div>
                    <a href={item.nav} className={styles.listTitle}>
                      {item.title}
                    </a>
                    {item.status ? (
                      <span className={styles.listStatus}>
                        {projectStatus[item.status]}
                      </span>
                    ) : null}
                  </div>
                  <div className={styles.listContent}>{item.content}</div>
                </Col>
                <Col span={6} className={styles.listInfo}>
                  {/* <div className={styles.listIcon}>
                    <Icon type="star-on" />
                    <span className={styles.listIconSpan}>0</span>
                  </div> */}
                  <div className={styles.listIcon}>
                    <Icon type="document" />
                    <span className={styles.listIconSpan}>0</span>
                  </div>
                </Col>
              </Row>
            </List.Item>
          )
        }}
      />
    )
  }
}

import { List, Row, Col, Icon, Tooltip } from 'uiw'
import dayjs from 'dayjs'
import styles from './index.module.less'
import { projectStatus } from '../../utils/utils'
import './style.css'

export default function ListItem(props) {
  const { data, isIssue, listField, listNavigate, delAssignment } = props

  const listGoTo = (val) => {
    listNavigate(val)
  }

  if (isIssue) {
    return (
      <List
        className={`${styles.list} issueList`}
        dataSource={data}
        bordered={false}
        noHover={true}
        renderItem={(item, index) => {
          return (
            <List.Item
              key={index}
              extra={
                <div>
                  <div className={styles.listIssueIcon}>
                    <Tooltip placement="top" content="指派人">
                      <span className={styles.taskUserName}>
                        {item.assigneeUserName && <Icon type="user" />}
                        {item.assigneeUserName}
                      </span>
                    </Tooltip>
                    <Icon type="message" />
                    <span className={styles.listIconSpan}>0</span>
                    <Tooltip placement="top" content="删除">
                      <span
                        className={styles.listIconSpan}
                        onClick={() => delAssignment(item)}>
                        <Icon type="delete" />
                      </span>
                    </Tooltip>
                  </div>
                  '更新于'
                  {listField?.updateTime
                    ? item[listField.updateTime]
                    : item?.updateTime}
                </div>
              }>
              <Row gutter={10} className={styles.listRow}>
                <Col
                  // span={18}
                  onClick={() => listGoTo(item)}
                  className={styles.listCol}>
                  <a href={item?.nav} className={styles.listTitle}>
                    {listField?.title ? item[listField.title] : item.title}
                  </a>

                  <div className={styles.listContent}>
                    # {listField?.issueNo ? item[listField.issueNo] : item.id} ·{' '}
                    创建于{' '}
                    {listField?.createTime
                      ? item[listField.createTime]
                      : item?.createTime}{' '}
                    由{' '}
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
                    {item?.labels
                      ? item?.labels.map((list, index2) => {
                          return (
                            <span
                              key={index2 + index}
                              className={styles.listIssueStatus}
                              style={{ backgroundColor: list?.dictColour }}>
                              {list?.dictName}
                            </span>
                          )
                          // return issueStatus.map((num, index) => {
                          //   if (list === num.statue) {
                          //     return (
                          //         <span
                          //           key={index2 + index}
                          //           className={styles.listIssueStatus}
                          //           style={{ backgroundColor: num.color }}>
                          //           {num.text}
                          //         </span>
                          //     )
                          //   }
                          //   return <Fragment key={index2 + index} />
                          // })
                        })
                      : null}
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

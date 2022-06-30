import { Empty, Avatar, Loader } from 'uiw'
import { useSelector } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'
import { useEffect, useState } from 'react'
import LinkText from '@/components/LinkText'

const ProjectList = (props) => {
  const {
    userHome: { user, userDynamics },
    loading,
  } = useSelector((state) => state)
  const { goSpecifyPage } = props
  const [newUserDynamicsList, setNewUserDynamicsList] = useState([])

  useEffect(() => {
    setNewUserDynamicsList(userDynamics.slice(0, 100))
    window.addEventListener('scroll', handleScroll, true)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDynamics])

  const handleScroll = (e) => {
    let el = e && e.target
    // console.log('clientHeight',el.scrollTop, el.clientHeight, el.scrollHeight);
    if (el?.scrollTop + el?.clientHeight + 2 >= el?.scrollHeight) {
      if (newUserDynamicsList.length !== userDynamics.length) {
        setNewUserDynamicsList([
          ...newUserDynamicsList,
          ...userDynamics.slice(
            newUserDynamicsList.length,
            newUserDynamicsList.length + 100
          ),
        ])
      }
    }
  }

  // 任务操作类型
  const dynamicType = {
    0: '',
    1: '操作：',
    2: '评论：',
  }

  return (
    <div
      className={styles.userAllDynamicList}
      onScroll={(e) => {
        handleScroll(e)
      }}>
      <Loader
        tip="所有动态加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.userHome.getUserInfo}>
        <ul>
          {newUserDynamicsList?.length ? (
            newUserDynamicsList.map((item, index) => {
              return (
                <li className={styles.eventItem} key={index}>
                  <div className={styles.avatar}>
                    <Avatar
                      src={
                        user?.avatar
                          ? `/api/file/selectFile/${user?.avatar}`
                          : ''
                      }>
                      {user?.nickName && user?.nickName[0]}
                    </Avatar>
                  </div>
                  <div className={styles.dynamicTop}>
                    <span className={styles.name}>{item?.createName}</span>
                    <span className={styles.time}>
                      {timeDistance(item?.updateTime || item?.createTime)?.time}
                      前
                    </span>
                  </div>
                  <div className={styles.dynamicBot}>
                    <span
                      className={item.projectUrl ? styles.clickOn : ''}
                      onClick={() =>
                        item.projectUrl &&
                        goSpecifyPage({ path: `${item.projectUrl}` })
                      }>
                      {item?.projectName}
                    </span>
                    {item?.assignmentTitle && (
                      <>
                        <span style={{ color: '#008ef0' }}> / </span>
                        <span
                          className={
                            item.projectUrl && item?.assignmentId
                              ? styles.clickOn
                              : ''
                          }
                          onClick={() =>
                            item.projectUrl &&
                            item?.assignmentId &&
                            goSpecifyPage({
                              path: `${item.projectUrl}/task/taskInfo/${item?.assignmentId}`,
                            })
                          }>
                          {item?.assignmentTitle}
                        </span>
                      </>
                    )}
                  </div>
                  <div className={styles.dynamicCon}>
                    {item.historyType === 1 ? (
                      <span>
                        {dynamicType[item.type]}
                        {item.operatingRecords}
                        <LinkText link={`${item?.projectUrl}`}>
                          【{item?.projectName}】
                        </LinkText>
                      </span>
                    ) : item.historyType === 2 ? (
                      <span>
                        {dynamicType[item.type]}
                        {item.operatingRecords}
                        <LinkText
                          link={`${item?.projectUrl}/task/taskInfo/${item.assignmentId}`}>
                          {' '}
                          #{item?.assignmentId}
                        </LinkText>
                      </span>
                    ) : item.historyType === 3 ? (
                      <span>
                        {dynamicType[item.type]}
                        {item.operatingRecords} 指派给了 @
                        {item?.assignmentUserName}
                      </span>
                    ) : item.historyType === 4 ? (
                      <span>
                        {' '}
                        {dynamicType[item.type]} {item.operatingRecords}{' '}
                        指派人取消了
                      </span>
                    ) : item.historyType === 5 ? (
                      <span>
                        {dynamicType[item.type]}
                        {item.operatingRecords}
                        <LinkText
                          link={`${item?.projectUrl}/milestone/milestoneInfo/${item.milestonesId}`}
                          value={`${item.milestonesTitle}`}
                        />
                      </span>
                    ) : item.historyType === 6 || item.historyType === 7 ? (
                      <span>
                        {dynamicType[item.type]}
                        {item.operatingRecords}
                        <LinkText
                          link={`${item?.projectUrl}/milestone/milestoneInfo/${item.milestonesId}`}
                          value={`${item.milestonesTitle}`}
                        />
                      </span>
                    ) : item.historyType === 8 ? (
                      <span>
                        {' '}
                        {dynamicType[item.type]} {item.operatingRecords}
                        截止日期移除了
                      </span>
                    ) : item.historyType === 9 ? (
                      <span>
                        {' '}
                        {dynamicType[item.type]} {item.operatingRecords}标签{' '}
                      </span>
                    ) : item.historyType === 10 ? (
                      <span>
                        {' '}
                        {dynamicType[item.type]} {item.operatingRecords}标签{' '}
                      </span>
                    ) : item.historyType === 11 ? (
                      <span>
                        {item.type === 3 ? '回复:' : '评论:'}
                        {item.operatingRecords}
                        {/* 1:记录 2:评论 3:回复 */}
                      </span>
                    ) : item.historyType === 12 ||
                      item.historyType === 13 ||
                      item.historyType === 14 ||
                      item.historyType === 15 ? (
                      <span>
                        {' '}
                        {dynamicType[item.type]} {item.operatingRecords}
                        <LinkText
                          link={`${item?.projectUrl}/task/taskInfo/${item.assignmentId}`}>
                          {' '}
                          #{item?.assignmentId}
                        </LinkText>
                      </span>
                    ) : (
                      ''
                    )}
                    {/* + (item?.operatingRecords || '')} */}
                  </div>
                </li>
              )
            })
          ) : (
            <Empty style={{ padding: '30px 0' }} />
          )}
        </ul>
      </Loader>
    </div>
  )
}

export default ProjectList

import { Empty, Avatar, Loader } from 'uiw'
import { useSelector } from 'react-redux'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'
import { useEffect, useState } from 'react'

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
    // console.log('el',el);
    // let scrollTop = document.documentElement.scrollTop; // 滚动条滚动高度
    // let clientHeight = document.documentElement.clientHeight; // 可视区域高度
    // let scrollHeight = document.documentElement.scrollHeight; //滚动内容高度

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
                    {'评论：' + (item?.operatingRecords || '')}
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

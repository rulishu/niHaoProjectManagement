import { useEffect } from 'react'
import { Card, Steps, Avatar, Empty } from 'uiw'
import { useSelector } from 'react-redux' //useDispatch
import { navigate } from '@uiw-admin/router-control'
// import { useParams } from 'react-router-dom'
import styles from './index.module.less'
import dayjs from 'dayjs'
import { convertToString } from '@/utils/utils'
import LinkText from '@/components/LinkText'
import { Label } from '@/components'

export default function AllTasks() {
  // const dispatch = useDispatch()
  const {
    projectoverview: { projectMembersList, projectDynamicsList, allDataSource }, //assignmentList
  } = useSelector((state) => state)
  // const { userAccount } = useParams()
  const allDataSources = allDataSource?.milesWorkVoList

  // 跳转里程碑详情
  const goMilestones = (milestonesId) => {
    allDataSource?.projectUrl &&
      navigate(
        `${allDataSource?.projectUrl}/milestone/milestoneInfo/${milestonesId}`
      )
  }

  //项目成员-路由跳转
  const goRouter = (item) => {
    navigate(`/${item}`)
  }
  useEffect(() => {
    // assInfo()
  }, [])
  // const assInfo = (e,inx,) =>{
  //   console.log('e=>',e,'inx',inx,);
  //   dispatch({
  //     type:'projectoverview/getSelectById',
  //     payload:{
  //       projectId:e,
  //       id:inx,
  //     }
  //   })
  //   //`【#${itm?.assignmentId}】`
  // }
  // console.log('projectDynamicsList', projectDynamicsList)
  // console.log('assignmentList',assignmentList);

  //标签
  const labelBox = (items, value = []) => {
    console.log('items', items)
    return items?.map((item) => {
      console.log('item:::>', item)
      return (
        <Label color={item.color} key={item?.id}>
          {item.name}
        </Label>
      )
    })
  }

  return (
    <div style={{ width: '30%', maxWidth: 300 }}>
      <Card
        title="里程碑"
        bordered={false}
        style={{ minWidth: 300, height: 400 }}>
        <div className={styles.milestoneInfoList}>
          <ul>
            <li className={styles.milInfoLiHead}>
              <div className={styles.itemName}>里程碑名称</div>
              <div className={styles.itemTime}>结束时间</div>
              <div className={styles.itemProg}>显示进度</div>
            </li>
            {allDataSources?.length === 0 ? (
              <Empty description={false} />
            ) : (
              allDataSources?.map((item) => {
                return (
                  <li
                    className={styles.milInfoLiFooter}
                    key={item?.milestonesId}
                    onClick={() => goMilestones(item?.milestonesId)}>
                    <div className={styles.itemName}>
                      {item?.milestonesTitle}
                    </div>
                    <div className={styles.itemTime}>
                      {item?.dueTime &&
                        dayjs(item?.dueTime).format('YYYY/MM/DD')}
                    </div>
                    <div className={styles.itemProg}>
                      {item?.rate === '0.00%' ? '0%' : item?.rate}
                    </div>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </Card>
      <Card
        title="最新动态"
        bordered={false}
        style={{ marginTop: 15, marginBottom: 15, height: 460 }}>
        <div style={{ height: 393, overflowX: 'hidden', overflowY: 'auto' }}>
          {projectDynamicsList && projectDynamicsList.length > 0 ? (
            <Steps
              direction="vertical"
              progressDot
              status="error"
              current={projectDynamicsList?.length}
              style={{ padding: '20px 0' }}>
              {projectDynamicsList?.map((itm, key) => {
                // const one = itm?.operatingRecords?.match(/@(\S*) /)?.at(1)
                return (
                  <Steps.Step
                    title={convertToString(itm?.createTime)}
                    key={key}
                    description={
                      <div className={styles.mouseList}>
                        <LinkText
                          link={`/${itm.userName}`}
                          value={itm?.nickName}
                        />
                        <LinkText
                          className={styles.mouseList}
                          color="gray"
                          link={`/${itm?.userName}`}>
                          @{itm?.userName}
                        </LinkText>
                        {itm.historyType === 1 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}`}
                              value={`【${itm.projectName}】`}
                            />
                          </span>
                        ) : itm.historyType === 2 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                          </span>
                        ) : itm.historyType === 3 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                            指派给了
                            <LinkText
                              color="gray"
                              link={`/${itm?.assignmentUserName}`}
                              value={`@${itm?.assignmentUserName}`}
                            />
                          </span>
                        ) : itm.historyType === 4 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                            指派人取消了
                          </span>
                        ) : itm.historyType === 5 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm.userName}/${itm.projectId}/milestone/milestoneInfo/${itm.milestonesId}`}
                              value={`${itm.milestonesTitle}`}
                            />
                          </span>
                        ) : itm.historyType === 6 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm.userName}/${itm.projectId}/milestone/milestoneInfo/${itm.milestonesId}`}
                              value={`${itm.milestonesTitle}`}
                            />
                          </span>
                        ) : itm.historyType === 7 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            {/* {itm.dueDate} */}
                          </span>
                        ) : itm.historyType === 8 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                            移除截止日期
                          </span>
                        ) : itm.historyType === 9 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                            <span className={styles.labelBox}>
                              {labelBox(itm?.labelsInfo)}
                            </span>
                            任务标签
                          </span>
                        ) : itm.historyType === 10 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />{' '}
                            任务标签
                          </span>
                        ) : itm.historyType === 11 ? (
                          <span>
                            在任务
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                            {/* 1:记录 2:评论 3:回复 */}
                            {itm?.type === 3 ? '回复' : '评论'}
                            {convertToString(itm?.operatingRecords)}
                            {/* <LinkText link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`} value={`#${itm?.assignmentId}`} */}
                            {/* /> */}
                          </span>
                        ) : itm.historyType === 12 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                          </span>
                        ) : itm.historyType === 13 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                          </span>
                        ) : itm.historyType === 14 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                          </span>
                        ) : itm.historyType === 15 || itm.historyType === 16 ? (
                          <span>
                            {convertToString(itm?.operatingRecords)}
                            <LinkText
                              link={`/${itm?.userName}/${itm?.projectId}/task/taskInfo/${itm?.assignmentId}`}
                              value={`#${itm?.assignmentId}`}
                            />
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    }></Steps.Step>
                )
              })}
            </Steps>
          ) : (
            <div style={{ margin: 'auto' }}>
              <Empty />
            </div>
          )}
        </div>
      </Card>
      <Card
        title="项目成员"
        bordered={false}
        style={{ height: 460, overflowX: 'hidden', overflowY: 'auto' }}>
        <div className={styles.memberBox}>
          {projectMembersList && projectMembersList.length > 0 ? (
            projectMembersList.map((item, idx) => {
              return (
                <div key={idx} className={styles.memberItem}>
                  <div
                    className={styles.memberItemLi}
                    onClick={() => goRouter(item?.userName)}>
                    <Avatar
                      size="large"
                      src={
                        item.avatar?.substring(0, 4) === 'http'
                          ? item.avatar
                          : item.avatar?.substring(0, 4) !== 'http' &&
                            item.avatar !== ''
                          ? `/api/file/selectFile/${item.avatar}`
                          : ''
                      }>
                      {item?.nickName && item?.nickName[0]}
                    </Avatar>
                  </div>
                  <span
                    className={styles.memberName}
                    onClick={() => goRouter(item?.userName)}>
                    {item?.nickName}
                  </span>
                </div>
              )
            })
          ) : (
            <div style={{ margin: 'auto' }}>
              <Empty />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

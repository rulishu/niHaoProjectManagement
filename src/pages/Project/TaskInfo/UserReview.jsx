import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useNavigate, useParams } from 'react-router-dom'
import { Avatar, Button, Tooltip, Modal } from 'uiw'
import FromMD from './fromMD'
import styles from './taskEvent.module.less'
import timeDistance from '@/utils/timeDistance'
// import LinkText from '@/components/LinkText'

const UserReview = (props) => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { projectId, userAccount } = params
  const {
    projectuser: { userSelectAllList },
    milestone: { milepostaData },
    labels: { listData },
    projectTasks: { replyConData, taskInfoData, editCommentData },
  } = useSelector((state) => state)
  const curUser = JSON.parse(localStorage.getItem('userData'))

  const { item, tier = 1, showReview, setShowReview, updateData } = props

  // 编辑组件是否打开
  const [isEdit, setIsEdit] = useState(false)

  // 删除评论弹窗
  const [alertShow, setAlertShow] = useState(false)

  // 1 : 回复 2 编辑
  const [editOrReply, setEditOrReply] = useState(1)

  // 1 : 回复 2 编辑
  const [isCurUser, setIsCurUser] = useState(false)

  // 判断是否是当前评论
  useEffect(() => {
    setIsCurUser(curUser?.admin || curUser?.userId === item?.createId)
  }, [curUser?.admin, curUser?.userId, item?.createId])

  // 判断是否是当前评论
  useEffect(() => {
    setIsEdit(showReview === item?.taskHistoryId)
  }, [showReview, item])

  // 点击回复与评论回调函数
  const strikeEditOrReply = (type, data) => {
    dispatch({
      type: 'projectTasks/update',
      payload: { editCommentData: { operatingRecords: data } },
    })
    setIsEdit(!isEdit)
    setEditOrReply(type)
    setShowReview(item?.taskHistoryId)
  }

  // 编辑或回复评论
  const subEditOrReply = () => {
    const { assignmentId, projectId, taskHistoryId } = item
    const callback = () => {
      setShowReview(0)
      setIsEdit(false)
    }
    const action =
      editOrReply === 1
        ? 'projectTasks/addTaskComment'
        : editOrReply === 2
        ? 'projectTasks/editTaskComment'
        : ''

    const params =
      editOrReply === 1
        ? {
            operatingRecords: replyConData.operatingRecords,
            parentId: taskHistoryId,
            projectId,
            assignmentId,
          }
        : editOrReply === 2
        ? {
            ...editCommentData,
            taskHistoryId,
            operatingRecords:
              editCommentData.operatingRecords || item?.operatingRecords,
          }
        : {}
    dispatch({
      type: action,
      payload: { params, callback, isType: 3 },
    })
  }

  // MD文档编译器
  const editContentBox = (editData, editType) => {
    const newEditData = editType === 1 ? replyConData : editCommentData
    return (
      <div className={styles.editContent}>
        <FromMD
          upDate={updateData}
          submit={subEditOrReply}
          editName={
            editOrReply === 1
              ? 'replyConData'
              : editOrReply === 2
              ? 'editCommentData'
              : 'commentData'
          }
          editData={editType === 2 ? newEditData : ''}
          fromValue="operatingRecords"
          btnName={editOrReply === 1 ? '回复' : '保存'}
          tributeList={userSelectAllList}
          // isComment={true}
          isEdit={isEdit}
          onClose={() => setIsEdit(false)}
        />
      </div>
    )
  }
  const parsingMdValue = (value) => {
    let newValue = ` ${value} `
    // type:1 人员 ，2 任务，3 里程碑 ，4 标签
    const taskInfoObj = {
      people: {
        className: styles.styleP,
        type: 1,
        regExp: /@(?<people>.*?)\s/g,
        tag: '@',
      },
      task: {
        className: styles.styleP,
        type: 2,
        regExp: /#(?<task>.*?)\s/g,
        tag: '#',
      },
      milestone: {
        className: styles.styleP,
        type: 3,
        regExp: /%(?<milestone>.*?)\s/g,
        tag: '%',
      },
      label: {
        className: styles.mdLabel,
        type: 4,
        regExp: /~(?<label>.*?)\s/g,
        tag: '~',
      },
    }
    Object?.entries(taskInfoObj)?.forEach((item) => {
      if (value?.match(item[1]?.regExp)?.length) {
        for (const eveyValue of newValue?.matchAll(item?.at(1).regExp)) {
          const name = eveyValue?.groups[item[0]]
          const tag = item[1].tag
          const type = item[1].type
          const className = item[1].className
          let notClick = false
          let id = 0
          if (item[0] === 'milestone') {
            id = milepostaData?.filter((item) => {
              return item?.milestonesTitle === name
            })[0]?.milestonesId
            notClick = id === 0
          }
          if (item[0] === 'people') {
            notClick = !userSelectAllList?.filter(
              (item) => item?.userAcount === name
            ).length
          }
          let labelColor = ''
          if (item[0] === 'label') {
            labelColor = listData?.filter((item) => {
              return item?.name === name
            })[0]?.color
            newValue = newValue?.replace(
              tag + name + ' ',
              `<span><table className=${className}><tr><td bgcolor=${labelColor}>${name}</td></tr></table></span>`
            )
            // return newValue
          }
          if (item[0] !== 'label' && !notClick) {
            newValue = newValue?.replace(
              tag + name + ' ',
              `<span 
              className=${className}
              data-type=${type} 
              data-value=${item[0] === 'milestone' ? id : name}>
               ${item[0] === 'label' ? name : tag + name}
            </span>`
            )
          }
        }
      }
    })
    return newValue
  }

  const mdClick = (e) => {
    const type = e?.target?.dataset?.type
    const value = e?.target?.dataset?.value
    const typeObj = {
      1: { link: `/${value?.trim()}` },
      2: { link: `/${userAccount}/${projectId}/task/taskInfo/${value}` },
      3: {
        link: `/${userAccount}/${projectId}/milestone/milestoneInfo/${value}`,
      },
      4: { link: '/', noGo: true },
    }

    if (type && !typeObj[type]?.noGo) {
      navigate(`${typeObj[type].link.trim()}`)
      if (+type === 2 || +type === 3) {
        window.location.reload()
      }
    }
  }
  // 显示MD文档
  const showMDBox = (data) => {
    // const atPerson=data?.match(/@(\S*) /)?.at(1)
    // const datsas= userSelectAllList?.filter(function(item){
    //   return data?.includes(item?.memberName);
    // })

    // onClick={()=>{  navigate(`/${atPerson}`) }}
    return (
      <div
        data-color-mode="light"
        style={{ flex: 1 }}
        onClick={(e) => mdClick(e)}>
        <MarkdownPreview
          source={parsingMdValue(data) || ''}
          style={{ width: '100%', display: 'flex' }}
          className={styles.textTitle}
        />
      </div>
    )
  }

  return (
    <div className={styles.eventLiBox} key={item?.taskHistoryId}>
      <div className={styles.eventLiIcon}>
        <Avatar
          src={item?.avatar ? `/api/file/selectFile/${item?.avatar}` : ''}>
          {item?.nickName && item?.nickName[0]}
        </Avatar>
      </div>
      <div className={styles.eventLiContent}>
        <div className={styles.messageHeader}>
          <div className={styles.info}>
            {item?.nickName}
            {/* createName 变成实时更新的 nickName */}
            <span style={{ color: '#666' }}> @{item?.userName} </span>·{' '}
            <span style={{ color: '#666' }}>
              {timeDistance(item?.createTime).time}
              {timeDistance(item?.createTime).status ? '前' : '后'}{' '}
            </span>
          </div>
          <div className={styles.actions}>
            {item?.createName === taskInfoData?.createName &&
              !(editOrReply === 2 && isEdit) && (
                <Tooltip placement="top" content={'此用户是此问题的作者'}>
                  <span
                    className={styles.namebox}
                    style={{
                      backgroundColor: 'white',
                      color: '#666',
                    }}>
                    {'作者'}
                  </span>
                </Tooltip>
              )}
            {item?.memberRole && !(editOrReply === 2 && isEdit) && (
              <Tooltip
                placement="top"
                content={`此用户在管理项目中具有${
                  item?.memberRole === 1
                    ? '开发'
                    : item.memberRole === 2
                    ? '测试'
                    : '项目管理者'
                }角色`}>
                <span
                  className={styles.namebox}
                  style={{
                    backgroundColor: 'white',
                    color: '#666',
                  }}>
                  {item?.memberRole === 1
                    ? '开发'
                    : item?.memberRole === 2
                    ? '测试'
                    : '项目管理者'}
                </span>
              </Tooltip>
            )}
            {tier === 1 && !(editOrReply === 2 && isEdit) && (
              <Tooltip placement="top" content="回复">
                <Button
                  icon="message"
                  basic
                  size="small"
                  type="light"
                  onClick={() => strikeEditOrReply(1, '')}
                />
              </Tooltip>
            )}
            {isCurUser && (
              <Tooltip placement="top" content="删除">
                <Button
                  icon="delete"
                  basic
                  size="small"
                  type="light"
                  onClick={() => setAlertShow(2)}
                />
              </Tooltip>
            )}
            {isCurUser && !(editOrReply === 1 && isEdit) && (
              <Tooltip placement="top" content="编辑">
                <Button
                  icon="edit"
                  basic
                  size="small"
                  type="light"
                  onClick={() => strikeEditOrReply(2, item?.operatingRecords)}
                />
              </Tooltip>
            )}
          </div>
        </div>
        <div className={styles.messageContent}>
          {(editOrReply !== 2 || !isEdit) && showMDBox(item?.operatingRecords)}
          {isEdit && editContentBox(item, editOrReply)}
        </div>
      </div>
      <Modal
        title="删除提示"
        isOpen={alertShow}
        confirmText="确定"
        cancelText="取消"
        icon="information"
        onClosed={() => setAlertShow(false)}
        type="danger"
        content={`是否确认删除本条评论！`}
        onConfirm={() => {
          dispatch.projectTasks.delTaskComment(item)
        }}></Modal>
    </div>
  )
}
export default UserReview

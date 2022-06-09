import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Steps, Icon, Tooltip, Alert } from 'uiw'
import FromMD from './fromMD'
import styles from './index.module.less'
import MarkdownPreview from '@uiw/react-markdown-preview'

const Comment = (props) => {
  const dispatch = useDispatch()
  const {
    project: {
      commentData,
      editCommentData,
      editState,
      replyConState,
      replyConData,
      replyState,
      replyCommentData,
      taskInfoData,
    },
    projectuser: { userSelectAllList },
  } = useSelector((state) => state)
  const [alertShow, setAlertShow] = useState(false)
  const [editParameter, setEditParameter] = useState({})
  const userId = JSON.parse(localStorage.getItem('userData'))?.userId
  const stepIcon = {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 5,
    paddingTop: 0,
  }
  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }
  const addComment = () => {
    dispatch.project.getAddComment()
  }
  //编辑评论 回复
  const goSaveComment = (type) => {
    const newOperatingRecords =
      type === 'comment'
        ? editCommentData.operatingRecords
        : replyConData.operatingRecords
    dispatch.project.getEditComment({
      ...editParameter,
      operatingRecords: newOperatingRecords,
    })
  }
  //回复评论
  const goReplyComment = () => {
    dispatch.project.getAddComment({
      operatingRecords: replyCommentData.operatingRecords,
      parentId: replyCommentData.taskHistoryId,
      projectId: replyCommentData.projectId,
    })
  }
  const handleComment = (detail, item) => {
    setEditParameter(
      detail === 'del' || detail === 'delSub'
        ? {
            id: item.taskHistoryId,
            projectId: item.projectId,
          }
        : {
            taskHistoryId: item.taskHistoryId,
            projectId: item.projectId,
          }
    )
    if (detail === 'del' || detail === 'delSub') {
      setAlertShow(true)
    } else if (detail === 'edit') {
      updateData({
        editCommentData: item,
        editState: true,
      })
    } else if (detail === 'editSub') {
      updateData({
        replyConData: item,
        replyConState: true,
      })
    } else if (detail === 'close') {
      updateData({
        editState: false,
      })
    }
    if (detail === 'reply') {
      updateData({
        replyCommentData: { ...item, operatingRecords: '' },
        replyState: true,
      })
    } else if (detail === 'closeReply') {
      updateData({
        replyState: false,
      })
    }
    if (detail === 'cancelSub') {
      updateData({
        replyConState: false,
      })
    }
  }
  return (
    <>
      <div className={styles.stepsWrap}>
        <Steps direction="vertical" style={{ padding: '20px 0' }}>
          {taskInfoData?.managerAssignmentHistories?.length > 0
            ? taskInfoData?.managerAssignmentHistories.map((item, index) => {
                return item.type === 1 ? (
                  <Steps.Step
                    icon={<Icon style={stepIcon} type="user" />}
                    style={{ paddingBottom: 15, display: 'flex' }}
                    title={item?.operatingRecords || ''}
                    key={index}
                  />
                ) : item.type === 2 ? (
                  <Steps.Step
                    style={{ paddingBottom: 15, display: 'flex' }}
                    icon={<Icon style={stepIcon} type="message" />}
                    description={
                      <>
                        {editState &&
                        editCommentData.taskHistoryId === item.taskHistoryId ? (
                          <FromMD
                            upDate={updateData}
                            submit={() => goSaveComment('comment')}
                            editName="editCommentData"
                            editData={editCommentData}
                            fromValue={'operatingRecords'}
                            btnName="提交"
                            isComment={true}
                          />
                        ) : replyState &&
                          replyCommentData.taskHistoryId ===
                            item.taskHistoryId ? (
                          <div data-color-mode="light" style={{ flex: 1 }}>
                            <MarkdownPreview
                              source={item?.operatingRecords || ''}
                              style={{ marginBottom: 10, width: '100%' }}
                            />
                            <div className={styles.spanIconR}>
                              <Tooltip placement="top" content="取消回复">
                                <span
                                  onClick={() =>
                                    handleComment('closeReply', item)
                                  }>
                                  <Icon type="close" />
                                </span>
                              </Tooltip>
                            </div>
                            <FromMD
                              upDate={updateData}
                              submit={goReplyComment}
                              editName="replyCommentData"
                              editData={replyCommentData}
                              fromValue={'operatingRecords'}
                              btnName="提交"
                              isComment={true}
                            />
                          </div>
                        ) : (
                          <div data-color-mode="light" style={{ flex: 1 }}>
                            <MarkdownPreview
                              source={item?.operatingRecords || ''}
                              style={{ width: '100%' }}
                            />
                          </div>
                        )}
                        {item.managerAssignmentHistorieList &&
                          item.managerAssignmentHistorieList.length > 0 && (
                            <Steps
                              direction="vertical"
                              style={{ paddingTop: 20 }}>
                              {item.managerAssignmentHistorieList.map(
                                (subItem, subIndex) => {
                                  return (
                                    <Steps.Step
                                      icon={
                                        <Icon style={stepIcon} type="message" />
                                      }
                                      style={{ display: 'flex', marginLeft: 5 }}
                                      title={
                                        <div className={styles.buttonIcon}>
                                          <p>
                                            {subItem.createTime +
                                              ',' +
                                              subItem.createName}
                                            回复{item.createName}评论
                                          </p>
                                          {userId === subItem.createId && (
                                            <div className={styles.spanIcon}>
                                              {replyConState &&
                                              replyConData.taskHistoryId ===
                                                subItem.taskHistoryId ? (
                                                <Tooltip
                                                  placement="top"
                                                  content="取消编辑">
                                                  <span
                                                    onClick={() =>
                                                      handleComment(
                                                        'cancelSub',
                                                        subItem
                                                      )
                                                    }>
                                                    <Icon type="close" />
                                                  </span>
                                                </Tooltip>
                                              ) : (
                                                <>
                                                  <Tooltip
                                                    placement="top"
                                                    content="编辑">
                                                    <span
                                                      onClick={() =>
                                                        handleComment(
                                                          'editSub',
                                                          subItem
                                                        )
                                                      }>
                                                      <Icon type="edit" />
                                                    </span>
                                                  </Tooltip>
                                                  <Tooltip
                                                    placement="top"
                                                    content="删除">
                                                    <span
                                                      onClick={() =>
                                                        handleComment(
                                                          'delSub',
                                                          subItem
                                                        )
                                                      }>
                                                      <Icon type="delete" />
                                                    </span>
                                                  </Tooltip>
                                                </>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      }
                                      description={
                                        replyConState &&
                                        replyConData.taskHistoryId ===
                                          subItem.taskHistoryId ? (
                                          <FromMD
                                            upDate={updateData}
                                            submit={() =>
                                              goSaveComment('reply')
                                            }
                                            editName="replyConData"
                                            editData={replyConData}
                                            fromValue={'operatingRecords'}
                                            btnName="提交"
                                            isComment={true}
                                          />
                                        ) : (
                                          <div
                                            data-color-mode="light"
                                            style={{ flex: 1 }}>
                                            <MarkdownPreview
                                              source={
                                                subItem?.operatingRecords || ''
                                              }
                                              style={{ width: '100%' }}
                                            />
                                          </div>
                                        )
                                      }
                                      key={subIndex}
                                    />
                                  )
                                }
                              )}
                            </Steps>
                          )}
                      </>
                    }
                    title={
                      <div className={styles.buttonIcon}>
                        <p>{item.createTime + ',' + item.createName}评论</p>
                        <div className={styles.spanIcon}>
                          {editState &&
                          editCommentData.taskHistoryId ===
                            item.taskHistoryId ? (
                            <Tooltip placement="top" content="取消编辑">
                              <span
                                onClick={() => handleComment('close', item)}>
                                <Icon type="close" />
                              </span>
                            </Tooltip>
                          ) : userId !== item.createId ? (
                            <Tooltip placement="top" content="回复">
                              <span
                                onClick={() => handleComment('reply', item)}>
                                <Icon type="message" />
                              </span>
                            </Tooltip>
                          ) : userId === item.createId ? (
                            <>
                              <Tooltip placement="top" content="回复">
                                <span
                                  onClick={() => handleComment('reply', item)}>
                                  <Icon type="message" />
                                </span>
                              </Tooltip>
                              <Tooltip placement="top" content="编辑">
                                <span
                                  onClick={() => handleComment('edit', item)}>
                                  <Icon type="edit" />
                                </span>
                              </Tooltip>
                              {!replyState && (
                                <Tooltip placement="top" content="删除">
                                  <span
                                    onClick={() => handleComment('del', item)}>
                                    <Icon type="delete" />
                                  </span>
                                </Tooltip>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>
                    }
                    key={index}
                  />
                ) : null
              })
            : null}
        </Steps>
      </div>
      <Alert
        isOpen={alertShow}
        confirmText="确认"
        onClosed={() => setAlertShow(false)}
        type="danger"
        content={`是否确认删除本条评论！`}
        onConfirm={() => {
          dispatch.project.getDelComment(editParameter)
        }}></Alert>
      <FromMD
        upDate={updateData}
        submit={addComment}
        editName="commentData"
        editData={commentData}
        fromValue="operatingRecords"
        btnName="添加评论"
        tributeList={userSelectAllList}
        isComment={true}
      />
    </>
  )
}
export default Comment

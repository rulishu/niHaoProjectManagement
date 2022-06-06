import { useState, useEffect } from 'react'
import { Button, Input, Steps, Loader, Icon, Tooltip, Alert } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { issueStatus } from '@/utils/utils'
import styles from './index.module.less'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { AuthBtn } from '@uiw-admin/authorized'
import EditTask from './EditTask'
import { useParams } from 'react-router-dom'
// import { NEWMDEditor } from '@/components'
import FromMD from './fromMD'
import useLocationPage from '@/hooks/useLocationPage'

const TaskInfo = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const [alertShow, setAlertShow] = useState(false)
  const [editParameter, setEditParameter] = useState({})
  // 处理带id的路由
  useLocationPage()
  const {
    project: {
      issueType,
      editFromData,
      taskInfoData,
      commentData,
      editCommentData,
      editState,
    },
    allusers: { uuid },
    projectuser: { userSelectAllList },
    loading,
  } = useSelector((state) => state)
  const [isTitleErr, serIsTitleErr] = useState(false)
  const { projectId, id } = params
  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }
  useEffect(() => {
    dispatch.project.getSelectById({ projectId: projectId, id: id })
    dispatch.project.queryFuzzyAllProjectMember({ projectId })
    dispatch.labels.getAllLabelData({ projectId })
    // dispatch.dictionary.getDictDataList({
    //   dictType: 'assignment_label',
    // })
    dispatch.projectuser.pullSelectAll({
      memberName: '',
      projectId: projectId || '',
    })
    dispatch.milestone.getListAll({
      projectId: projectId,
      milestonesStatusList: [1, 2],
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   document.addEventListener('paste', pasteDataEvent)
  //   return () => {
  //     document.removeEventListener('paste', pasteDataEvent)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const pasteDataEvent = (event) => {
  //   // event.preventDefault();
  //   if (event.clipboardData || event.originalEvent) {
  //     let clipboardData =
  //       event.clipboardData || event.originalEvent.clipboardData
  //     if (clipboardData.items) {
  //       let items = clipboardData.items,
  //         len = items.length,
  //         blob = null
  //       for (let i = 0; i < len; i++) {
  //         let item = clipboardData.items[i]
  //         if (item.kind === 'string') {
  //           // item.getAsString(function (str) {
  //           //   console.log('string', str);
  //           // })
  //         } else if (item.kind === 'file') {
  //           blob = item.getAsFile()
  //           addImg(blob)
  //         }
  //       }
  //     }
  //   }
  // }

  // const addImg = (event) => {
  //   const file = event
  //   if (!file) return
  //   dispatch({
  //     type: 'allusers/upLoadImg',
  //     payload: {
  //       file: file,
  //     },
  //   }).then((res) => {
  //     if (res && res.code === 200) {
  //       const fieldValues = form.current.getFieldValues()
  //       form.current.setFieldValue(
  //         'description',
  //         fieldValues.description +
  //         `![image](/api/file/selectFile/${res?.data})`
  //       )
  //     }
  //   })
  // }
  const goEditIssue = (type) => {
    updateData({ issueType: type })
  }
  const goStateIssue = (e) => {
    const { assignmentId, assignmentTitle, description } = editFromData
    updateData({
      editFromData: {
        assignmentId,
        assignmentTitle,
        description,
        assignmentStatus: e,
      },
    })
    dispatch.project.getEdit({
      fileId: uuid ? [uuid] : editFromData.fileId,
      projectId: projectId,
    })
  }
  const steInputChange = (e) => {
    updateData({
      editFromData: {
        assignmentId: editFromData.assignmentId || taskInfoData.assignmentId,
        description: editFromData.description,
        assignmentTitle: e.target.value,
        fileId: editFromData.fileId,
      },
    })
  }
  const goSaveIssue = () => {
    if (
      editFromData.assignmentTitle.length < 2 ||
      editFromData.assignmentTitle.length > 100
    ) {
      serIsTitleErr(true)
      return
    }
    console.log(editFromData.description)
    if (editFromData.description.length > 300) {
      // serIsDescrErr(true)
      return
    }
    serIsTitleErr(false)
    // serIsDescrErr(false)
    if (editFromData !== taskInfoData) {
      dispatch.project.getEdit({
        fileId: uuid ? [uuid] : editFromData.fileId,
        projectId: projectId,
      })
      updateData({ issueType: '' })
    }
  }
  const addComment = () => {
    dispatch.project.getAddComment()
  }
  //编辑评论
  const goSaveComment = () => {
    console.log(editCommentData)
    dispatch.project.getEditComment({
      ...editParameter,
      operatingRecords: editCommentData.operatingRecords,
    })
  }
  const handleComment = (detail, item) => {
    setEditParameter(
      detail === 'del'
        ? {
            id: item.taskHistoryId,
            projectId: item.projectId,
          }
        : {
            taskHistoryId: item.taskHistoryId,
            projectId: item.projectId,
          }
    )
    if (detail === 'del') {
      setAlertShow(true)
    } else if (detail === 'edit') {
      updateData({
        editCommentData: item,
        editState: true,
      })
    }
  }
  return (
    <>
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={
          loading.effects.project.getSelectById ||
          loading.effects.project.getEdit
        }>
        <div>
          <div className={styles.wrapTask}>
            <div className={styles.leftNav}>
              <div className={styles.navItem}>
                <div>
                  <Button
                    size="small"
                    type={
                      issueStatus.find(
                        (item) => item.status === taskInfoData?.assignmentStatus
                      )?.type
                    }>
                    {
                      issueStatus.find(
                        (item) => item.status === taskInfoData?.assignmentStatus
                      )?.name
                    }
                  </Button>
                  <span className={styles.title}>
                    {taskInfoData?.createTime} 创建于 {taskInfoData?.createName}
                  </span>
                </div>
                <div>
                  <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
                    {taskInfoData?.assignmentStatus === 3 ? (
                      <Button type="success" onClick={() => goStateIssue(1)}>
                        打开任务
                      </Button>
                    ) : (
                      <Button type="primary" onClick={() => goStateIssue(3)}>
                        关闭任务
                      </Button>
                    )}
                    {issueType === 'edit' ? (
                      <Button onClick={() => goEditIssue('')}>取消编辑</Button>
                    ) : (
                      <Button onClick={() => goEditIssue('edit')}>
                        编辑任务
                      </Button>
                    )}
                  </AuthBtn>
                </div>
              </div>
              <div className={styles.navItem}>
                <div style={{ flex: 1 }}>
                  {issueType === 'edit' ? (
                    <div>
                      <Input
                        onChange={(e) => steInputChange(e)}
                        value={editFromData?.assignmentTitle}
                        className={isTitleErr && styles.inputErr}
                      />
                      {isTitleErr && (
                        <div className={styles.inputErrInfo}>
                          请输入任务名称,长度为2~100
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className={styles.assTitle}>
                      {taskInfoData?.assignmentTitle}
                    </span>
                  )}
                </div>
              </div>
              {issueType === 'edit' ? (
                <FromMD
                  upDate={updateData}
                  submit={goSaveIssue}
                  editName={'editFromData'}
                  editData={editFromData}
                  infoData={taskInfoData}
                  fromValue={'description'}
                  btnName="保存编辑"
                />
              ) : (
                // <Form
                //   ref={form}
                //   onChange={({ current }) => {
                //     updateData({
                //       editFromData: {
                //         ...editFromData,
                //         ...current,
                //       },
                //     })
                //   }}
                //   onSubmit={(item) => {
                //     updateData({
                //       editFromData: {
                //         ...editFromData,
                //         ...item,
                //       },
                //     })
                //     goSaveIssue()
                //   }}
                //   onSubmitError={(error) => {
                //     if (error.filed) {
                //       return { ...error.filed }
                //     }
                //     return null
                //   }}
                //   fields={{
                //     description: {
                //       inline: true,
                //       initialValue: editFromData.description,
                //       children: <NEWMDEditor />,
                //     },
                //   }}>
                //   {({ fields }) => {
                //     return (
                //       <div>
                //         <div className="from">
                //           <Row align="top" className="fromItem">
                //             <Col>{fields.description}</Col>
                //           </Row>
                //         </div>
                //         <Row align="middle" className="fromButton">
                //           <Col>
                //             <div className={styles.btnWrap}>
                //               {!issueType ||
                //                 editFromData === taskInfoData ? null : (
                //                 <Button type="primary" htmlType="submit">
                //                   保存编辑
                //                 </Button>
                //               )}
                //             </div>
                //           </Col>
                //         </Row>
                //       </div>
                //     )
                //   }}
                // </Form>
                <div data-color-mode="light" style={{ flex: 1 }}>
                  <MarkdownPreview source={taskInfoData?.description || ''} />
                </div>
              )}
              <div className={styles.stepsWrap}>
                <Steps direction="vertical" style={{ padding: '20px 0' }}>
                  {taskInfoData?.managerAssignmentHistories?.length > 0
                    ? taskInfoData?.managerAssignmentHistories.map(
                        (item, index) => {
                          return item.type === 1 ? (
                            <Steps.Step
                              icon={
                                <Icon
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    borderColor: '#ccc',
                                    borderRadius: 15,
                                    padding: 5,
                                    paddingTop: 0,
                                  }}
                                  type="user"
                                />
                              }
                              style={{ paddingBottom: 15, display: 'flex' }}
                              title={item?.operatingRecords || ''}
                              key={index}
                            />
                          ) : item.type === 2 ? (
                            <Steps.Step
                              style={{ paddingBottom: 15, display: 'flex' }}
                              icon={
                                <Icon
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    borderColor: '#ccc',
                                    borderRadius: 15,
                                    padding: 5,
                                    paddingTop: 1,
                                  }}
                                  type="message"
                                />
                              }
                              description={
                                editState ? (
                                  <FromMD
                                    upDate={updateData}
                                    submit={goSaveComment}
                                    editName="editCommentData"
                                    editData={editCommentData}
                                    fromValue={'operatingRecords'}
                                    btnName="提交"
                                  />
                                ) : (
                                  <div
                                    data-color-mode="light"
                                    style={{ flex: 1 }}>
                                    <MarkdownPreview
                                      source={item?.operatingRecords || ''}
                                      style={{ width: '100%' }}
                                    />
                                  </div>
                                )
                              }
                              title={
                                <div className={styles.buttonIcon}>
                                  <p>{item.createName}评论</p>
                                  <div className={styles.spanIcon}>
                                    <Tooltip placement="top" content="回复">
                                      <span
                                        onClick={() =>
                                          handleComment('reply', item)
                                        }>
                                        <Icon type="message" />
                                      </span>
                                    </Tooltip>
                                    <Tooltip placement="top" content="编辑">
                                      <span
                                        onClick={() =>
                                          handleComment('edit', item)
                                        }>
                                        <Icon type="edit" />
                                      </span>
                                    </Tooltip>
                                    <Tooltip placement="top" content="删除">
                                      <span
                                        onClick={() =>
                                          handleComment('del', item)
                                        }>
                                        <Icon type="delete" />
                                      </span>
                                    </Tooltip>
                                  </div>
                                </div>
                              }
                              key={index}
                            />
                          ) : item.type === 3 ? (
                            <Steps.Step
                              description={
                                <FromMD
                                  upDate={updateData}
                                  submit={goSaveIssue}
                                  editData={editFromData}
                                  infoData={taskInfoData}
                                  btnName="回复"
                                />
                              }
                              title="回复"
                              key={index}
                            />
                          ) : null
                        }
                      )
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
            </div>
            <EditTask />
          </div>
        </div>
      </Loader>
    </>
  )
}
export default TaskInfo

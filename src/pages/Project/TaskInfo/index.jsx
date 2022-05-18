import { useState, useEffect } from 'react'
import { Button, Input, Steps, Loader, Icon } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { issueStatus } from '@/utils/utils'
import styles from './index.module.less'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { AuthBtn } from '@uiw-admin/authorized'
import EditTask from './EditTask'
// import { NEWMDEditor } from '@/components'
import FromMD from './fromMD'

const TaskInfo = (props) => {
  const dispatch = useDispatch()
  const {
    home: { taskId },
    project: { issueType, editFromData, taskInfoData },
    allusers: { uuid },
    loading,
  } = useSelector((state) => state)
  // const commentForm = useRef()

  const [isTitleErr, serIsTitleErr] = useState(false)

  const { projectId, id, companyId } = props?.router?.params
  useEffect(() => {
    if (sessionStorage.getItem('id') === null) {
      sessionStorage.setItem('id', projectId)
    }
    if (sessionStorage.getItem('companyId') === null) {
      sessionStorage.setItem('companyId', companyId)
    }
    dispatch.project.getSelectById({ projectId: projectId, id: id })
    dispatch.dictionary.getQueryAll({ dictTypeCode: 'labels' })
    dispatch.projectuser.pullSelectAll({
      userName: '',
      projectId: projectId || taskId,
    })
    dispatch.milestone.getListAll({ milestonesStatusList: [1, 2] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }

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
    dispatch({
      type: 'project/getEdit',
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
    if (editFromData.description.length > 300) {
      // serIsDescrErr(true)
      return
    }
    serIsTitleErr(false)
    // serIsDescrErr(false)
    if (editFromData !== taskInfoData) {
      dispatch.project.getEdit({
        fileId: uuid ? [uuid] : editFromData.fileId,
      })
      updateData({ issueType: '' })
    }
  }
  console.log('editFromData', editFromData)
  console.log('taskInfoData', taskInfoData)
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
                    {taskInfoData?.assignmentStatus === 1 ? (
                      <Button type="primary" onClick={() => goStateIssue(3)}>
                        关闭问题
                      </Button>
                    ) : (
                      <Button type="success" onClick={() => goStateIssue(1)}>
                        打开问题
                      </Button>
                    )}
                    {issueType === 'edit' ? (
                      <Button onClick={() => goEditIssue('')}>取消编辑</Button>
                    ) : (
                      <Button onClick={() => goEditIssue('edit')}>
                        编辑问题
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
                  editData={editFromData}
                  infoData={taskInfoData}
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
                <div>
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
                              title={item?.operatingRecords}
                              description={item.text}
                              key={index}
                            />
                          ) : // item.type === 2 ? <Steps.Step icon={<Icon style={{ width: 30, height: 30, borderWidth: 1, borderStyle: "solid", borderColor: '#ccc', borderRadius: 15, padding: 5, paddingTop: 1 }} type="date" />} title={item.title} description={item.text} key={index} /> :
                          item.type === 3 ? (
                            <Steps.Step
                              description={
                                <FromMD
                                  upDate={updateData}
                                  submit={goSaveIssue}
                                  editData={editFromData}
                                  infoData={taskInfoData}
                                />
                              }
                              title="回复"
                              key={index}
                            />
                          ) : (
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
                                    paddingLeft: 6,
                                    paddingTop: 2,
                                  }}
                                  type="tag-o"
                                />
                              }
                              title={item.title}
                              description={item.text}
                              key={index}
                            />
                          )
                        }
                      )
                    : null}
                </Steps>
              </div>
              <FromMD
                upDate={updateData}
                submit={goSaveIssue}
                editData={editFromData}
                infoData={taskInfoData}
              />
            </div>
            <EditTask router={props.router} />
          </div>
        </div>
      </Loader>
    </>
  )
}
export default TaskInfo

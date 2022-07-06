import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
// import { useParams } from 'react-router-dom'
import {
  Button,
  Drawer,
  Icon,
  Card,
  Divider,
  Loader,
  DateInput,
  Notify,
} from 'uiw'
import { AuthBtn } from '@uiw-admin/authorized'
import { useNavigate } from 'react-router-dom'
import { CompDropdown } from '@/components'
import { initListData } from '@/utils/utils'
import dayjs from 'dayjs'
import styles from './index.module.less'

const TaskDetail = (props) => {
  const {
    taskDetails,
    setTaskDetails,
    projectId,
    userAccount,
    loading,
    selectBoard,
  } = props?.param
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { taskboard } = useSelector((state) => state)
  const { taskInfo, labelList, userAllList, milepostaData, taskDueDate } =
    taskboard
  const [assignState, setAssignState] = useState(false) //指派人组件状态
  const [labelState, setLabelState] = useState(false) //标签组件状态
  const [cLabelList, setCLabelList] = useState(taskInfo.labels) //当前选中标签
  const [milepostState, setMilepostState] = useState(false) //里程碑组件状态
  const [dueDateState, setDueDateState] = useState(false) //任务截止日期弹窗状态
  useEffect(() => {
    setCLabelList(taskInfo.labels)
  }, [taskInfo.labels])
  const editAssign = () => {
    setAssignState(!assignState)
    dispatch.projectuser.pullSelectAll({ userName: '', projectId: projectId })
    setLabelState(false)
    setMilepostState(false)
  }
  const editMilepost = () => {
    setMilepostState(!milepostState)
    setAssignState(false)
    setLabelState(false)
  }

  // 标签组件 变化回调函数
  const selectLabel = (keyArr) => {
    setCLabelList(keyArr)
    if (!labelState) {
      const labels = labelList?.filter((item) => {
        return keyArr?.includes(item?.id)
      })
      dispatch.taskboard.getEdit({
        taskInfo: {
          ...taskInfo,
          labels: labels.length ? keyArr : [],
        },
      })
      // editLabelOk()
    }
  }

  //关闭标签回调
  const editLabelOk = () => {
    setLabelState(false)
    setCLabelList((newData) => {
      const labels = labelList?.filter((item) => {
        return newData?.includes(item.id)
      })
      const labelIdList = []
      labels?.map((item) => {
        labelIdList.push(item.id)
        return null
      })
      if (
        taskInfo?.labels &&
        JSON.stringify(taskInfo?.labels?.sort()) !==
          JSON.stringify(labelIdList?.sort())
      ) {
        dispatch.taskboard.getEdit({
          taskInfo: {
            ...taskInfo,
            labels: labels.length ? newData : [],
          },
          projectId,
        })
      }
      return newData
    })
  }

  // 新建 里程碑
  const createMilestone = async (formData) => {
    const result = await dispatch.taskboard.addMilestone(formData)
    return result
  }

  // 新建标签
  const createTag = async (formData) => {
    let result = false
    await dispatch({
      type: 'labels/addLabelItem',
      payload: {
        param: { ...formData, projectId },
        callback: (data) => {
          result = data
          dispatch.taskboard.getAllLabelData({ projectId })
        },
      },
    })
    return result
  }

  //编辑任务截止日期
  const editDubTime = () => {
    setDueDateState(!dueDateState)
    setAssignState(false)
    setLabelState(false)
    setMilepostState(false)
  }

  //截止日期选择
  const dueDateChange = async (e) => {
    const creatTime = new Date(taskInfo.createTime).getTime()
    const newTime = new Date(e).getTime()
    if (newTime >= creatTime || isNaN(newTime)) {
      dispatch.taskboard.update({
        taskDueDate: e,
      })
      dispatch.taskboard.changeCloseTime({
        projectId,
        createTime: taskInfo.createTime,
        assignmentId: taskInfo.assignmentId,
        dueDate: e ? dayjs(e).format('YYYY-MM-DD') : null,
      })
    } else {
      dispatch.taskboard.update({
        taskDueDate: taskInfo.dueDate,
      })
      Notify.error({ title: '截止日期需在创建日期之后！' })
    }
    setDueDateState(false)
  }

  const footer = () => {
    return (
      <div className={styles.drawerFooter}>
        <div className={styles.footerDiv}>
          <Button
            block
            loading={loading.effects.taskboard.selectByProjectId}
            icon="link"
            className={styles.taskNaviBtu}
            type="light"
            onClick={() => {
              navigate(
                `/${userAccount}/${projectId}/task/taskInfo/${taskInfo.assignmentId}`
              )
            }}>
            查看任务完整信息
          </Button>
          <Button
            loading={
              loading.effects.taskboard.changeAssignmentStatus ||
              loading.effects.taskboard.selectByProjectId
            }
            block
            className={styles.taskCloseBtu}
            type="light"
            onClick={() => {
              const closeState = [
                //任务开启状态
                1, 2, 4,
              ]
              let taskState = ''
              if (taskInfo?.assignmentStatus === 3) {
                taskState = '打开'
              } else if (closeState.includes(taskInfo?.assignmentStatus)) {
                taskState = '关闭'
              }
              dispatch.taskboard.changeAssignmentStatus({
                projectId,
                assignmentId: taskInfo.assignmentId,
                type: taskState,
                boardId: selectBoard,
                setTaskDetails,
              })
            }}>
            {taskInfo?.assignmentStatus === 3 ? '打开任务' : '关闭任务'}
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.nihao}>
      <Drawer
        maskClosable={
          !loading.effects.taskboard.selectByProjectId &&
          !loading.effects.taskboard.getEdit
        }
        isOpen={taskDetails}
        footer={footer()}
        onClose={() => {
          setTaskDetails(false)
          setDueDateState(false)
          dispatch.taskboard.update({
            taskInfo: {},
          })
        }}
        size="340px"
        usePortal={false}>
        <Loader
          loading={
            loading.effects.taskboard.selectByProjectId ||
            loading.effects.taskboard.changeAssignmentUser ||
            loading.effects.taskboard.changeCloseTime
          }>
          <Card style={{ minWidth: '300px' }}>
            <div style={{ paddingBottom: '10px' }}>
              <div>
                {taskInfo.assignmentStatus === 3 ? (
                  <Icon
                    style={{ marginRight: '5px' }}
                    color="#d99156"
                    type="minus-circle-o"
                  />
                ) : (
                  <Icon
                    style={{ marginRight: '5px' }}
                    color="#57ab5a"
                    type="circle-o"
                  />
                )}
                <span style={{ fontSize: '18px' }}>
                  {taskInfo.assignmentTitle}
                </span>
                <span style={{ color: '#768390' }}>
                  {' '}
                  #{taskInfo.assignmentId}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#768390' }}>
                  由{' '}
                  <span
                    className={styles.projectName}
                    onClick={() => {
                      navigate(`/${taskInfo.createUserAccount}`)
                    }}>
                    {taskInfo.createName}
                  </span>{' '}
                  于{taskInfo?.createTime?.slice(0, 10)}
                  时创建
                </span>
              </div>
            </div>
            <Divider />
            <div>
              <div className={styles.rLabel}>
                <div className={styles.rLabelTitle}>
                  <span>指派人</span>
                  <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
                    <Icon
                      color="#768390"
                      type="setting-o"
                      onClick={() => editAssign()}
                    />
                  </AuthBtn>
                </div>
                <CompDropdown
                  listData={initListData(
                    userAllList,
                    taskInfo.assigneeUserId,
                    'userId',
                    {
                      memberName: 'memberName',
                      avatar: 'avatar',
                      userAcount: 'userAcount',
                    }
                  )}
                  isOpen={assignState}
                  template="personnel"
                  shape="label"
                  isRadio={true}
                  onClickLabelShow={(is) => {
                    setAssignState(is)
                  }}
                  selectLabel={(key) => {
                    taskInfo.assigneeUserId = key
                    let userName = ''
                    let userId = 0
                    if (key !== null) {
                      userId = key
                    }
                    userAllList?.filter((item) => {
                      if (item.userId === key) {
                        userName = item.memberName
                        return null
                      }
                      return null
                    })
                    dispatch.taskboard.changeAssignmentUser({
                      projectId,
                      assigneeUserId: userId,
                      assigneeUserName: userName,
                      assignmentId: taskInfo.assignmentId,
                      assignmentType: taskInfo.assignmentType,
                      assignmentTitle: taskInfo.assignmentTitle,
                      selectBoard,
                    })
                    setAssignState(false)
                  }}
                  closeLabel={() => {
                    setAssignState(false)
                  }}
                  runLabel={() => {
                    navigate(`/${userAccount}/${projectId}/usersManagement`, {
                      replace: true,
                    })
                  }}></CompDropdown>
              </div>
              <Divider />
              <div className={styles.rLabel}>
                <div className={styles.rLabelTitle}>
                  <span>里程碑</span>
                  <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
                    <Icon
                      color="#768390"
                      type="setting-o"
                      onClick={() => editMilepost()}
                    />
                  </AuthBtn>
                </div>
                <CompDropdown
                  listData={initListData(
                    milepostaData,
                    taskInfo.milestonesId,
                    'milestonesId',
                    { title: 'milestonesTitle' }
                  )}
                  isOpen={milepostState}
                  template="milepost"
                  shape="label"
                  isRadio={true}
                  onClickLabelShow={(is) => setMilepostState(is)}
                  selectLabel={(key) => {
                    taskInfo.milestonesId = key
                    let milestonesId = 0
                    let milestonesTitle = ''
                    if (key !== null) {
                      milestonesId = key
                    }
                    milepostaData?.filter((item) => {
                      if (item.milestonesId === key) {
                        milestonesTitle = item.milestonesTitle
                        return null
                      }
                      return null
                    })
                    dispatch.taskboard.changeAssignmentMilestones({
                      projectId,
                      assignmentId: taskInfo.assignmentId,
                      milestonesId: milestonesId,
                      milestonesTitle: milestonesTitle,
                    })
                    setMilepostState(false)
                  }}
                  closeLabel={() => {
                    // updateData({
                    //     editFromData: {
                    //         ...editFromData,
                    //         milestonesId: taskInfoData?.milestonesId,
                    //     },
                    // })
                    setMilepostState(false)
                  }}
                  runLabel={() => {
                    navigate(`/${userAccount}/${projectId}/milestone`, {
                      replace: true,
                    })
                  }}
                  createTag={(_, current) => createMilestone(current)}
                />
              </div>
              <Divider />
              <div className={styles.rLabel}>
                <div className={styles.rLabelTitle}>
                  <span>截止日期</span>
                  <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
                    <Icon
                      color="#768390"
                      type="setting-o"
                      onClick={() => editDubTime()}
                    />
                  </AuthBtn>
                </div>
                {dueDateState ? (
                  <DateInput
                    value={taskDueDate}
                    style={{ marginTop: '5px' }}
                    format="YYYY/MM/DD"
                    allowClear={true}
                    autoClose={true}
                    datePickerProps={{ todayButton: '今天' }}
                    onChange={(e) => dueDateChange(e)}
                  />
                ) : (
                  <span
                    style={{ marginTop: '5px', display: 'block' }}
                    onClick={() => editDubTime()}>
                    {taskInfo?.dueDate || '无'}
                  </span>
                )}
              </div>
              <Divider />
              <div className={styles.rLabel} style={{ borderBottom: 'none' }}>
                <div className={styles.rLabelTitle}>
                  <span>标签</span>
                  <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
                    <Icon
                      color="#768390"
                      type="setting-o"
                      onClick={() => {
                        setLabelState(!labelState)
                      }}
                    />
                  </AuthBtn>
                </div>
                <CompDropdown
                  listData={initListData(labelList, cLabelList, 'id', {
                    color: 'color',
                    title: 'name',
                  })}
                  isOpen={labelState}
                  template="label"
                  shape="label"
                  selectLabel={(_, selKey) => selectLabel(selKey)}
                  closeLabel={() => {
                    editLabelOk()
                  }}
                  onClickLabelShow={(is) => {
                    setLabelState(is)
                  }}
                  loading={loading.effects.dictionary.getDictDataList}
                  runLabel={() =>
                    navigate(`/${userAccount}/${projectId}/labels`)
                  }
                  createTag={(_, current) => createTag(current)}
                />
              </div>
            </div>
          </Card>
        </Loader>
      </Drawer>
    </div>
  )
}

export default TaskDetail

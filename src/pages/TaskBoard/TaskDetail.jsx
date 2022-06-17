import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
// import { useParams } from 'react-router-dom'
import { Button, Drawer, Icon, Card, Divider, Loader } from 'uiw'
import { AuthBtn } from '@uiw-admin/authorized'
import { useNavigate } from 'react-router-dom'
import { CompDropdown } from '@/components'
import { initListData } from '@/utils/utils'
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
  const { taskInfo, labelList, userAllList, milepostaData } = taskboard

  const [assignState, setAssignState] = useState(false) //指派人组件状态
  const [labelState, setLabelState] = useState(false) //标签组件状态
  const [cLabelList, setCLabelList] = useState(taskInfo.labels) //当前选中标签
  const [milepostState, setMilepostState] = useState(false) //里程碑组件状态
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
    taskInfo.labels = keyArr
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

  const editLabelOk = async () => {
    setLabelState(false)
    const labels = labelList?.filter((item) => {
      return cLabelList?.includes(item?.id)
    })
    dispatch.taskboard.getEdit({
      taskInfo: {
        ...taskInfo,
        labels: labels.length ? cLabelList : [],
      },
    })
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
          dispatch.labels.getAllLabelData({ projectId })
        },
      },
    })
    return result
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
              let taskState = 1
              if (taskInfo?.assignmentStatus === 3) {
                taskState = '打开'
              } else if (taskInfo?.assignmentStatus === 1) {
                taskState = '关闭'
              }
              dispatch.taskboard.changeAssignmentStatus({
                projectId,
                assignmentId: taskInfo.assignmentId,
                type: taskState,
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
        }}
        size="20%"
        usePortal={false}>
        <Loader
          loading={
            loading.effects.taskboard.selectByProjectId ||
            loading.effects.taskboard.changeAssignmentUser
          }>
          <Card style={{ minWidth: '300px' }}>
            <div>
              <div>
                <Icon
                  color="#57ab5a"
                  type="down-circle-o"
                  style={{ marginRight: '5px' }}
                />
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
                      navigate(`/${taskInfo.createName}`)
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
                  listData={initListData(labelList, taskInfo.labels, 'id', {
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
              <Divider />
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
                  // createTag={(_, current) => createMilestone(current)}
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

import { useState } from 'react'
import { Button, DateInput } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import styles from './index.module.less'
import { AuthBtn } from '@uiw-admin/authorized'
import { CompDropdown } from '@/components'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { initListData } from '@/utils/utils'

// 任务详情右侧菜单
const EditTask = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { userAccount, projectId } = params
  const {
    projectuser: { userSelectAllList },
    labels: { listData: labelsListData },
    projectTasks: { editTaskData, taskInfoData, loginUserTodoIdList },
    milestone: { milepostaData },
    loading,
  } = useSelector((state) => state)

  const navigate = useNavigate()

  const [assignState, setAssignState] = useState(false) // 指派人
  const [labelState, setLabelState] = useState(false) // 标签
  const [milepostState, setMilepostState] = useState(false) // 里程碑
  const [dueDateState, setDueDateState] = useState(false) // 截止日期

  // 更新数据方法
  const updateData = (payload) => {
    dispatch({ type: 'projectTasks/update', payload })
  }

  // 标签组件 变化回调函数
  const selectLabel = (keyArr) => {
    const labels = labelsListData?.filter((item) => {
      return keyArr?.includes(item?.id)
    })
    updateData({
      editTaskData: {
        ...editTaskData,
        labels: labels.length ? keyArr : [],
      },
    })

    // 组件是否在关闭的状态
    if (!labelState) editTaskDataWay('labels', { labels: keyArr })
  }

  // 新建 里程碑
  const createMilestone = async (formData) => {
    let result = false
    await dispatch({
      type: 'milestone/addMilestone',
      payload: {
        payload: { projectId, ...formData },
        callback: (data) => {
          result = data
          dispatch.milestone.getListAll({
            projectId: projectId,
            milestonesStatusList: [1, 2],
          })
        },
      },
    })
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
          dispatch.labels.getAllLabelData({ projectId })
        },
      },
    })
    return result
  }

  // 添加待办
  const addMyToDo = async () => {
    await dispatch.project.addMyToDo({
      param: {},
      callback: () => {
        dispatch.routeManagement.getInfo({})
      },
    })
  }

  // 标记已完成
  const getStrutsSwitch = async () => {
    await dispatch.project.getStrutsSwitch({
      param: loginUserTodoIdList,
      callback: () => {
        dispatch.routeManagement.getInfo({})
      },
    })
  }

  // 编辑任务数据方法
  const editTaskDataWay = async (type, param) => {
    setAssignState(false)
    setLabelState(false)
    setMilepostState(false)
    setDueDateState(false)
    let params = param

    const {
      editTaskMilestone,
      editTaskAssign,
      editTaskCloseTime,
      editTaskLabel,
      getTaskDetailsDataUnCheck,
    } = dispatch.projectTasks
    const methods = {
      milestone: editTaskMilestone,
      assign: editTaskAssign,
      closeTime: editTaskCloseTime,
      labels: editTaskLabel,
    }

    if (type === 'closeTime') {
      params = { dueDate: param ? dayjs(param).format('YYYY-MM-DD') : '' }
    }

    if (type === 'labels') {
      if (
        taskInfoData?.labels?.sort()?.toString() ===
        param?.labels?.sort()?.toString()
      ) {
        return
      }
    }

    const { projectId, assignmentId } = taskInfoData
    await methods[type]({
      param: { projectId, assignmentId, ...params },
      callback: async () =>
        await getTaskDetailsDataUnCheck({ projectId, id: assignmentId }),
    })
  }

  return (
    <div className={styles.rightFixed}>
      <div className={styles.rightNav}>
        <div className={styles.rLabel}>
          <Button
            loading={
              loading?.effects?.projectTasks?.addMyToDo ||
              loading?.effects?.projectTasks?.getStrutsSwitch
            }
            onClick={() => {
              loginUserTodoIdList && loginUserTodoIdList.length > 0
                ? getStrutsSwitch()
                : addMyToDo()
            }}>
            {loginUserTodoIdList && loginUserTodoIdList.length > 0
              ? '标记已完成'
              : '添加待办一个事项'}
          </Button>
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>指派人</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              <Button
                basic
                type="primary"
                onClick={() => setAssignState(!assignState)}>
                编辑
              </Button>
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(
              userSelectAllList,
              editTaskData?.assigneeUser?.assigneeUserId,
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
            onClickLabelShow={(is) => setAssignState(is)}
            selectLabel={(key) => {
              const userName = userSelectAllList
                ?.map((item) =>
                  item.userId === key ? item.memberName : undefined
                )
                ?.filter((s) => s)[0]
              const userData = {
                assigneeUserId: key || 0,
                assigneeUserName: userName || null,
              }
              updateData({
                editTaskData: {
                  assigneeUser: userData,
                },
              })
              editTaskDataWay('assign', userData)
            }}
            loading={loading.effects.milestone.selectPageList}
            runLabel={() => {
              navigate(`/${userAccount}/${projectId}/usersManagement`, {
                replace: true,
              })
            }}
          />
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>里程碑</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              <Button
                basic
                type="primary"
                onClick={() => setMilepostState(!milepostState)}>
                编辑
              </Button>
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(
              milepostaData,
              taskInfoData.milestonesId,
              'milestonesId',
              { title: 'milestonesTitle' }
            )}
            isOpen={milepostState}
            template="milepost"
            shape="label"
            isRadio={true}
            onClickLabelShow={(is) => setMilepostState(is)}
            selectLabel={(key) => {
              const milestonesTitle = milepostaData
                ?.map((item) =>
                  item.milestonesId === key ? item.milestonesTitle : undefined
                )
                ?.filter((s) => s)[0]
              const milestoneData = {
                milestonesId: key || 0,
                milestonesTitle: milestonesTitle || null,
              }
              updateData({ editTaskData: { milestones: milestoneData } })
              editTaskDataWay('milestone', milestoneData)
            }}
            loading={loading.effects.milestone.selectPageList}
            runLabel={() => {
              navigate(`/${userAccount}/${projectId}/milestone`, {
                replace: true,
              })
            }}
            createTag={(_, current) => createMilestone(current)}
          />
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>截止日期</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              <Button
                basic
                type="primary"
                onClick={() => setDueDateState(!dueDateState)}>
                编辑
              </Button>
            </AuthBtn>
          </div>
          {dueDateState ? (
            <DateInput
              value={taskInfoData?.dueDate}
              format="YYYY/MM/DD"
              allowClear={true}
              autoClose={true}
              datePickerProps={{ todayButton: '今天' }}
              onChange={(v) => editTaskDataWay('closeTime', v)}
            />
          ) : (
            <span>{taskInfoData?.dueDate || '无'}</span>
          )}
        </div>
        <div className={styles.rLabel} style={{ borderBottom: 'none' }}>
          <div className={styles.rLabelTitle}>
            <span>标签</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              <Button
                basic
                type="primary"
                onClick={() => setLabelState(!labelState)}>
                编辑
              </Button>
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(labelsListData, editTaskData?.labels, 'id', {
              color: 'color',
              title: 'name',
            })}
            isOpen={labelState}
            template="label"
            shape="label"
            selectLabel={(_, selKey) => selectLabel(selKey)}
            closeLabel={() => {
              editTaskDataWay('labels', { labels: editTaskData?.labels })
            }}
            onClickLabelShow={(is) => setLabelState(is)}
            loading={loading.effects.dictionary.getDictDataList}
            runLabel={() => navigate(`/${userAccount}/${projectId}/labels`)}
            createTag={(_, current) => createTag(current)}
          />
        </div>
      </div>
    </div>
  )
}
export default EditTask

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
import newDebounce from '@/utils/debounce'

const EditTask = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { userAccount, projectId } = params
  const {
    project: { editFromData, taskInfoData },
    projectuser: { userSelectAllList },
    // dictionary: { dictDataList },
    labels: { listData: labelsListData },
    milestone: { milepostaData },
    loading,
  } = useSelector((state) => state)
  const navigate = useNavigate()

  const [assignState, setAssignState] = useState(false)
  const [labelState, setLabelState] = useState(false)
  const [milepostState, setMilepostState] = useState(false)
  const [dueDateState, setDueDateState] = useState(false)

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }
  const editAssign = () => {
    setAssignState(!assignState)
    dispatch.projectuser.pullSelectAll({ userName: '', projectId: projectId })
    setLabelState(false)
    setMilepostState(false)
    setDueDateState(false)
  }
  // const editLabel = () => {
  //   setLabelState(!labelState)
  //   setMilepostState(false)
  //   setAssignState(false)
  //   setDueDateState(false)
  // }
  const editMilepost = () => {
    setMilepostState(!milepostState)
    setAssignState(false)
    setLabelState(false)
    setDueDateState(false)
  }
  // 完成人员编辑
  const editAssignOk = async () => {
    setAssignState(false)
    await dispatch.project.getEdit()
  }

  const editLabelOk = async () => {
    setLabelState(false)
    await dispatch.project.getEdit()
  }

  const editMilepostOk = async () => {
    setMilepostState(false)
    await dispatch.project.getEdit()
  }

  const editDubTime = () => {
    setMilepostState(false)
    setAssignState(false)
    setLabelState(false)
    setDueDateState(!dueDateState)
  }

  const dubDateChange = async (v) => {
    setDueDateState(false)
    updateData({
      editFromData: {
        ...editFromData,
        dueDate: dayjs(v).format('YYYY-MM-DD'),
      },
    })
    await dispatch.project.getEdit()
  }

  // 标签组件 变化回调函数
  const selectLabel = (keyArr) => {
    setLabelState(true)
    const labels = labelsListData?.filter((item) => {
      return keyArr?.includes(item?.id)
    })
    updateData({
      editFromData: {
        ...editFromData,
        assignmentId: editFromData.assignmentId,
        labels: labels.length ? keyArr : [],
      },
    })
    editLabelOk()
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
  console.log(editFromData)
  //添加待办
  const addMyToDo = async () => {
    const param = {
      projectId: editFromData.projectId,
      id: editFromData.assignmentId,
    }
    await dispatch.project.addMyToDo({
      param: param,
      callback: () => {
        dispatch.routeManagement.getInfo({})
      },
    })
  }
  //标记已完成
  const getStrutsSwitch = async () => {
    const param = {
      projectId: editFromData.projectId,
      id: editFromData.assignmentId,
    }
    const todoData = { id: editFromData.loginUserTodoId, status: 0 }
    await dispatch.project.getStrutsSwitch({
      param: param,
      todoData: todoData,
      callback: () => {
        dispatch.routeManagement.getInfo({})
      },
    })
  }
  return (
    <div>
      <div className={styles.rightNav}>
        <div className={styles.rLabel}>
          <Button
            onClick={() => {
              editFromData.loginUserTodoId ? getStrutsSwitch() : addMyToDo()
            }}>
            {editFromData.loginUserTodoId ? '标记已完成' : '添加待办一个事项'}
          </Button>
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>指派人</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              <Button basic type="primary" onClick={() => editAssign()}>
                编辑
              </Button>
              {/* {assignState ? (
                <Button basic type="primary" onClick={() => editAssignOk()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editAssign()}>
                  编辑
                </Button>
              )} */}
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(
              userSelectAllList,
              editFromData.assigneeUserId,
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
              const userName = userSelectAllList
                ?.map((item) =>
                  item.userId === key ? item.memberName : undefined
                )
                ?.filter((s) => s)[0]
              updateData({
                editFromData: {
                  ...editFromData,
                  assigneeUserId: key || 0,
                  assigneeUserName: userName || null,
                },
              })
              editAssignOk()
            }}
            closeLabel={() => {
              updateData({
                editFromData: {
                  ...editFromData,
                  assigneeUserId: taskInfoData.assigneeUserId,
                  assigneeUserName: taskInfoData.assigneeUserName,
                },
              })
              setAssignState(false)
            }}
            loading={loading.effects.milestone.selectPageList}
            runLabel={() => {
              navigate(`/${userAccount}/${projectId}/usersManagement`, {
                replace: true,
              })
            }}></CompDropdown>
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>里程碑</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              <Button basic type="primary" onClick={() => editMilepost()}>
                编辑
              </Button>
              {/* {milepostState ? (
                <Button basic type="primary" onClick={() => editMilepostOk()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editMilepost()}>
                  编辑
                </Button>
              )} */}
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(
              milepostaData,
              editFromData.milestonesId,
              'milestonesId',
              { title: 'milestonesTitle' }
            )}
            isOpen={milepostState}
            template="milepost"
            shape="label"
            isRadio={true}
            onClickLabelShow={(is) => setMilepostState(is)}
            selectLabel={(key) => {
              updateData({
                editFromData: { ...editFromData, milestonesId: key || 0 },
              })
              editMilepostOk()
            }}
            closeLabel={() => {
              updateData({
                editFromData: {
                  ...editFromData,
                  milestonesId: taskInfoData?.milestonesId,
                },
              })
              setMilepostState(false)
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
              <Button basic type="primary" onClick={() => editDubTime()}>
                编辑
              </Button>
              {/* {dueDateState ? (
                <Button basic type="primary" onClick={() => editDubTime()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editDubTime()}>
                  编辑
                </Button>
              )} */}
            </AuthBtn>
          </div>
          {dueDateState ? (
            <DateInput
              value={editFromData?.dueDate}
              format="YYYY/MM/DD"
              allowClear={false}
              datePickerProps={{ todayButton: '今天' }}
              onChange={(v) => dubDateChange(v)}
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
                {/* {labelState ? '完成' : '编辑'} */}
                编辑
              </Button>
              {/* {labelState ? (
                <Button
                  basic
                  type="primary"
                  onClick={(e) => {
                    editLabelOk()
                  }}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editLabel()}>
                  编辑
                </Button>
              )} */}
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(labelsListData, editFromData.labels, 'id', {
              color: 'color',
              title: 'name',
            })}
            isOpen={labelState}
            template="label"
            shape="label"
            selectLabel={(_, selKey) => selectLabel(selKey)}
            closeLabel={() => {
              setLabelState(false)
            }}
            onClickLabelShow={(is) => {
              setLabelState(is)
              if (
                taskInfoData === editFromData &&
                Object.keys(taskInfoData).length
              ) {
                !is && newDebounce(editLabelOk, 100)
              }
            }}
            loading={loading.effects.dictionary.getDictDataList}
            runLabel={() => navigate(`/${userAccount}/${projectId}/labels`)}
            createTag={(_, current) => createTag(current)}
          />
          {!editFromData?.labels?.length && !taskInfoData?.labels?.length && (
            <div className={styles.rLabelText}>无</div>
          )}
        </div>
      </div>
    </div>
  )
}
export default EditTask

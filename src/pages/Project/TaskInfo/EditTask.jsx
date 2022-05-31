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

const EditTask = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { userAccount, projectId } = params
  const {
    project: { editFromData, taskInfoData },
    projectuser: { userSelectAllList },
    dictionary: { dictDataList },
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
  const editLabel = () => {
    setLabelState(!labelState)
    setMilepostState(false)
    setAssignState(false)
    setDueDateState(false)
  }
  const editMilepost = () => {
    setMilepostState(!milepostState)
    setAssignState(false)
    setLabelState(false)
    setDueDateState(false)
  }
  // 完成人员编辑
  const editAssignOk = async () => {
    setLabelState(false)
    if (editFromData === taskInfoData) {
      return false
    } else {
      await dispatch.project.getEdit()
    }
  }

  const editLabelOk = async () => {
    setLabelState(false)
    if (editFromData === taskInfoData) {
      return false
    } else {
      await dispatch.project.getEdit()
    }
  }
  const editMilepostOk = async () => {
    setMilepostState(!milepostState)
    if (editFromData === taskInfoData) {
      return false
    } else {
      await dispatch.project.getEdit()
    }
  }

  const editDubTime = () => {
    setMilepostState(false)
    setAssignState(false)
    setLabelState(false)
    setDueDateState(!dueDateState)
  }

  const dubDateChange = async (v) => {
    setDueDateState(false)
    await dispatch.project.getEdit({
      assignmentId: editFromData.assignmentId,
      dueDate: dayjs(v).format('YYYY-MM-DD'),
      projectId: projectId || '',
    })
  }

  // 标签组件 变化回调函数
  const selectLabel = (keyArr) => {
    setLabelState(true)
    const labels = dictDataList?.filter((item) =>
      keyArr?.includes(item?.dictValue)
    )
    updateData({
      editFromData: {
        ...editFromData,
        assignmentId: editFromData.assignmentId,
        labels: labels.length ? labels : [],
      },
    })
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
      type: 'dictionary/addDict',
      payload: {
        record: {
          ...formData,
          dictType: 'assignment_label',
          dictValue: dayjs().unix(),
        },
        callback: (data) => {
          result = data
          dispatch.dictionary.getDictDataList({
            dictType: 'assignment_label',
            page: 1,
            pageSize: 999,
          })
        },
      },
    })
    return result
  }

  return (
    <div>
      <div className={styles.rightNav}>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>指派人</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              {assignState ? (
                <Button basic type="primary" onClick={() => editAssignOk()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editAssign()}>
                  编辑
                </Button>
              )}
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
              {milepostState ? (
                <Button basic type="primary" onClick={() => editMilepostOk()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editMilepost()}>
                  编辑
                </Button>
              )}
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
            selectLabel={(key) => {
              updateData({
                editFromData: { ...editFromData, milestonesId: key },
              })
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
              {dueDateState ? (
                <Button basic type="primary" onClick={() => editDubTime()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editDubTime()}>
                  编辑
                </Button>
              )}
            </AuthBtn>
          </div>
          {dueDateState ? (
            <DateInput
              value={editFromData?.dueDate}
              format="YYYY/MM/DD"
              datePickerProps={{ todayButton: '今天' }}
              onChange={(v) => dubDateChange(v)}
            />
          ) : (
            <span>{taskInfoData?.dueDate || '无'}</span>
          )}
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>标签</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              {labelState ? (
                <Button basic type="primary" onClick={() => editLabelOk()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editLabel()}>
                  编辑
                </Button>
              )}
            </AuthBtn>
          </div>
          <CompDropdown
            listData={initListData(
              dictDataList,
              editFromData.labels,
              'dictValue',
              { color: 'listClass', title: 'dictLabel' }
            )}
            isOpen={labelState}
            template="label"
            shape="label"
            selectLabel={(_, selKey) => selectLabel(selKey)}
            closeLabel={() => {
              updateData({
                editFromData: {
                  ...editFromData,
                  labels: [...taskInfoData?.labels],
                },
              })
              setLabelState(false)
            }}
            loading={loading.effects.dictionary.getDictDataList}
            runLabel={() => {
              navigate('/Authority/dictionary', { replace: true })
            }}
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

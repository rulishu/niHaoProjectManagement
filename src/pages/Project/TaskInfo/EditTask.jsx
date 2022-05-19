import { useRef, useState } from 'react'
import { Button, SearchSelect, DateInput, Tooltip } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { selectOption } from '@/utils/utils'
import dayjs from 'dayjs'
import styles from './index.module.less'
import { AuthBtn } from '@uiw-admin/authorized'
import { Label } from '@/components'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
function useDebounce(fn, delay) {
  const refTimer = useRef()

  return function f(...args) {
    if (refTimer.current) {
      clearTimeout(refTimer.current)
    }
    refTimer.current = setTimeout(() => {
      fn(args)
    }, delay)
  }
}

const EditTask = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { projectId } = params

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
  const editLabelOk = async () => {
    setLabelState(false)
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

  const onChangeSearch = useDebounce((e) => {
    dispatch.projectuser.pullSelectAll({
      userName: e.toString(),
      projectId: projectId,
    })
  }, 1500)

  const selectSearch = async (e) => {
    setAssignState(false)
    const newItem = userSelectAllList.filter((item) => e === item.id)
    await dispatch.project.getEdit({
      assignmentId: editFromData.assignmentId,
      assigneeUserId: e,
      assigneeUserName: newItem[0].memberName,
      projectId: projectId || '',
    })
  }
  const milepostChange = async (v) => {
    setMilepostState(false)
    await dispatch.project.getEdit({
      assignmentId: editFromData.assignmentId,
      milestonesId: v[0].value,
      projectId: projectId || '',
    })
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
    updateData({
      editFromData: {
        ...editFromData,
        assignmentId: editFromData.assignmentId,
        labels: dictDataList.filter((item) => keyArr.includes(item.dictCode)),
      },
    })
  }

  // 初始化 Label 组件数据 [{key,color,title,check}]
  const initListData = () => {
    const useful = editFromData?.labels?.map((item) =>
      item.dictCode ? +item.dictCode : +item
    )
    return dictDataList
      .map((item) => {
        if (!item.dictLabel || !item?.dictCode) return undefined
        return {
          key: item?.dictCode,
          color: item?.listClass,
          title: item?.dictLabel,
          check: useful?.includes(+item?.dictCode),
        }
      })
      .filter((s) => s)
  }

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
                <Button basic type="primary" onClick={() => editAssign()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editAssign()}>
                  编辑
                </Button>
              )}
            </AuthBtn>
          </div>
          <div className={styles.rLabelText}>
            {assignState ? (
              <SearchSelect
                showSearch={true}
                allowClear
                disabled={false}
                placeholder="请输入选择"
                onSearch={onChangeSearch}
                onSelect={(e) => selectSearch(e)}
                option={
                  selectOption(userSelectAllList, 'id', 'memberName') || []
                }
                loading={loading.effects.projectuser.pullSelectAll}
              />
            ) : taskInfoData?.assigneeUserName ? (
              <Tooltip
                placement="top"
                content={<strong>{taskInfoData?.assigneeUserName}</strong>}>
                <div>{taskInfoData?.assigneeUserName || '无'}</div>
              </Tooltip>
            ) : (
              <div>无</div>
            )}
          </div>
        </div>
        <div className={styles.rLabel}>
          <div className={styles.rLabelTitle}>
            <span>里程碑</span>
            <AuthBtn path="/api/ManagerAssignment/managerAssignmentUpdate">
              {milepostState ? (
                <Button basic type="primary" onClick={() => editMilepost()}>
                  完成
                </Button>
              ) : (
                <Button basic type="primary" onClick={() => editMilepost()}>
                  编辑
                </Button>
              )}
            </AuthBtn>
          </div>
          <div className={styles.rLabelText}>
            {milepostState ? (
              <SearchSelect
                showSearch={true}
                allowClear
                disabled={false}
                labelInValue={true}
                placeholder="请输入选择"
                onChange={(v) => milepostChange(v)}
                option={
                  selectOption(
                    milepostaData,
                    'milestonesId',
                    'milestonesTitle'
                  ) || []
                }
                loading={loading.effects.milestone.selectPageList}
              />
            ) : taskInfoData?.milestonesTitle ? (
              <Tooltip
                placement="top"
                content={<strong>{taskInfoData?.milestonesTitle}</strong>}>
                <div>{taskInfoData?.milestonesTitle || '无'}</div>
              </Tooltip>
            ) : (
              <div>无</div>
            )}
          </div>
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
          <Label
            listData={initListData()}
            isOpen={labelState}
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
              navigate('/dictionary', { replace: true })
            }}
            createTag={(_, current) => createTag(current)}
            // isTagClose={false}
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

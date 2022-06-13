import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
// import { useParams } from 'react-router-dom'
import { Button, Drawer, Icon, Card, Divider } from 'uiw'
import { AuthBtn } from '@uiw-admin/authorized'
import { useNavigate } from 'react-router-dom'
import { CompDropdown } from '@/components'
import { initListData } from '@/utils/utils'
import styles from './index.module.less'

const TaskDetail = (props) => {
  const { taskDetails, setTaskDetails, projectId, userAccount } = props?.param
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { taskboard } = useSelector((state) => state)
  const { taskInfo, labelList, userAllList, milepostaData } = taskboard
  const [assignState, setAssignState] = useState(false)
  const [labelState, setLabelState] = useState(false)
  const [milepostState, setMilepostState] = useState(false)
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
  const footer = () => {
    return (
      <div className={styles.drawerFooter}>
        <div className={styles.footerDiv}>
          <Button
            block
            icon="link"
            className={styles.taskNaviBtu}
            type="light"
            onClick={() => {
              navigate(
                `/${userAccount}/${projectId}/task/taskInfo/${taskInfo.assignmentId}`
              )
            }}>
            查看议题完整信息
          </Button>
          <Button block className={styles.taskCloseBtu} type="light">
            {taskInfo?.assignmentStatus === 3 ? '打开任务' : '关闭任务'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.nihao}>
      <Drawer
        isOpen={taskDetails}
        footer={footer()}
        onClose={() => setTaskDetails(false)}
        size="20%"
        usePortal={false}>
        <Card>
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
                由 {taskInfo.createName} 于{taskInfo?.createTime?.slice(0, 10)}
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
                      console.log(labelState)
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
                selectLabel={(_, selKey) => console.log(selKey)}
                closeLabel={() => {
                  setLabelState(false)
                }}
                onClickLabelShow={(is) => {
                  setLabelState(is)
                  // if (
                  //     taskInfoData === editFromData &&
                  //     Object.keys(taskInfoData).length
                  // ) {
                  //     !is && newDebounce(editLabelOk, 100)
                  // }
                }}
                // loading={loading.effects.dictionary.getDictDataList}
                // runLabel={() => navigate(`/${userAccount}/${projectId}/labels`)}
                // createTag={(_, current) => createTag(current)}
              />
              {!taskInfo?.labels?.length && (
                <div className={styles.rLabelText}>无</div>
              )}
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
                  //   const userName = userAllList
                  //     ?.map((item) =>
                  //       item.userId === key ? item.memberName : undefined
                  //     )
                  //     ?.filter((s) => s)[0]
                  //   updateData({
                  //     editFromData: {
                  //       ...editFromData,
                  //       assigneeUserId: key || 0,
                  //       assigneeUserName: userName || null,
                  //     },
                  //   })
                  //   editAssignOk()
                }}
                closeLabel={() => {
                  //   updateData({
                  //     editFromData: {
                  //       ...editFromData,
                  //       assigneeUserId: taskInfoData.assigneeUserId,
                  //       assigneeUserName: taskInfoData.assigneeUserName,
                  //     },
                  //   })
                  setAssignState(false)
                }}
                // loading={loading.effects.milestone.selectPageList}
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
                  // updateData({
                  //     editFromData: { ...editFromData, milestonesId: key || 0 },
                  // })
                  // editMilepostOk()
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
                // loading={loading.effects.milestone.selectPageList}
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
      </Drawer>
    </div>
  )
}

export default TaskDetail

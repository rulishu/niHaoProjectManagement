import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Row, Col, Progress, Alert, Loader } from 'uiw'
import formatter from '@uiw/formatter'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './index.module.less'
import OtherInfo from './OtherInfo'
import MDEditor from '@uiw/react-md-editor'
import timeDistance from '@/utils/timeDistance'
import './index.css'

const MilestoneInfo = () => {
  const navigate = useNavigate()
  const { projectId, milestonesId, userAccount } = useParams()
  const {
    milestone: { listDataInfo },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  const [milestonesState, setMilestonesState] = useState()
  const [openAlert, setOpenAlert] = useState(false)

  //自适应方法
  const ref = useRef()
  const tHeader = ref?.current?.getElementsByClassName('ant-table-thead')[0]
  //表头距离顶部的距离 + 表头高度
  let tHeaderTop = tHeader
    ? tHeader.getBoundingClientRect().top +
      tHeader.getBoundingClientRect().height
    : 0

  // 右侧边栏收缩
  // const [packup, setPackup] = useState(false)

  useEffect(() => {
    dispatch.milestone.update({ milestonesId, projectId })
  }, [dispatch.milestone, milestonesId, projectId])

  useEffect(() => {
    const callback = async () => {
      await dispatch.milestone.getMilestone({ projectId, milestonesId })
      await dispatch.labels.getAllLabelData({ projectId })
      await dispatch.milestone.getAllLabel({ id: milestonesId })
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setMilestonesState(listDataInfo?.milestonesStatus)
  }, [listDataInfo?.milestonesStatus])

  // 删除
  const delMilestones = async () => {
    await dispatch.milestone.delMilestones({
      payload: milestonesId,
      callback: goBack,
    })
  }

  //
  const goTaskListPage = async (activeKey) => {
    navigate(`/${userAccount}/${projectId}/task`, { state: { projectId } })
    await dispatch({
      type: 'project/update',
      payload: { activeKey },
    })
  }

  // 改变状态
  const changeState = async (status) => {
    await dispatch.milestone.editStatusMilestones({
      milestonesId,
      milestonesStatus: status,
      projectId: projectId,
    })
    await dispatch.milestone.getMilestone({ projectId, milestonesId })
  }

  // 编辑
  const editMilestones = () => {
    dispatch.milestone.update({ milestoneType: 2, milestonesId, projectId })
    navigate(
      `/${userAccount}/${projectId}/milestone/editMilestone/${milestonesId}`,
      {
        state: { milestonesId, projectId },
      }
    )
  }

  // 返回
  const goBack = () => {
    window.history.back(-1)
  }

  // 关闭打开里程碑按钮
  const changeStateBut = () => {
    // 设置两次更新，第二次传入一个接收上次更新后 count 的函数，并返回最新的 count
    setMilestonesState(listDataInfo.milestonesStatus === 1 ? 2 : 1)
    setMilestonesState((state) => {
      changeState(state)
      return state
    })
  }

  return (
    <div
      ref={ref}
      style={{
        height: window.innerHeight - tHeaderTop - 120,
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
      className={styles.contentWrapper}>
      <Row>
        <Col className={styles.layoutLeft}>
          <div className={styles.layoutLeftHead}>
            <div className={styles.headLeft}>
              <span
                className={styles.headStatus}
                style={{ background: '#ab6100' }}>
                {milestonesState === 1
                  ? '打开'
                  : milestonesState === 2
                  ? '关闭'
                  : '未知'}
              </span>
              <span className={styles.headTitle}>
                <strong>里程碑</strong>
                {listDataInfo.startTime}
                {listDataInfo.dueTime && '-' + listDataInfo.dueTime}
              </span>
            </div>
            <div className={styles.headRight}>
              <Button type="light" onClick={() => editMilestones()}>
                编辑
              </Button>
              <Button type="light" onClick={() => goBack()}>
                返回
              </Button>
              <Button
                type="light"
                onClick={() => changeStateBut()}
                loading={loading.effects.milestone.editStatusMilestones}>
                {milestonesState === 1 ? '关闭里程碑' : '打开里程碑'}
              </Button>
              <Button type="danger" onClick={() => setOpenAlert(true)}>
                删除
              </Button>
            </div>
          </div>
          <div className={styles.layoutLeftBody}>
            <Loader
              tip="加载中..."
              vertical
              style={{ width: '100%' }}
              bgColor="rgba(0, 0, 0, 0.1)"
              loading={loading.effects.milestone.getMilestone}>
              <>
                <h2>{listDataInfo.milestonesTitle}</h2>
                <div className={styles.bodyContent}>
                  <div className="milestonesBodyMDEditor">
                    <div data-color-mode="light">
                      <MDEditor
                        style={{ boxShadow: 'none' }}
                        value={listDataInfo.milestonesDesc || null}
                        hideToolbar={true}
                        preview="preview"
                        autoFocus={true}
                        visiableDragbar={false}
                      />
                    </div>
                  </div>
                </div>
              </>
            </Loader>
          </div>
          <div className={styles.layoutLeftFooty}>
            <OtherInfo
              projectId={projectId}
              goTaskListPage={goTaskListPage}
              listDataInfo={listDataInfo && listDataInfo}
            />
          </div>
        </Col>
        <Col className={styles.layoutRight}>
          <ul>
            <li>
              <div className={styles.rightHead}>
                <div>
                  {(+listDataInfo?.degreeCompletion * 100).toFixed()}% 进度
                </div>
                {/* <Button
                  icon={packup ? 'd-arrow-left' : 'd-arrow-right'}
                  basic
                  onClick={() => setPackup(!packup)}
                /> */}
              </div>
              <Progress.Line
                strokeWidth={6}
                percent={(+listDataInfo?.degreeCompletion * 100).toFixed()}
                showText={false}
              />
            </li>
            <li>
              <div className={styles.rightHead}>
                <span>开始时间</span>
                <Button
                  basic
                  className={styles.rightHeadBut}
                  onClick={() => editMilestones()}>
                  编辑
                </Button>
              </div>
              <div className={styles.rightBelow}>
                {formatter('YYYY-MM-DD', new Date(listDataInfo.startTime))}
              </div>
            </li>
            <li>
              <div className={styles.rightHead}>
                <span>结束时间</span>
                <Button
                  basic
                  className={styles.rightHeadBut}
                  onClick={() => editMilestones()}>
                  编辑
                </Button>
              </div>
              <div className={styles.rightBelow}>
                {listDataInfo.dueTime || '暂无'}
                {listDataInfo.dueTime &&
                  listDataInfo.milestonesStatus === 1 &&
                  !timeDistance(listDataInfo.createTime, listDataInfo.dueTime)
                    ?.status && <span>（逾期）</span>}
              </div>
            </li>
            <li>
              <div className={styles.rightHead}>
                <span>
                  任务
                  <span className={styles.num}>
                    {listDataInfo?.unassignedSize +
                      listDataInfo?.finishSize +
                      listDataInfo?.conductSize ||
                      listDataInfo?.allTaskNum ||
                      0}
                  </span>
                </span>
                <Button
                  basic
                  className={styles.rightHeadBut}
                  onClick={() => {
                    navigate(`/${userAccount}/${projectId}/task/newIssue`, {
                      state: { projectId },
                    })
                    dispatch.milestone.update({
                      taskMilestonesId: listDataInfo?.milestonesId,
                      taskMilestonesTitle: listDataInfo?.milestonesTitle,
                    })
                    dispatch.project.update({
                      fromData: {
                        assignmentTitle: '',
                        assignmentType: 1,
                        description: '',
                        labels: [],
                      },
                    })
                  }}>
                  新建任务
                </Button>
              </div>
              <div className={styles.rightBelow}>
                <span>
                  <p>打开：</p>
                  <span onClick={() => goTaskListPage(1)}>
                    {listDataInfo?.unassignedSize + listDataInfo?.conductSize ||
                      0}
                  </span>
                </span>
                <span>
                  <p>完成：</p>
                  <span onClick={() => goTaskListPage(3)}>
                    {listDataInfo?.finishSize || 0}
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </Col>
      </Row>
      <Alert
        isOpen={openAlert}
        confirmText="确定"
        cancelText="取消"
        icon="delete"
        type="danger"
        onConfirm={delMilestones}
        onCancel={() => setOpenAlert(false)}
        onClosed={() => setOpenAlert(false)}>
        <div>
          确定要删除该里程碑吗?
          <br />
          <strong>删除后数据不可恢复!</strong>
        </div>
      </Alert>
    </div>
  )
}

export default MilestoneInfo

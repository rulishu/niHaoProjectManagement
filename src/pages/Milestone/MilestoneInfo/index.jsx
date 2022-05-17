import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Progress, Alert } from 'uiw'
// import { AuthBtn } from '@uiw-admin/authorized'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import OtherInfo from './OtherInfo'
import MDEditor from '@uiw/react-md-editor'
import './index.css'

const MilestoneInfo = (props) => {
  useEffect(() => {
    const callback = async () => {
      await props.dispatch.getMilestone(milestonesId)
    }
    callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    setMilestonesState(listDataInfo.milestonesStatus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.milestone.listDataInfo])
  const navigate = useNavigate()
  const { milestonesId } = 130
  const { listDataInfo } = props?.milestone
  const { loading } = props

  const [milestonesState, setMilestonesState] = useState()
  const [openAlert, setOpenAlert] = useState(false)

  // 右侧边栏收缩
  const [packup, setPackup] = useState(false)

  // 删除
  const delMilestones = async () => {
    await props.dispatch.delMilestones({
      payload: milestonesId,
      callback: goBack,
    })
  }

  // 改变状态
  const changeState = async (status) => {
    await props.dispatch.editStatusMilestones({
      milestonesId,
      milestonesStatus: status,
      projectId: 1594,
    })
    await props.dispatch.getMilestone(milestonesId)
  }

  // 编辑
  const editMilestones = () => {
    props.dispatch.update({ milestoneType: 2 })
    navigate('/milestone/editMilestone', {
      state: { milestonesId },
    })
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
    <div className={styles.contentWrapper}>
      <Row>
        <Col className={styles.layoutLeft}>
          <div className={styles.layoutLeftHead}>
            <div className={styles.headLeft}>
              <span
                className={styles.headStatus}
                style={{ background: '#666' }}>
                {milestonesState === 1
                  ? '逾 期'
                  : milestonesState === 2
                  ? '关闭'
                  : '打开'}
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
            <h2>{listDataInfo.milestonesTitle || '测试'}</h2>
            <div className={styles.bodyContent}>
              <MDEditor
                style={{ boxShadow: 'none' }}
                value={listDataInfo.milestonesDesc || null}
                hideToolbar={true}
                preview="preview"
                autoFocus={true}
                visiableDragbar={true}
              />
            </div>
          </div>
          <div className={styles.layoutLeftFooty}>
            <OtherInfo listDataInfo={listDataInfo} />
          </div>
        </Col>
        <Col className={styles.layoutRight}>
          <ul>
            <li>
              <div className={styles.rightHead}>
                <div>{listDataInfo.degreeCompletion * 100 || 30}% 进度</div>
                <Button
                  icon={packup ? 'd-arrow-left' : 'd-arrow-right'}
                  basic
                  onClick={() => setPackup(!packup)}
                />
              </div>
              <Progress.Line
                strokeWidth={6}
                percent={listDataInfo.degreeCompletion * 100 || 30}
                showText={false}
              />
            </li>
            <li>
              <div className={styles.rightHead}>
                <span>开始时间</span>
                <Button basic className={styles.rightHeadBut}>
                  编辑
                </Button>
              </div>
              <div className={styles.rightBelow}>
                {listDataInfo.createTime || '2022-04-30 00:00:00'}
              </div>
            </li>
            <li>
              <div className={styles.rightHead}>
                <span>结束时间</span>
                <Button basic className={styles.rightHeadBut}>
                  编辑
                </Button>
              </div>
              <div className={styles.rightBelow}>
                {listDataInfo.createTime || '2022-04-30 00:00:00'}
                {milestonesState === 1 && <span>（逾期）</span>}
              </div>
            </li>
            <li>
              <div className={styles.rightHead}>
                <span>
                  任务<span className={styles.num}>2</span>
                </span>
                <Button basic className={styles.rightHeadBut}>
                  新问题
                </Button>
              </div>
              <div className={styles.rightBelow}>
                <span>
                  <p>打开：</p>
                  <span>2</span>
                </span>
                <span>
                  <p>关闭：</p>
                  <span>2</span>
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

const mapStateToProps = ({ milestone, loading }) => ({
  milestone: milestone,
  loading: loading,
})

const mapDispatchToProps = ({ milestone }) => ({
  dispatch: milestone,
})

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneInfo)

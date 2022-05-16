import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Textarea,
  Row,
  Col,
  Card,
  RadioGroup,
  Radio,
  Progress,
  Select,
  Divider,
  Loader,
  Alert,
  Icon,
} from 'uiw'
import { AuthBtn } from '@uiw-admin/authorized'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import OtherInfo from './OtherInfo'
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
  const { milestonesId } = props?.router?.location?.state
  const { listDataInfo } = props?.milestone
  const { loading } = props

  const [milestonesState, setMilestonesState] = useState()
  const [openAlert, setOpenAlert] = useState(false)
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
      projectId: Number(sessionStorage.getItem('id')),
    })
    await props.dispatch.getMilestone(milestonesId)
  }

  // 编辑
  const editMilestones = () => {
    props.dispatch.update({ milestoneType: 2 })
    navigate('/project/milestone/editMilestone', {
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
    <div>
      <Row>
        <Col span="18">
          <Row>
            <Col>
              <Card title={'里程碑状态'} bordered={false}>
                <Progress.Line
                  percent={(+listDataInfo.degreeCompletion * 100).toFixed()}
                  strokeWidth={10}
                  className={styles.progressBar}
                />
                <div className={styles.stateBox}>
                  <Loader
                    tip="loading..."
                    style={{ width: '100%' }}
                    loading={loading.effects.milestone.editStatusMilestones}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: ' space-between',
                      }}>
                      <div className={styles.stateAlter}>
                        <div className={styles.stateAlterLeft}>
                          状态：
                          <Select
                            onChange={(e) => {
                              setMilestonesState(+e.target.value)
                            }}
                            value={milestonesState}
                            style={{ width: '80px', margin: '0 10px' }}>
                            <Select.Option value={1}>打开</Select.Option>
                            <Select.Option value={2}>关闭</Select.Option>
                          </Select>
                          <RadioGroup
                            name="other"
                            value={milestonesState}
                            onChange={(e) => {
                              setMilestonesState(+e.target.value)
                            }}>
                            <Radio value={1}>&nbsp;</Radio>
                            <Radio value={2}>&nbsp;</Radio>
                          </RadioGroup>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => changeState(milestonesState)}>
                        更新状态
                      </Button>
                    </div>
                  </Loader>
                  <Divider />
                  <div>
                    <span> 更新信息: </span>
                    <a href="javascript;">
                      <span> {listDataInfo.updateName} </span>
                    </a>
                    于<span> {listDataInfo.updateTime} </span>
                    更新
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card bordered={false}>
                <OtherInfo listDataInfo={listDataInfo} />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col>
          <Card bordered={false}>
            <div className={styles.rigBox}>
              <span className={styles.title}>
                {listDataInfo.milestonesTitle}
              </span>
              <span className={styles.introduce}>
                <a href="javascript;">{listDataInfo.createName}</a> 于
                {listDataInfo.createTime} 创建
              </span>
              <ul className={styles.rigBoxUl}>
                <li>
                  <div className={styles.liTitle}>项目周期</div>
                  <div className={styles.liText}>
                    <span>
                      <Icon type="date" /> {listDataInfo.startTime}
                    </span>{' '}
                    至{' '}
                    <span>
                      <Icon type="date" /> {listDataInfo.dueTime}
                    </span>
                  </div>
                </li>
                <li>
                  <div className={styles.liTitle}>项目描述</div>
                  <div className={styles.liText}>
                    <pre>{listDataInfo.milestonesDesc || undefined}</pre>
                    <Textarea
                      className={styles.liTextarea}
                      value={listDataInfo.milestonesDesc || undefined}
                      disabled
                    />
                  </div>
                </li>
                <li>
                  <AuthBtn path="/api/milestones/updatestatus">
                    <Button block type="primary" onClick={editMilestones}>
                      编辑里程碑
                    </Button>
                  </AuthBtn>
                </li>
                <li>
                  <AuthBtn path="/api/milestones/updatestatus">
                    <Button
                      block
                      type="primary"
                      loading={loading.effects.milestone.editStatusMilestones}
                      onClick={() => {
                        changeStateBut()
                      }}>
                      {listDataInfo.milestonesStatus === 1
                        ? '关闭里程碑'
                        : listDataInfo.milestonesStatus === 2
                        ? '打开里程碑'
                        : '别点'}
                    </Button>
                  </AuthBtn>
                </li>
                <li>
                  <AuthBtn path="/api/milestones/delete">
                    <Button
                      block
                      type="danger"
                      // onClick={delMilestones}
                      onClick={() => setOpenAlert(true)}>
                      删除里程碑
                    </Button>
                  </AuthBtn>
                </li>
              </ul>
            </div>
          </Card>
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

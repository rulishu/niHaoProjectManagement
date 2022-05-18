import { useEffect } from 'react'
import { Row, Col, Input, DateInput, Select, Form, Button, Loader } from 'uiw'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import formatter from '@uiw/formatter'
import { NEWMDEditor } from '@/components'
import styles from './index.module.less'

const NewMilestone = (props) => {
  const { milestoneType, listDataInfo, projectId, milestonesId } =
    props.milestone
  const { loading } = props
  const { addMilestone, editMilestone, getMilestone } =
    loading.effects.milestone

  console.log(listDataInfo)

  const location = useLocation()
  const pathArr = location.pathname.split('/')

  useEffect(() => {
    const pathArr = location.pathname.split('/')
    if (!milestoneType) {
      if (pathArr.includes('editMilestone')) {
        const milestonesId = pathArr[pathArr.length - 1]
        const projectId = pathArr[pathArr.length - 2]
        const callback = async () => {
          await props.dispatch.getMilestone({ projectId, milestonesId })
          await props.dispatch.update({
            milestoneType: 2,
            projectId,
            milestonesId,
          })
        }
        callback()
      }
      if (pathArr.includes('newMilestone')) {
        const projectId = pathArr[pathArr.length - 1]
        props.dispatch.update({ listDataInfo: {}, projectId, milestoneType: 1 })
      }
    }
  }, [milestoneType, location, props.dispatch])

  console.log(pathArr)

  useEffect(() => {
    if (milestoneType === 1) {
      props.dispatch.update({ listDataInfo: {} })
    }
    if (milestoneType === 2) {
      props.dispatch.getMilestone(projectId, milestonesId)
    }
  }, [
    props.dispatch,
    milestoneType,
    props.router.location.state,
    projectId,
    milestonesId,
  ])

  // 取消回调
  const onCancel = () => {
    window.history.back(-1)
  }

  return (
    <div className={styles.main}>
      <div className={styles.wrap}>
        <div className={styles.title}>
          {milestoneType === 1 ? '新建' : milestoneType === 2 ? '编辑' : ''}
          里程碑
        </div>
        <Loader
          tip="loading..."
          vertical
          style={{ width: '100%' }}
          loading={
            milestoneType === 1
              ? addMilestone
              : milestoneType === 2
              ? getMilestone || editMilestone
              : false
          }>
          <Form
            onSubmit={async ({ initial, current }) => {
              const errorObj = {}
              const { milestonesTitle, startTime, milestonesDesc } = current
              if (
                !milestonesTitle ||
                milestonesTitle.length < 2 ||
                milestonesTitle.length > 100
              ) {
                errorObj.milestonesTitle = '请输入标题,长度为2~100'
              }
              if (milestonesDesc && milestonesDesc.length > 300) {
                errorObj.milestonesDesc = '描述内容长度为应西不大于300'
              }
              if (!startTime) {
                errorObj.startTime = '开始时间不能为空！'
              }
              if (Object.keys(errorObj).length > 0) {
                const err = new Error()
                err.filed = errorObj
                throw err
              }

              //提交
              const { dispatch } = props
              const param = {
                ...current,
                dueTime:
                  current.dueTime &&
                  formatter('YYYY-MM-DD', new Date(current.dueTime)),
                startTime: formatter('YYYY-MM-DD', new Date(current.startTime)),
                milestonesStatus: +current.milestonesStatus,
                milestonesId: current.milestonesId || milestonesId,
                projectId,
              }
              const params = { payload: param, callback: onCancel }
              milestoneType === 1 && dispatch.addMilestone(params)
              milestoneType === 2 && dispatch.editMilestone(params)
            }}
            onSubmitError={(error) => {
              if (error.filed) {
                return { ...error.filed }
              }
              return null
            }}
            fields={{
              milestonesId: {
                inline: true,
                required: true,
                initialValue: listDataInfo.milestonesId,
                children: <Input />,
              },
              milestonesTitle: {
                inline: true,
                required: true,
                initialValue: listDataInfo.milestonesTitle,
                children: <Input placeholder="请输入标题" />,
              },
              startTime: {
                initialValue: listDataInfo.startTime,
                inline: true,
                required: true,
                labelFor: 'date-inline',
                children: (
                  <DateInput
                    format="YYYY-MM-DD"
                    datePickerProps={{ todayButton: '今天' }}
                  />
                ),
              },
              dueTime: {
                initialValue: listDataInfo.dueTime,
                inline: true,
                labelFor: 'date-inline',
                children: (
                  <DateInput
                    format="YYYY-MM-DD"
                    datePickerProps={{ todayButton: '今天' }}
                  />
                ),
              },
              milestonesStatus: {
                initialValue: listDataInfo.milestonesStatus || 1,
                inline: true,
                children: (
                  <Select className={styles.fromSelect}>
                    <Select.Option value={1}>打开</Select.Option>
                    <Select.Option value={2}>关闭</Select.Option>
                    <Select.Option value={3}>删除</Select.Option>
                  </Select>
                ),
              },
              milestonesDesc: {
                initialValue: listDataInfo.milestonesDesc,
                inline: true,
                children: <NEWMDEditor rfval={(e) => console.log(e)} />,
              },
            }}>
            {({ fields, state, canSubmit }) => {
              return (
                <div className={styles.from}>
                  <Row align="baseline" className={styles.fromItem}>
                    <Col span="4" className={styles.titleInput}>
                      标题
                    </Col>
                    <Col span="19">{fields.milestonesTitle}</Col>
                  </Row>
                  <Row align="baseline" className={styles.fromItem}>
                    <Col span="4" className={styles.titleInput}>
                      开始时间
                    </Col>
                    <Col span="19">{fields.startTime}</Col>
                  </Row>
                  <Row align="baseline" className={styles.fromItem}>
                    <Col span="4" className={styles.titleInput}>
                      结束时间
                    </Col>
                    <Col span="19">{fields.dueTime}</Col>
                  </Row>
                  <Row align="baseline" className={styles.fromItem}>
                    <Col span="4" className={styles.titleInput}>
                      描述
                    </Col>
                    <Col span="19">{fields.milestonesDesc}</Col>
                  </Row>
                  <Row align="baseline" className={styles.fromButton}>
                    <Col>
                      <Button disabled={!canSubmit()} htmlType="submit">
                        保存
                      </Button>
                      <Button onClick={() => onCancel()}>取消</Button>
                    </Col>
                  </Row>
                </div>
              )
            }}
          </Form>
        </Loader>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewMilestone)

import { useEffect } from 'react'
import { Row, Col, Input, DateInput, Select, Form, Button, Loader } from 'uiw'
import './style.css'
import { connect } from 'react-redux'
import formatter from '@uiw/formatter'
import { NEWMDEditor } from '@/components'

const NewMilestone = (props) => {
  const { milestoneType, listDataInfo } = props.milestone
  const { loading } = props
  const { addMilestone, editMilestone, getMilestone } =
    loading.effects.milestone

  useEffect(() => {
    if (milestoneType === 1) {
      props.dispatch.update({ listDataInfo: {} })
    }
    if (milestoneType === 2) {
      const { milestonesId } = props.router.location.state
      props.dispatch.getMilestone(milestonesId)
    }
  }, [props.dispatch, milestoneType, props.router.location.state])

  const onCancel = () => {
    window.history.back(-1)
    // milestoneType === 1 && navigate('/project')
    // // if (milestoneType === 1) navigate('/project/milestone', { state: { milestonesId }})
    // if (milestoneType === 2) {
    //   const { milestonesId } = props.router.location.state
    //   navigate('/project/milestone/editMilestone', {
    //     state: { milestonesId }
    //   })
    // }
  }

  return (
    <div className="main">
      <div className="title">
        {milestoneType === 1 ? '新建' : milestoneType === 2 ? '编辑' : ''}里程碑
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
              projectId: sessionStorage.getItem('id'),
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
                <Select className="fromSelect">
                  <Select.Option value={1}>打开</Select.Option>
                  <Select.Option value={2}>关闭</Select.Option>
                  <Select.Option value={3}>删除</Select.Option>
                </Select>
              ),
            },
            milestonesDesc: {
              initialValue: listDataInfo.milestonesDesc,
              inline: true,
              children: <NEWMDEditor />,
            },
          }}>
          {({ fields, state, canSubmit }) => {
            return (
              <div className="from">
                <Row align="baseline" className="fromItem">
                  <Col span="4" className="titleInput">
                    标题
                  </Col>
                  <Col span="19">{fields.milestonesTitle}</Col>
                </Row>
                <Row align="baseline" className="fromItem">
                  <Col span="4" className="titleInput">
                    开始时间
                  </Col>
                  <Col span="19">{fields.startTime}</Col>
                </Row>
                <Row align="baseline" className="fromItem">
                  <Col span="4" className="titleInput">
                    结束时间
                  </Col>
                  <Col span="19">{fields.dueTime}</Col>
                </Row>
                {/* <Row align="baseline" className="fromItem">
                  <Col span="4" className="titleInput">
                    状态
                  </Col>
                  <Col span="4">{fields.milestonesStatus}</Col>
                </Row> */}
                <Row align="baseline" className="fromItem">
                  <Col span="4" className="titleInput" style={{}}>
                    描述
                  </Col>
                  <Col span="19">{fields.milestonesDesc}</Col>
                </Row>
                <Row align="baseline" className="fromButton">
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

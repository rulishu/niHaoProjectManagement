import { useEffect, useRef, Fragment } from 'react'
import {
  Row,
  Col,
  Input,
  DateInput,
  Card,
  Select,
  Form,
  Button,
  Loader,
} from 'uiw'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import formatter from '@uiw/formatter'
import { NEWMDEditor } from '@/components'
import styles from './index.module.less'
// import changeTime from '@/utils/timeDistance'
// import { Container } from '@/components'

const NewMilestone = () => {
  const {
    milestone: { milestoneType, listDataInfo },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addMilestone, editMilestone, getMilestone } =
    loading.effects.milestone

  const location = useLocation()
  const { userAccount, projectId, milestonesId } = useParams()
  const form = useRef()

  useEffect(() => {
    dispatch.milestone.update({ projectId, milestonesId })
  }, [projectId, milestonesId, dispatch])

  useEffect(() => {
    const pathArr = location.pathname.split('/')
    if (!milestoneType) {
      if (pathArr.includes('editMilestone')) {
        const callback = async () => {
          await dispatch.milestone.update({ milestoneType: 2 })
        }
        callback()
      }
      if (pathArr.includes('newMilestone')) {
        dispatch.milestone.update({
          listDataInfo: {},
          projectId,
          milestoneType: 1,
        })
      }
    }
    milestoneType === 1 &&
      dispatch.milestone.update({ listDataInfo: {}, projectId })
    milestoneType === 2 &&
      dispatch.milestone.getMilestone({ projectId, milestonesId })
  }, [
    dispatch.milestone,
    location.pathname,
    milestoneType,
    milestonesId,
    projectId,
  ])

  useEffect(() => {
    document.addEventListener('paste', pasteDataEvent)
    return () => {
      document.removeEventListener('paste', pasteDataEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const pasteDataEvent = (event) => {
    // event.preventDefault();
    if (event.clipboardData || event.originalEvent) {
      let clipboardData =
        event.clipboardData || event.originalEvent.clipboardData
      if (clipboardData.items) {
        let items = clipboardData.items,
          len = items.length,
          blob = null
        for (let i = 0; i < len; i++) {
          let item = clipboardData.items[i]
          if (item.kind === 'string') {
            // item.getAsString(function (str) {
            //   console.log('string', str);
            // })
          } else if (item.kind === 'file') {
            blob = item.getAsFile()
            addImg(blob)
          }
        }
      }
    }
  }

  const addImg = (event) => {
    const file = event
    if (!file) return
    dispatch({
      type: 'allusers/upLoadImg',
      payload: { file: file },
    }).then((res) => {
      if (res && res.code === 200) {
        const fieldValues = form.current.getFieldValues()
        form.current.setFieldValue(
          'milestonesDesc',
          fieldValues['milestonesDesc'] +
            `![image](/api/file/selectFile/${res?.data})`
        )
      }
    })
  }

  // 取消回调
  const onCancel = () => {
    window.history.back(-1)
  }

  const milestonesForm = () => {
    return (
      <Form
        ref={form}
        onSubmit={async ({ initial, current }) => {
          const errorObj = {}
          const { milestonesTitle, startTime, milestonesDesc, dueTime } =
            current
          if (milestonesTitle.trim() === '') {
            errorObj.milestonesTitle = '请输入正确的标题'
          }
          if (
            !milestonesTitle ||
            milestonesTitle.length < 2 ||
            milestonesTitle.length > 78
          ) {
            errorObj.milestonesTitle = '请输入标题,长度为2~78'
          }
          if (milestonesDesc && milestonesDesc.length > 3000) {
            errorObj.milestonesDesc = '描述内容长度不大于3000'
          }
          if (!startTime) {
            errorObj.startTime = '开始时间不能为空！'
          }
          if (!dueTime) {
            errorObj.dueTime = '结束时间不能为空！'
          }
          if (
            formatter('YYYY-MM-DD', new Date(startTime)) >=
            formatter('YYYY-MM-DD', new Date(dueTime))
          ) {
            errorObj.dueTime = '结束时间不能早于等于开始时间'
          }
          // if (
          //   current.dueTime &&
          //   !timeDistance(current.startTime, current.dueTime).status
          // ) {
          //   errorObj.dueTime = '里程碑开始时间不能晚于结束时间！'
          // }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }

          //提交
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
          if (milestoneType === 1) {
            delete param.milestonesId
            const listGo = (projectId, milestonesId) => {
              navigate(
                `/${userAccount}/${projectId}/milestone/milestoneInfo/${milestonesId}`,
                {
                  state: { userAccount, projectId, milestonesId },
                }
              )
            }
            dispatch.milestone.addMilestone({
              payload: param,
              callback: listGo,
            })
          }
          milestoneType === 2 &&
            dispatch.milestone.editMilestone({
              payload: param,
              callback: onCancel,
            })
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
            initialValue: listDataInfo.milestonesTitle,
            children: <Input placeholder="请输入标题" />,
          },
          startTime: {
            initialValue: listDataInfo.startTime,
            inline: true,
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
            children: <NEWMDEditor />,
          },
        }}>
        {({ fields, state, canSubmit }) => {
          return (
            <div className={styles.from}>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  <span style={{ color: 'red' }}>*</span>标题
                </Col>
                <Col span="19">{fields.milestonesTitle}</Col>
              </Row>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  <span style={{ color: 'red' }}>*</span>开始时间
                </Col>
                <Col span="19">{fields.startTime}</Col>
              </Row>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  <span style={{ color: 'red' }}>*</span>结束时间
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
                  <Button
                    type="primary"
                    // disabled={!canSubmit()}
                    style={{ width: '80px' }}
                    loading={addMilestone || editMilestone}
                    htmlType="submit">
                    保存
                  </Button>
                  <Button
                    onClick={() => onCancel()}
                    loading={addMilestone || editMilestone}
                    style={{ width: '80px' }}>
                    取消
                  </Button>
                </Col>
              </Row>
            </div>
          )
        }}
      </Form>
    )
  }

  return (
    <Fragment>
      <Card>
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
              loading={getMilestone}>
              {milestoneType === 1
                ? milestonesForm()
                : milestoneType === 2 && Object.keys(listDataInfo).length
                ? milestonesForm()
                : ''}
            </Loader>
          </div>
        </div>
      </Card>
    </Fragment>
  )
}

export default NewMilestone

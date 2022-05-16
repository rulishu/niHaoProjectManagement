import { useEffect, useRef, useState } from 'react'
import {
  Row,
  Col,
  Input,
  Select,
  SearchSelect,
  Form,
  Button,
  DateInput,
  Loader,
  // FileInput,
} from 'uiw'
import './style.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectOption } from '@/utils/utils'
import dayjs from 'dayjs'
import { NEWMDEditor } from '@/components'
import 'tributejs/tribute.css'
import Tribute from 'tributejs'
import MDEditor from '@uiw/react-md-editor'

let tribute = new Tribute({
  trigger: '@',
  values: [
    { key: '11111111', value: 'pheartman' },
    { key: '22222222', value: 'gramsey' },
  ],
})

let mkdStr = `**Hello world!!!** `

const NewIssue = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    home: { taskId },
    project: { fromData },
    dictionary: { dictAllData },
    milestone: { milepostaData },
    projectuser: { userSelectAllList },
    loading,
  } = useSelector((state) => state)

  const form = useRef()
  const MDref = useRef()
  const isBundle = useRef(false)

  const [value, setValue] = useState(mkdStr)
  useEffect(() => {
    console.log('1111', MDref.current)
    console.log('2222', isBundle.current)
    if (MDref.current.textarea && !isBundle.current) {
      isBundle.current = true
      console.log('MDrefMDref', MDref.current)
      tribute.attach(MDref.current.textarea)
      document.addEventListener('tribute-replaced', (e) => {
        console.log('@', e)
        setValue(e.target.value)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MDref.current])

  useEffect(() => {
    dispatch.projectuser.pullSelectAll({ userName: '', projectId: taskId })
    dispatch.dictionary.getQueryAll({ dictTypeCode: 'labels' })
    dispatch.milestone.getListAll()
  }, [dispatch, taskId])

  useEffect(() => {
    document.addEventListener('paste', pasteDataEvent)
    return () => {
      document.removeEventListener('paste', pasteDataEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }

  const pasteDataEvent = (event) => {
    // event.preventDefault();
    if (event.clipboardData || event.originalEvent) {
      //某些chrome版本使用的是event.originalEvent
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

  // 上传图片的方法
  const addImg = (event) => {
    const file = event
    if (!file) return
    dispatch({
      type: 'allusers/upLoadImg',
      payload: {
        file: file,
      },
    }).then((res) => {
      if (res && res.code === 200) {
        const fieldValues = form.current.getFieldValues()
        form.current.setFieldValue(
          'description',
          fieldValues.description +
            `![image](/api/file/selectFile/${res?.data})`
        )
      }
    })
  }

  const onCancel = () => {
    navigate('/project/task')
  }
  return (
    <div className="main">
      <div className="title">新建问题</div>
      <MDEditor
        ref={MDref}
        value={value}
        onChange={(value) => setValue(value)}
      />
      {/* <FileInput multiple="multiple" style={{ maxWidth: 200 }} size="small" onChange={onChange} /> */}
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.project.getAdd}>
        <Form
          ref={form}
          onChange={({ current }) => {
            updateData({
              fromData: {
                ...fromData,
                ...current,
              },
            })
          }}
          onSubmit={() => {
            const errorObj = {}
            const { dueDate, labels, assigneeUser, assignmentTitle } = fromData
            if (
              !assignmentTitle ||
              assignmentTitle.length < 2 ||
              assignmentTitle.length > 100
            ) {
              errorObj.assignmentTitle = '请输入任务名称,长度为2~100'
            }
            if (Object.keys(errorObj).length > 0) {
              const err = new Error()
              err.filed = errorObj
              throw err
            }
            updateData({
              fromData: {
                ...fromData,
                dueDate: dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : '',
                labels:
                  labels.length > 0
                    ? dictAllData.filter((item) =>
                        labels.includes(item.dictCode)
                      )
                    : [],
                assigneeUserId:
                  assigneeUser.length > 0 ? assigneeUser[0].value : '',
                assigneeUserName:
                  assigneeUser.length > 0 ? assigneeUser[0].label : '',
                projectId: taskId,
              },
            })
            dispatch.project.getAdd()
          }}
          onSubmitError={(error) => {
            if (error.filed) {
              return { ...error.filed }
            }
            return null
          }}
          fields={{
            assignmentTitle: {
              required: true,
              inline: true,
              initialValue: fromData.assignmentTitle,
              children: <Input placeholder="请输入标题" />,
            },
            assignmentType: {
              required: true,
              inline: true,
              initialValue: fromData.assignmentType,
              children: (
                <Select className="fromSelect">
                  <Select.Option value={1}>Issue</Select.Option>
                  <Select.Option value={2}>Incident</Select.Option>
                </Select>
              ),
            },
            description: {
              inline: true,
              initialValue: fromData.description,
              children: <NEWMDEditor />,
            },
            assigneeUser: {
              inline: true,
              initialValue: fromData.assigneeUserId,
              children: (
                <SearchSelect
                  style={{ width: '100%' }}
                  showSearch={true}
                  allowClear
                  disabled={false}
                  labelInValue={true}
                  placeholder="请输入成员姓名,可模糊查询"
                  option={selectOption(userSelectAllList)}
                  // loading={loading}
                />
              ),
            },
            dueDate: {
              inline: true,
              initialValue: fromData.dueDate,
              children: (
                <DateInput
                  format="YYYY/MM/DD"
                  datePickerProps={{ todayButton: '今天' }}
                />
              ),
            },
            milestonesId: {
              inline: true,
              initialValue: fromData.milestonesId,
              children: (
                <SearchSelect
                  showSearch={true}
                  allowClear
                  disabled={false}
                  placeholder="请输入选择"
                  option={
                    selectOption(
                      milepostaData,
                      'milestonesId',
                      'milestonesTitle'
                    ) || []
                  }
                  // loading={loading}
                />
              ),
            },
            labels: {
              inline: true,
              initialValue: fromData.labels,
              children: (
                <SearchSelect
                  mode={'multiple'}
                  showSearch={true}
                  allowClear
                  disabled={false}
                  placeholder="请输入选择"
                  option={selectOption(dictAllData, 'dictCode', 'dictName')}
                  // loading={loading}
                />
              ),
            },
          }}>
          {({ fields, state, canSubmit }) => {
            return (
              <div>
                <div className="from">
                  <Row align="baseline" className="fromItem">
                    <Col span="4" className="titleInput">
                      标题
                    </Col>
                    <Col span="19">{fields.assignmentTitle}</Col>
                  </Row>
                  <Row align="baseline" className="fromItem">
                    <Col span="4" className="titleInput">
                      类型
                    </Col>
                    <Col span="19">{fields.assignmentType}</Col>
                  </Row>
                  <Row align="top" className="fromItem">
                    <Col span="4" className="titleInput" style={{}}>
                      描述
                    </Col>
                    <Col span="19">{fields.description}</Col>
                  </Row>
                  <Row align="baseline" className="fromItem">
                    <Col span="4" className="titleInput">
                      指派人
                    </Col>
                    <Col span="19">{fields.assigneeUser}</Col>
                  </Row>
                  <Row align="baseline" className="fromItem">
                    <Col span="4" className="titleInput">
                      截止日期
                    </Col>
                    <Col span="19">{fields.dueDate}</Col>
                  </Row>
                  <Row align="baseline" className="fromItem">
                    <Col span="4" className="titleInput">
                      里程碑
                    </Col>
                    <Col span="19">{fields.milestonesId}</Col>
                  </Row>
                  <Row align="baseline" className="fromItem">
                    <Col span="4" className="titleInput">
                      标签
                    </Col>
                    <Col span="19">{fields.labels}</Col>
                  </Row>
                </div>
                <Row align="middle" className="fromButton">
                  <Col>
                    <Button disabled={!canSubmit()} htmlType="submit">
                      提交
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

export default NewIssue

import { useEffect } from 'react'
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

  useEffect(() => {
    dispatch.projectuser.pullSelectAll({ userName: '', projectId: taskId })
    dispatch.dictionary.getQueryAll({ dictTypeCode: 'labels' })
    dispatch.milestone.getListAll()
  }, [dispatch, taskId])

  // useEffect(() => {
  //   document.addEventListener('paste', pasteDataEvent)
  //   return () => {
  //     if (this.editorExample.current) {
  //       this.editorExample.current.editor.destroy()
  //     }
  //     document.removeEventListener('paste', pasteDataEvent)
  //   }
  // }, [])

  const updateData = (payload) => {
    dispatch({
      type: 'project/update',
      payload,
    })
  }
  // document.addEventListener('copy', function (e) {
  //   e.preventDefault()
  //   const textArr = window.getSelection().toString().split('\t')
  //   console.log('11111', textArr)
  //   let pasteText = ''
  //   textArr.forEach(function (e) {
  //     pasteText += e
  //   })
  //   e.clipboardData.setData('text', pasteText + '拼接的参数')
  // })

  // document.addEventListener(
  //   'paste',
  //   function (e) {
  //     console.log(e)
  //     if (!(e.clipboardData && e.clipboardData.items)) {
  //       return false
  //     }
  //     for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
  //       const item = e.clipboardData.items[i]
  //       console.log(item)
  //       if (item.kind === 'file') {
  //         const f = item.getAsFile()
  //         const reader = new FileReader()
  //         reader.onload = function (e) {
  //           console.log(e.target.result)
  //           // const img = document.createElement('img')
  //           // img.src = e.target.result
  //           // document.getElementById('pic').appendChild(img)
  //         }
  //         reader.readAsDataURL(f)
  //       }
  //     }
  //   },
  //   false
  // )

  // const pasteDataEvent = (event) => {
  //   event.preventDefault()
  //   if (event.clipboardData || event.originalEvent) {
  //     //某些chrome版本使用的是event.originalEvent
  //     let clipboardData =
  //       event.clipboardData || event.originalEvent.clipboardData
  //     if (clipboardData.items) {
  //       // for chrome
  //       let items = clipboardData.items,
  //         len = items.length,
  //         blob = null
  //       for (let i = 0; i < len; i++) {
  //         console.log(items[i])
  //         if (items[i].type.indexOf('image') !== -1) {
  //           //getAsFile() 此方法只是living standard firefox ie11 并不支持
  //           blob = items[i].getAsFile()
  //           this.addImg(blob, 'No') // 自定义上传到oss或是七牛云图片的方法
  //         }
  //       }
  //     }
  //   }
  // }
  // 上传图片的方法
  // const addImg = async (event, val) => {
  //   const file = val === 'No' ? event : event.currentTarget.files[0]
  //   if (!file || !this.state.listData.length) return
  //   uploadImage(file).then(res => {
  //     // 上传成功之后调用富文本的方法插入到光标的位置
  //     this.editorExample.current.editor.cmd.do('insertHTML', `<img src=${res.imageUrl} />`)
  //     document.getElementById('uploadfile').value = null
  //   })
  // }
  // 卸载富文本以及移除事件

  const onCancel = () => {
    navigate('/project/task')
  }
  // const onChange = async (e) => {
  //   console.log('11111', e)
  //   console.log('22222', e.files)
  //   // dispatch.users.getUploadFile({
  //   //   path: e.target.value,
  //   //   ext: e.target.files[0].type,
  //   //   originName: e.target.files[0].name,
  //   //   size: e.target.files[0].size,
  //   //   uploadTime: e.target.files[0].lastModifiedDate
  //   // })
  // }
  return (
    <div className="main">
      <div className="title">新建问题</div>
      {/* <FileInput multiple="multiple" style={{ maxWidth: 200 }} size="small" onChange={onChange} /> */}
      <Loader
        tip="加载中..."
        vertical
        style={{ width: '100%' }}
        loading={loading.effects.project.getAdd}>
        <Form
          onChange={({ current }) => {
            updateData({
              fromData: {
                ...fromData,
                ...current,
              },
            })
          }}
          onSubmit={(item) => {
            const errorObj = {}
            const { current } = item
            const { dueDate, labels, assigneeUser, ...newCurrent } = current
            const { assignmentTitle, description } = current
            if (
              !assignmentTitle ||
              assignmentTitle.length < 2 ||
              assignmentTitle.length > 100
            ) {
              errorObj.assignmentTitle = '请输入任务名称,长度为2~100'
            }
            if (description && description.length > 300) {
              errorObj.description = '任务详情长度应小于300'
            }
            if (Object.keys(errorObj).length > 0) {
              const err = new Error()
              err.filed = errorObj
              throw err
            }
            updateData({
              fromData: {
                ...fromData,
                ...newCurrent,
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
                      受让人
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

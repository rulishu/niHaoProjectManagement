import { useEffect, useRef, useState, useMemo } from 'react'
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  DateInput,
  Loader,
  // FileInput,
} from 'uiw'
import './style.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { initListData } from '@/utils/utils'
import dayjs from 'dayjs'
import { NEWMDEditor } from '@/components'
import 'tributejs/tribute.css'
import Tribute from 'tributejs'
import useLocationPage from '@/hooks/useLocationPage'
import { Container } from '@/components'
import { CompDropdown } from '@/components'
import { ThisTime, changeTimeFormat } from '@/utils/timeDistance'

const NewIssue = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // 处理带id的路由
  useLocationPage()
  const params = useParams()
  const { projectId, userAccount } = params
  const {
    project: { fromData, allWork },
    // dictionary: { dictDataList },
    milestone: { milepostaData, taskMilestonesTitle, taskMilestonesId },
    labels: { listData: labelsListData },
    projectuser: { userSelectAllList },
    loading,
  } = useSelector((state) => state)

  const form = useRef()
  const isBundle = useRef(false)
  const [mdRefs, setMdRefs] = useState()

  useEffect(() => {
    dispatch.projectuser.pullSelectAll({ memberName: '', projectId: projectId })
    dispatch.labels.getAllLabelData({ projectId })
    // dispatch.dictionary.getDictDataList({
    //   dictType: 'assignment_label',
    // })
    dispatch.milestone.getListAll({
      projectId: projectId,
      milestonesStatusList: [1, 2],
    })
    dispatch.project.getAssignment({ projectId: projectId }) //不分页获取所有任务
  }, [dispatch, projectId])

  const tribute = useMemo(() => {
    return new Tribute({
      collection: [
        {
          trigger: '@',
          values: userSelectAllList || [],
          lookup: 'memberName',
          fillAttr: 'memberName',
        },
        {
          trigger: '#',
          values: allWork || [],
          lookup: function (allWork) {
            return '#' + allWork.assignmentId + ' ' + allWork.assignmentTitle
          },
          fillAttr: 'assignmentTitle',
        },
        {
          trigger: '~',
          values: labelsListData || [],
          lookup: 'name',
          fillAttr: 'name',
        },
        {
          trigger: '%',
          values: milepostaData || [],
          lookup: 'milestonesTitle',
          fillAttr: 'milestonesTitle',
        },
      ],
    })
  }, [userSelectAllList, allWork, labelsListData, milepostaData])

  useEffect(() => {
    if (mdRefs?.current?.textarea && !isBundle.current) {
      isBundle.current = true
      tribute.attach(mdRefs.current.textarea)
      mdRefs.current.textarea.addEventListener('tribute-replaced', (e) => {
        form.current.setFieldValue('description', e.target.value)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mdRefs, tribute])

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

  // 新建标签
  const createTag = async (formData) => {
    let result = false
    await dispatch({
      type: 'labels/addLabelItem',
      payload: {
        param: { ...formData, projectId },
        callback: (data) => {
          result = data
          dispatch.labels.getAllLabelData({ projectId })
        },
      },
    })
    return result
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
    navigate(`/${userAccount}/${projectId}/task`)
  }

  return (
    <Container>
      <div className="main">
        <div className="title">新建任务</div>
        {/* <FileInput multiple="multiple" style={{ maxWidth: 200 }} size="small" onChange={onChange} /> */}
        <Loader
          tip="加载中..."
          vertical
          style={{ width: '100%' }}
          loading={loading.effects.project.getAdd}>
          <Form
            ref={form}
            onChange={({ current }) => {
              // console.log(fromData, current)
              updateData({
                fromData: {
                  ...fromData,
                  ...current,
                },
              })
            }}
            onSubmit={(current) => {
              const errorObj = {}
              const { dueDate, labels, assignmentTitle } = fromData
              if (
                !assignmentTitle ||
                assignmentTitle.length < 2 ||
                assignmentTitle.length > 100
              ) {
                errorObj.assignmentTitle = '请输入任务名称,长度为2~100'
              }
              if (
                current.current.dueDate &&
                changeTimeFormat(current.current.dueDate) <= ThisTime()
              ) {
                errorObj.dueDate = '截止日期应该晚于当前时间'
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
                  labels,
                },
              })
              dispatch.project.getAdd({ projectId: projectId })
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
              // assignmentType: {
              //   required: true,
              //   inline: true,
              //   initialValue: fromData.assignmentType,
              //   children: (
              //     <Select className="fromSelect">
              //       <Select.Option value={1}>问题</Select.Option>
              //       <Select.Option value={2}>事件</Select.Option>
              //     </Select>
              //   ),
              // },
              description: {
                inline: true,
                initialValue: fromData.description,
                children: (
                  <NEWMDEditor
                    rfval={(e) => {
                      setMdRefs(e)
                    }}
                  />
                ),
              },
              assigneeUser: {
                inline: true,
                initialValue: fromData.assigneeUserId,
                children: (
                  <div style={{ width: '100%' }}>
                    <CompDropdown
                      listData={initListData(
                        userSelectAllList,
                        fromData.assigneeUserId,
                        'userId',
                        {
                          memberName: 'memberName',
                          avatar: 'avatar',
                          userAcount: 'userAcount',
                        }
                      )}
                      template="personnel"
                      isRadio={true}
                      shape="input"
                      loading={loading.effects.dictionary.getDictDataList}
                      runLabel={() =>
                        navigate(`/${userAccount}/${projectId}/usersManagement`)
                      }
                      onChange={(value) => {
                        const userName = userSelectAllList
                          ?.map((item) =>
                            item.userId === value ? item.memberName : undefined
                          )
                          ?.filter((s) => s)[0]
                        const fieldValues = form.current.getFieldValues()
                        form.current.setFields({
                          ...fieldValues,
                          assigneeUserId: value,
                          assigneeUserName: userName,
                        })
                        updateData({
                          fromData: {
                            ...fromData,
                            assigneeUserId: value,
                            assigneeUserName: userName,
                          },
                        })
                      }}
                    />
                  </div>
                  // <SearchSelect
                  //   style={{ width: '100%' }}
                  //   showSearch={true}
                  //   allowClear
                  //   disabled={false}
                  //   labelInValue={true}
                  //   placeholder="请输入成员姓名,可模糊查询"
                  //   option={selectOption(
                  //     userSelectAllList,
                  //     'userId',
                  //     'memberName'
                  //   )}
                  // //  loading={loading}
                  // />
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
                initialValue: taskMilestonesTitle
                  ? taskMilestonesId
                  : fromData.milestonesId,
                children: (
                  <CompDropdown
                    listData={initListData(
                      milepostaData,
                      taskMilestonesTitle
                        ? taskMilestonesId
                        : fromData.milestonesId,
                      'milestonesId',
                      { title: 'milestonesTitle' }
                    )}
                    actionButtons={{ create: { isHide: true } }}
                    template="milepost"
                    isRadio={true}
                    shape="input"
                    loading={loading.effects.dictionary.getDictDataList}
                    runLabel={() => {
                      navigate(`/${userAccount}/${projectId}/milestone`, {
                        replace: true,
                      })
                    }}
                  />
                  // <SearchSelect
                  //   showSearch={true}
                  //   allowClear
                  //   // value={taskMilestonesTitle}
                  //   disabled={false}
                  //   placeholder="请输入选择"
                  //   option={
                  //     selectOption(
                  //       milepostaData,
                  //       'milestonesId',
                  //       'milestonesTitle'
                  //     ) || []
                  //   }
                  // //loading={loading}
                  // />
                ),
              },
              labels: {
                inline: true,
                initialValue: fromData.labels,
                children: (
                  <CompDropdown
                    listData={initListData(
                      labelsListData,
                      fromData.labels,
                      'id',
                      { color: 'color', title: 'name' }
                    )}
                    template="label"
                    shape="input"
                    loading={loading.effects.dictionary.getDictDataList}
                    runLabel={() =>
                      navigate(`/${userAccount}/${projectId}/labels`)
                    }
                    createTag={(_, current) => createTag(current)}
                  />
                  // <SearchSelect
                  //   mode={'multiple'}
                  //   showSearch={true}
                  //   allowClear
                  //   disabled={false}
                  //   placeholder="请输入选择"
                  //   option={
                  //     selectOption(dictDataList, 'dictCode', 'dictLabel') || []
                  //   }
                  //   //loading={loading}
                  // />
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
                      <Button
                        disabled={!canSubmit()}
                        htmlType="submit"
                        type="primary">
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
    </Container>
  )
}

export default NewIssue

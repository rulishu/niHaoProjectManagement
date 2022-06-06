import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Loader } from 'uiw'
import formatter from '@uiw/formatter'
import { useState } from 'react'

/**
 * 使用方法：
 * 先引用组件（fun为回调函数，回调刷新函数）
 * <ProjectManagement fun={reset}></ProjectManagement>
 *
 * 新增
 * dispatch({
 *  type: 'projectUpdate/updataProject',
 *  payload: { drawerType: 'add' },
 *})
 *
 * 编辑
 * dispatch({
 *  type: 'projectUpdate/updataProject',
 *  payload: { drawerType: 'edit'，id:"..." },
 *})
 * @returns
 */

const ProjectManagement = (fun) => {
  const [showSubmit, setShowSubmit] = useState(false)
  const baseRef = useForm()
  const dispatch = useDispatch()
  const {
    projectUpdate: {
      drawerVisible,
      drawerType,
      seachValue,
      userList,
      id,
      isHangup,
      fileIds, //Logo文件的id
    },
    userHome: { user },
    loading,
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'projectUpdate/updateState',
      payload,
    })
  }

  const onClose = () => {
    updateData({
      drawerVisible: false,
      seachValue: {},
      drawerType: '',
      fileIds: '',
    })
    setShowSubmit(false)
  }

  function saveData() {
    if (drawerType === 'add') {
      seachValue.projectAvatar = fileIds
      dispatch({
        type: 'projectUpdate/addProject',
        payload: { seachValue, callback: fun.fun, userName: user.userName },
      })
    } else if (drawerType === 'edit') {
      seachValue.id = id
      seachValue.projectAvatar = fileIds
      dispatch({
        type: 'projectUpdate/updateProject',
        payload: { seachValue, callback: fun.fun },
      })
    }
  }

  const proform = () => {
    return (
      <ProForm
        formType="pure"
        form={baseRef}
        formDatas={[
          {
            label: '项目名称:',
            key: 'name',
            widget: 'input',
            initialValue: seachValue?.name,
            widgetProps: {
              onChange: () => {
                setShowSubmit(true)
              },
            },
            placeholder: '请输入项目名称',
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入项目名称' }],
          },
          {
            label: '项目负责人:',
            key: 'projectLeaderId',
            widget: 'select',
            option: userList,
            initialValue: seachValue?.projectLeaderId,
            widgetProps: {
              onChange: () => {
                setShowSubmit(true)
              },
            },
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入项目负责人' }],
            hide: drawerType === 'add',
          },
          {
            label: '起始日期:',
            key: 'begin',
            initialValue: seachValue?.begin,
            widget: 'dateInput',
            widgetProps: {
              format: 'YYYY-MM-DD',
              onChange: () => {
                setShowSubmit(true)
              },
            },
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入起始日期' }],
          },
          {
            label: '截止日期:',
            key: 'end',
            initialValue: seachValue?.end,
            widget: 'dateInput',
            widgetProps: {
              format: 'YYYY-MM-DD',
              onChange: () => {
                setShowSubmit(true)
              },
            },
            span: '24',
            required: true,
            rules: [
              {
                validator: (value) => {
                  const obj = baseRef?.getFieldValues()
                  if (Object.keys(obj).length > 0 && value >= obj.begin)
                    return true
                },
                message: '截止日期必须晚于或等于起始日期且不能为空',
              },
            ],
          },
          {
            label: '项目描述:',
            key: 'descr',
            widget: 'textarea',
            initialValue: seachValue?.descr,
            widgetProps: {
              onChange: () => {
                setShowSubmit(true)
              },
            },
            span: '24',
          },
          {
            label: '项目Logo:',
            key: 'projectAvatar',
            widget: 'upload',
            span: '24',
            initialValue: seachValue.projectAvatar
              ? [
                  {
                    dataURL: `/api/file/selectFile/${seachValue.projectAvatar}`,
                  },
                ]
              : null,
            widgetProps: {
              uploadType: 'card',
              maxNumber: 1,
              showFileIcon: {
                showPreviewIcon: true,
                showRemoveIcon: true,
              },
              onChange: async (e) => {
                setShowSubmit(true)
                if (e.length > 0) {
                  await dispatch({
                    type: 'projectUpdate/uploadFile',
                    payload: { file: e[0]?.file },
                  })
                } else {
                  await updateData({
                    fileIds: '',
                  })
                }
              },
            },
          },
          {
            label: '是否挂起:',
            key: 'status',
            widget: 'switch',
            initialValue: isHangup,
            widgetProps: {
              onChange: () => {
                setShowSubmit(true)
              },
            },
            hide: drawerType === 'add',
          },
        ]}
        onChange={(initial, current) => {
          let begin = formatter(current.begin)
          let end = formatter(current.end)
          current.begin = begin
          current.end = end
          updateData({ seachValue: { ...current } })
        }}
      />
    )
  }
  return (
    <div>
      <ProDrawer
        visible={drawerVisible}
        width={500}
        onClose={onClose}
        title={drawerType === 'edit' ? '编辑' : '新增'}
        buttons={[
          {
            label: '取消',
            onClick: onClose,
          },
          {
            label: '保存',
            type: 'primary',
            show: showSubmit,
            onClick: async () => {
              await baseRef?.submitvalidate?.()
              const errors = baseRef.getError()
              if (errors && Object.keys(errors).length > 0) return
              saveData()
              setShowSubmit(false)
            },
          },
        ]}>
        <Loader
          loading={loading.effects.projectUpdate.selectAllUserlist}
          bgColor="rgba(0, 0, 0, 0.4)"
          style={{ width: '100%' }}
          tip="loading...">
          <div>
            {drawerType === 'add' ? (
              proform()
            ) : drawerType === 'edit' ? (
              Object.keys(seachValue).length ? (
                proform()
              ) : (
                <></>
              )
            ) : (
              ''
            )}
          </div>
        </Loader>
      </ProDrawer>
    </div>
  )
}

export default ProjectManagement

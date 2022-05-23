import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Loader } from 'uiw'

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
    },
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
    })
  }

  function saveData() {
    if (drawerType === 'add') {
      dispatch({
        type: 'projectUpdate/addProject',
        payload: { seachValue, callback: fun.fun },
      })
    } else if (drawerType === 'edit') {
      seachValue.id = id
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
            widgetProps: {},
            placeholder: '请输入项目名称',
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入项目名称' }],
          },
          {
            label: '项目负责人:',
            key: 'userId',
            widget: 'select',
            option: userList,
            initialValue: seachValue?.updateId,
            widgetProps: {},
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入项目负责人' }],
          },
          {
            label: '起始日期:',
            key: 'begin',
            initialValue: seachValue?.begin,
            widget: 'dateInput',
            widgetProps: {
              format: 'YYYY-MM-DD',
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
            },
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入截止日期' }],
          },
          {
            label: '项目描述:',
            key: 'descr',
            widget: 'textarea',
            initialValue: seachValue?.descr,
            widgetProps: {},
            span: '24',
          },
          {
            label: '是否挂起:',
            key: 'status',
            widget: 'switch',
            initialValue: isHangup,
            widgetProps: {},
            hide: drawerType === 'add',
          },
        ]}
        onChange={(initial, current) => {
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
            onClick: async () => {
              await baseRef?.submitvalidate?.()
              const errors = baseRef.getError()
              if (errors && Object.keys(errors).length > 0) return
              saveData()
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

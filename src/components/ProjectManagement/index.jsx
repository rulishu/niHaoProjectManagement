import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Notify } from 'uiw'
import useSWR from 'swr'

/**
 * 使用方法：
 *
 * 新增
 * dispatch({
 *  type: 'global/updataProject',
 *  payload: { drawerType: 'add' },
 *})
 *
 * 编辑
 * dispatch({
 *  type: 'global/updataProject',
 *  payload: { drawerType: 'edit'，id:"..." },
 *})
 * @returns
 */

const ProjectManagement = () => {
  const baseRef = useForm()
  const dispatch = useDispatch()
  const {
    global: { drawerVisible, drawerType, seachValue },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'global/updateState',
      payload,
    })
  }

  const onClose = () => {
    updateData({
      drawerVisible: false,
      seachValue: {},
    })
  }

  const { mutate, isValidating } = useSWR(
    [
      (drawerType === 'edit' && '/api/project/update') ||
        (drawerType === 'add' && '/api/project/add') || {
          method: 'POST',
          body: seachValue,
        },
    ],
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && data.code === 200) {
          Notify.success({ title: data.msg })
        } else {
          Notify.error({ title: data.msg })
        }
      },
    }
  )

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
            loading: isValidating,
            onClick: async () => {
              await baseRef?.submitvalidate?.()
              const errors = baseRef.getError()
              if (errors && Object.keys(errors).length > 0) return
              mutate()
            },
          },
        ]}>
        <ProForm
          formType="pure"
          form={baseRef}
          formDatas={[
            {
              label: '项目名称:',
              key: 'name',
              widget: 'input',
              initialValue: seachValue.name,
              widgetProps: {},
              placeholder: '请输入项目名称',
              span: '24',
              required: true,
              rules: [{ required: true, message: '请输入项目名称' }],
            },
            {
              label: '项目负责人:',
              key: 'projectLeaderName',
              widget: 'select',
              option: [
                { value: 1, label: '苹果' },
                { value: 2, label: '西瓜' },
                { value: 3, label: '香蕉' },
                { value: 4, label: '东北大冻梨' },
              ],
              initialValue: seachValue.projectLeaderName,
              widgetProps: {},
              span: '24',
              required: true,
              rules: [{ required: true, message: '请输入项目负责人' }],
            },
            {
              label: '起止日期:',
              key: 'begin',
              initialValue: seachValue.begin,
              widget: 'dateInput',
              widgetProps: {
                format: 'YYYY-MM-DD HH:mm:ss',
              },
              span: '24',
              required: true,
              rules: [{ required: true, message: '请输入起止日期' }],
            },
            {
              label: '截止日期:',
              key: 'end',
              initialValue: seachValue.end,
              widget: 'dateInput',
              widgetProps: {
                format: 'YYYY-MM-DD HH:mm:ss',
              },
              span: '24',
              required: true,
              rules: [{ required: true, message: '请输入截止日期' }],
            },
            {
              label: '项目描述:',
              key: 'descr',
              widget: 'textarea',
              initialValue: seachValue.descr,
              widgetProps: {},
              span: '24',
            },
          ]}
          onChange={(initial, current) => {
            updateData({ seachValue: { ...current } })
          }}
        />
      </ProDrawer>
    </div>
  )
}
export default ProjectManagement

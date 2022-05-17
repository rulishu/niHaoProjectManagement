import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Notify } from 'uiw'
import useSWR from 'swr'
import { item } from './items'

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

const ProjectManagement = ({ onSearch }) => {
  const baseRef = useForm()
  const dispatch = useDispatch()
  const {
    global: { drawerVisible, drawerType, seachValue, isView },
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
      isView: false,
    })
  }

  const { mutate, isValidating } = useSWR(
    [
      (drawerType === 'edit' && '/api/project/update') ||
        (drawerType === 'add' && '/api/project/add'),
      { method: 'POST', body: seachValue },
    ],
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && data.code === 200) {
          Notify.success({ title: data.msg })
          onClose()
          onSearch?.()
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
            label: '保存',
            style: { width: 80 },
            type: 'primary',
            show: !isView,
            loading: isValidating,
            onClick: async () => {
              await baseRef?.submitvalidate?.()
              const errors = baseRef.getError()
              if (errors && Object.keys(errors).length > 0) {
                return
              }
              mutate()
            },
          },
          {
            label: isView ? '关闭' : '取消',
            style: { width: 80 },
            onClick: onClose,
          },
        ]}>
        <ProForm
          formType="pure"
          form={baseRef}
          readOnly={isView}
          onChange={(initial, current) => {
            updateData({ seachValue: { ...seachValue } })
          }}
          formDatas={item(seachValue)}
        />
      </ProDrawer>
    </div>
  )
}
export default ProjectManagement

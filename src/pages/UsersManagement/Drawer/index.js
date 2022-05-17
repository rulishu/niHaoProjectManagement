import { ProDrawer, useForm, ProForm } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
import { items } from './items'

const Drawer = (props) => {
  const baseRef = useForm()
  const dispatch = useDispatch()

  const {
    usersManagement: { drawerVisible, isView, loading, queryInfo },
  } = useSelector((state) => state)

  const onClose = () => {
    dispatch({
      type: 'usersManagement/updateState',
      payload: {
        drawerVisible: false,
        isView: false,
      },
    })
  }

  return (
    <ProDrawer
      title={''}
      visible={drawerVisible}
      onClose={onClose}
      width={800}
      buttons={[
        {
          label: '取消',
          onClick: onClose,
          show: !isView,
        },
        {
          label: '保存',
          type: 'primary',
          show: !isView,
          loading: loading,
          onClick: async () => {
            await baseRef?.submitvalidate?.()
            const errors = baseRef.getError()
            if (errors && Object.keys(errors).length > 0) return
          },
        },
      ]}>
      <ProForm
        title="基础信息"
        formType={isView ? 'pure' : 'card'}
        form={baseRef}
        readOnly={isView}
        buttonsContainer={{ justifyContent: 'flex-start' }}
        onChange={(initial, current) => console.log(current)}
        formDatas={items(queryInfo)}
      />
    </ProDrawer>
  )
}

export default Drawer

import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

export default function Index() {
  const form = useForm()
  const dispatch = useDispatch()

  const {
    team: { drawerVisible, queryInfo, drawerType, isView, saveState },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'team/updateState',
      payload,
    })
  }

  const onClose = () => dispatch({ type: 'team/clean' })

  return (
    <ProDrawer
      width={500}
      title={
        drawerType === 'add'
          ? '添加团队'
          : drawerType === 'edit'
          ? '编辑团队'
          : ''
      }
      visible={drawerVisible}
      onClose={onClose}
      buttons={[
        // {
        //   label: '取消',
        //   onClick: onClose,
        //   show: !isView,
        // },
        {
          label: '保存',
          type: 'primary',
          show: !isView,
          style: { width: 80 },
          loading: saveState,
          onClick: async () => {
            await form?.submitvalidate?.()
            const errors = form.getError()
            if (errors && Object.keys(errors).length > 0) return
            dispatch({
              type: `team/${drawerType === 'add' ? 'addTeam' : 'editTeam'}`,
              payload: {
                ...queryInfo,
              },
            })
          },
        },
      ]}>
      <ProForm
        form={form}
        // title="基础信息"
        formType={'card'}
        readOnly={isView}
        onChange={(initial, current) =>
          updateData({ queryInfo: { ...queryInfo, ...current } })
        }
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo, drawerType)}
        readOnlyProps={{ column: 1 }}
      />
    </ProDrawer>
  )
}

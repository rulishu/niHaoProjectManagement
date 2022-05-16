import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Notify } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'
import { addRole, upDateRole } from '@/servers/rolemanagement'
import useSWR from 'swr'

const Detail = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    rolemanagement: { drawerVisible, tableType, queryInfo, isView },
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'rolemanagement/clean' })

  const { mutate } = useSWR(
    [
      (tableType === 'add' && addRole) || (tableType === 'edit' && upDateRole),
      {
        method: 'POST',
        body: {
          ...queryInfo,
          menuIds: [59, 28, 7, 8, 5, 9, 10, 11, 12, 16, 20],
        },
      },
    ],
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && data.code === 200) {
          Notify.success({ title: data?.message })
          onClose()
          onSearch?.()
        }
      },
    }
  )

  return (
    <ProDrawer
      width={500}
      title={
        tableType === 'add' ? '新增' : tableType === 'edit' ? '编辑' : '查看'
      }
      visible={drawerVisible}
      onClose={onClose}
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
          onClick: async () => {
            await form?.submitvalidate?.()
            const errors = form.getError()
            if (errors && Object.keys(errors).length > 0) return
            mutate()
          },
        },
      ]}>
      <ProForm
        form={form}
        title="基础信息"
        formType={isView ? 'pure' : 'card'}
        readOnly={isView}
        onChange={(initial, current) =>
          updateData({ queryInfo: { ...queryInfo, ...current } })
        }
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo)}
        readOnlyProps={{ column: 1 }}
      />
    </ProDrawer>
  )
}

export default Detail

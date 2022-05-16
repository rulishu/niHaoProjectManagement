import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Notify } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'
import { addMenu, updateMenu } from '@/servers/menumanagement'
import useSWR from 'swr'

const Detail = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    menumanagement: { drawerVisible, tableType, queryInfo, isView },
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'menumanagement/clean' })

  const { mutate } = useSWR(
    [
      ((tableType === 'add' || tableType === 'addChild') && addMenu) ||
        (tableType === 'edit' && updateMenu),
      { method: 'POST', body: queryInfo },
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
          updateData({
            queryInfo: {
              ...queryInfo,
              parentId: tableType === 'addChild' ? queryInfo.parentId : null,
              ...current,
            },
          })
        }
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo)}
      />
    </ProDrawer>
  )
}

export default Detail

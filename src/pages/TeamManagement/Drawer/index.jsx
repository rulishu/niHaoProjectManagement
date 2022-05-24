import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Notify } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { addTeam, editTeam } from '@/servers/team'
import { items } from './items'
import useSWR from 'swr'

const Detail = (props) => {
  const baseRef = useForm()
  const dispatch = useDispatch()
  const {
    team: { drawerVisible, tableType, queryInfo, isView },
  } = useSelector((team) => team)

  const onClose = () => dispatch({ type: 'team/clean' })

  const { mutate, isValidating } = useSWR(
    [
      (tableType === 'add' && addTeam) || (tableType === 'edit' && editTeam),
      { method: 'POST', body: queryInfo },
    ],
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && data.code === 1) {
          Notify.success({ title: data.message })
          onClose()
          props.onSearch()
        } else {
          Notify.error({ title: '提交失败！' + data.message })
        }
      },
    }
  )

  return (
    <ProDrawer
      width={800}
      title={
        tableType === 'add' ? '新增' : tableType === 'edit' ? '编辑' : '查看'
      }
      visible={drawerVisible}
      onClose={onClose}
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
        title="基础信息"
        formType={isView ? 'pure' : 'card'}
        form={baseRef}
        readOnly={isView}
        buttonsContainer={{ justifyContent: 'flex-start' }}
        // 更新表单的值
        onChange={(initial, current) =>
          props.updateData({ queryInfo: { ...queryInfo, ...current } })
        }
        formDatas={items(queryInfo, tableType)}
      />
    </ProDrawer>
  )
}

export default Detail

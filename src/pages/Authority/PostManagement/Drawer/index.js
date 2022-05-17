import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

export default function Index() {
  const dispatch = useDispatch()
  const form = useForm()

  const {
    local: { drawerVisible, drawerType, queryInfo },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'local/updateState',
      payload,
    })
  }

  const onClose = () => dispatch({ type: 'local/clean' })
  return (
    <ProDrawer
      width={800}
      title={
        drawerType === 'add'
          ? '添加岗位'
          : drawerType === 'edit'
          ? '编辑岗位'
          : ''
      }
      visible={drawerVisible}
      onClose={onClose}
      buttons={[
        {
          label: '保存',
          type: 'primary',
          style: { width: 80 },
          onClick: () => {
            form?.submitvalidate()
          },
        },
      ]}>
      <ProForm
        form={form}
        formType="pure"
        onSubmit={(_, current) => {
          const errorObj = {}
          // 报警事件
          if (!current?.userId) {
            errorObj.userId = '岗位名称不能为空'
          } else if (!current?.deviceName) {
            errorObj.deviceName = '岗位编码不能为空'
          } else if (!current?.deviceAddress) {
            errorObj.deviceAddress = '岗位顺序不能为空'
          } else if (!current?.status) {
            errorObj.status = '岗位状态不能为空'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            // Notify.error({ title: '提交失败！' });
            throw err
          }
          dispatch({
            type: `local/${drawerType === 'add' ? 'getAdd' : 'getEdit'}`,
            payload: {
              ...current,
              warnNum: Number(current?.warnNum),
              workTime: Number(current?.workTime),
              status: Number(current?.status),
              userId: Number(current?.userId),
              id: queryInfo?.id || null,
            },
          })
        }}
        // 更新表单的值
        onChange={(_, current) => {
          return updateData({ queryInfo: { ...queryInfo, ...current } })
        }}
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo)}
      />
    </ProDrawer>
  )
}

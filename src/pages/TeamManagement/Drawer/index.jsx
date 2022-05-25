import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

const Detail = () => {
  const form = useForm()
  const dispatch = useDispatch()

  const {
    team: { drawerVisible, queryInfo, tableType },
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
      width={800}
      title={
        tableType === 'add'
          ? '添加团队'
          : tableType === 'edit'
          ? '编辑团队'
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
        formType="pure"
        form={form}
        buttonsContainer={{ justifyContent: 'flex-start' }}
        onSubmit={(_, current) => {
          const errorObj = {}
          // 报警事件
          if (!current?.postName) {
            errorObj.postName = '岗位名称不能为空'
          } else if (!current?.postCode) {
            errorObj.postCode = '岗位顺序不能为空'
          } else if (!current?.postSort) {
            errorObj.postSort = '岗位顺序不能为空'
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
            type: `team/${tableType === 'add' ? 'addTeam' : 'editTeam'}`,
            payload: {
              ...current,
            },
          })
        }}
        // 更新表单的值
        onChange={(_, current) => {
          return updateData({ queryInfo: { ...queryInfo, ...current } })
        }}
        formDatas={items(queryInfo)}
      />
    </ProDrawer>
  )
}

export default Detail

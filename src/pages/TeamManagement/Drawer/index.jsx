import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

const Detail = () => {
  const form = useForm()
  const dispatch = useDispatch()

  const {
    team: { drawerVisible, queryInfo, drawerType },
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
        drawerType === 'add'
          ? '添加团队'
          : drawerType === 'edit'
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
          if (!current?.teamName) {
            errorObj.teamName = '团队名不能为空'
          } else if (!current?.teamUserList) {
            errorObj.teamUserList = '团队用户列表不能为空'
          } else if (!current?.teamUserNameSplice) {
            errorObj.teamUserNameSplice = '团队描述不能为空'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            // Notify.error({ title: '提交失败！' });
            throw err
          }
          dispatch({
            type: `team/${drawerType === 'add' ? 'addTeam' : 'editTeam'}`,
            payload: {
              ...current,
            },
          })
        }}
        // 更新表单的值
        onChange={(_, current) => {
          return updateData({ queryInfo: { ...queryInfo, ...current } })
        }}
        formDatas={items(queryInfo, drawerType)}
      />
    </ProDrawer>
  )
}

export default Detail

import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

export default function Index() {
  const dispatch = useDispatch()
  const form = useForm()

  const {
    postManagement: { drawerVisible, drawerType, queryInfo, saveState },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'postManagement/updateState',
      payload,
    })
  }

  const onClose = () => dispatch({ type: 'postManagement/clean' })
  return (
    <ProDrawer
      width={500}
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
          loading: saveState,
          onClick: () => {
            form?.submitvalidate()
          },
        },
      ]}>
      <ProForm
        form={form}
        formType="card"
        onSubmit={(_, current) => {
          const errorObj = {}
          // 报警事件
          if (!current.postName) errorObj.postName = `请输入岗位名称`
          if (!current.postCode) errorObj.postCode = `请输入岗位编码`
          if (!current.postSort) errorObj.postSort = `请输入岗位顺序`
          if (!current.status) errorObj.status = `请选择岗位状态`
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            // Notify.error({ title: '提交失败！' });
            throw err
          }
          dispatch({
            type: `postManagement/${
              drawerType === 'add' ? 'getAdd' : 'getEdit'
            }`,
            payload: {
              ...current,
              postId: queryInfo?.postId || null,
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

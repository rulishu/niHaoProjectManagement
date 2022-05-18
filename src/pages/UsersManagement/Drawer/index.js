import { ProDrawer, useForm, ProForm } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
import { items, memberItems, groupItems } from './items'
import { Notify } from 'uiw'
import formatter from '@uiw/formatter'

const Drawer = (props) => {
  const baseRef = useForm()
  const dispatch = useDispatch()

  const {
    usersManagement: { drawerVisible, isView, loading, queryInfo, tableType },
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
  // 执行成功返回的信息
  const information = (data) => {
    if (data.code === 1) {
      onClose()
      props?.onSearch()
      Notify.success({ title: data?.message || '' })
    } else {
      dispatch({
        type: 'usersManagement/updateState',
        payload: { loading: false },
      })
      Notify.error({ title: data?.message || '' })
    }
  }

  const onSubmit = (current) => {
    console.log('current', current)
    // 校验
    const errorObj = {}
    const arr = Object.keys(current)
    arr.forEach((element) => {
      if (
        !current[element] ||
        (Array.isArray(current[element]) && current[element].length === 0)
      ) {
        errorObj[element] = '此项不能为空'
      }
    })
    if (Object.keys(errorObj).length > 0) {
      const err = new Error()
      err.filed = errorObj
      throw err
    }

    // 编辑
    if (tableType === 'add') {
      const payload = {
        ...current,
        joinTime: formatter('YYYY-MM-DD HH:mm:ss', current?.joinTime),
      }
      console.log('payload', payload)
      dispatch({
        type: 'usersManagement/addProjectMember',
        payload,
      }).then((data) => information(data))
    }
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
          onClick: () => baseRef?.submitvalidate?.(),
        },
      ]}>
      <ProForm
        title={
          tableType === 'add'
            ? '新增信息'
            : tableType === 'edit'
            ? '编辑信息'
            : tableType === 'member'
            ? '邀请成员'
            : '邀请群组'
        }
        formType={isView ? 'pure' : 'card'}
        form={baseRef}
        readOnly={isView}
        buttonsContainer={{ justifyContent: 'flex-start' }}
        onSubmit={(_, current) => onSubmit(current)}
        onChange={(initial, current) =>
          dispatch({
            type: 'usersManagement/updateData',
            payload: { ...queryInfo, ...current },
          })
        }
        formDatas={
          tableType === 'add' || tableType === 'edit'
            ? items(queryInfo)
            : tableType === 'member'
            ? memberItems(queryInfo)
            : groupItems(queryInfo)
        }
      />
    </ProDrawer>
  )
}

export default Drawer

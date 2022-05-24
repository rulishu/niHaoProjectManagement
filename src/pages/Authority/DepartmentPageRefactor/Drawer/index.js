import { ProDrawer, useForm, ProForm } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
import { items } from './items'
// import { useParams } from 'react-router-dom'

const Drawer = (props) => {
  const baseRef = useForm()
  const dispatch = useDispatch()

  // const { projectId } = useParams()

  const {
    departmentRefactor: {
      drawerVisible,
      isView,
      loading,
      queryInfo,
      arrSource,
      dataSource,
    },
  } = useSelector((state) => state)

  const onClose = () => {
    dispatch({
      type: 'departmentRefactor/updateState',
      payload: {
        drawerVisible: false,
        isView: false,
      },
    })
  }

  const dataParent = dataSource.find(
    (code) => code.deptId === queryInfo?.parentId
  )
  const topDataInfo = {
    label: dataParent?.deptName,
    key: dataParent?.deptId?.toString(),
  }

  // // 执行成功返回的信息
  // const information = (data) => {
  //   if (data.code === 200) {
  //     onClose()
  //     props?.onSearch()
  //     Notify.success({ title: data?.message || '' })
  //   } else {
  //     dispatch({
  //       type: 'departmentRefactor/updateState',
  //       payload: { loading: false },
  //     })
  //     Notify.error({ title: data?.message || '' })
  //   }
  // }

  const onSubmit = (current) => {
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

    // 邀请成员
    // if (tableType === 'member') {
    //   const payload = {
    //     ...current,
    //     userId: Number(current?.userId),
    //     memberRole: Number(current?.memberRole),
    //     accessExpirationTime: formatter(
    //       'YYYY-MM-DD HH:mm:ss',
    //       current?.accessExpirationTime
    //     ),
    //     projectId: projectId,
    //   }
    //   dispatch({
    //     type: 'departmentRefactor/inviteMember',
    //     payload,
    //   }).then((data) => information(data))
    // }
    // // 编辑
    // if (tableType === 'edit') {
    //   const payload = {
    //     ...current,
    //     id: queryInfo?.id,
    //     accessExpirationTime: changeTimeFormat(current?.accessExpirationTime),
    //     // joinTime: changeTimeFormat(current?.joinTime),
    //     memberRole: Number(current?.memberRole),
    //     projectId: projectId,
    //   }
    //   dispatch({
    //     type: 'departmentRefactor/updateProjectMember',
    //     payload,
    //   }).then((data) => information(data))
    // }
  }
  return (
    <ProDrawer
      title={''}
      visible={drawerVisible}
      onClose={onClose}
      width={660}
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
        title={'基本信息'}
        formType={isView ? 'pure' : 'card'}
        form={baseRef}
        readOnly={isView}
        buttonsContainer={{ justifyContent: 'flex-start' }}
        onSubmit={(_, current) => onSubmit(current)}
        onChange={(initial, current) =>
          dispatch({
            type: 'departmentRefactor/updateData',
            payload: { ...queryInfo, ...current },
          })
        }
        formDatas={items(queryInfo, arrSource, topDataInfo)}
      />
    </ProDrawer>
  )
}

export default Drawer

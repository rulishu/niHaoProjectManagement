import { ProDrawer, useForm, ProForm } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
import { items, memberItems, groupItems } from './items'
import { Notify } from 'uiw'
import formatter from '@uiw/formatter'
import { changeTimeFormat } from '../../../utils/timeDistance'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const Drawer = (props) => {
  const baseRef = useForm()
  const dispatch = useDispatch()
  const { projectId } = useParams()

  useEffect(() => {
    dispatch({
      type: 'usersManagement/queryFuzzyAllUser',
    })
  }, [dispatch])

  const {
    usersManagement: {
      drawerVisible,
      isView,
      loading,
      queryInfo,
      tableType,
      userIdList,
    },
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
    if (data.code === 200) {
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

    // 邀请
    if (tableType === 'member') {
      const payload = {
        ...current,
        userId: Number(current?.userId),
        memberRole: Number(current?.memberRole),
        accessExpirationDate: formatter(
          'YYYY-MM-DD HH:mm:ss',
          current?.accessExpirationDate
        ),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/inviteMember',
        payload,
      }).then((data) => information(data))
    }
    // 编辑
    if (tableType === 'edit') {
      const payload = {
        ...current,
        id: queryInfo?.id,
        joinTime: changeTimeFormat(current?.joinTime),
        memberRole: Number(current?.memberRole),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/updateProjectMember',
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
          tableType === 'edit'
            ? '编辑信息'
            : tableType === 'member'
            ? '邀请成员'
            : tableType === 'group' && '邀请群组'
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
          tableType === 'edit'
            ? items(queryInfo)
            : tableType === 'member'
            ? memberItems(queryInfo, userIdList)
            : groupItems(queryInfo)
        }
      />
    </ProDrawer>
  )
}

export default Drawer

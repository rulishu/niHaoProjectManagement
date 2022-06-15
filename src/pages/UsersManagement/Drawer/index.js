import { ProDrawer, useForm, ProForm } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
import { items, memberItems, groupItems } from './items'
import { Notify } from 'uiw'
import formatter from '@uiw/formatter'
import { changeTime } from '../../../utils/timeDistance'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ThisTime } from '../../../utils/timeDistance'

const Drawer = (props) => {
  const baseRef = useForm()
  const dispatch = useDispatch()
  const { projectId } = useParams()

  useEffect(() => {
    dispatch({
      type: 'usersManagement/queryFuzzyAllUser',
    })
    dispatch({
      type: 'usersManagement/fuzzyNameQuery',
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
      teamIdList,
    },
  } = useSelector((state) => state)

  const onClose = () => {
    dispatch({
      type: 'usersManagement/updateState',
      payload: {
        drawerVisible: false,
        isView: false,
        loading: false,
      },
    })
  }
  // 执行成功返回的信息
  const information = (data) => {
    if (data?.code === 200) {
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
      if (changeTime(current?.accessExpirationTime) <= ThisTime()) {
        errorObj.accessExpirationTime = '到期访问时间需要大于当前时间'
      }
    })
    if (Object.keys(errorObj).length > 0) {
      const err = new Error()
      err.filed = errorObj
      throw err
    }

    // 邀请成员
    if (tableType === 'member') {
      let userId = current.userId.map((a) => a.value)
      const payload = {
        ...current,
        userId: Number(userId),
        memberRole: Number(current?.memberRole),
        accessExpirationTime: formatter(
          'YYYY-MM-DD',
          current?.accessExpirationTime
        ),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/inviteMember',
        payload,
      }).then((data) => information(data))
    }
    // 邀请团队
    if (tableType === 'group') {
      let teamId = current.teamId.map((a) => a.value)
      const payload = {
        ...current,
        teamId: Number(teamId),
        memberRole: Number(current?.memberRole),
        accessExpirationTime: formatter(
          'YYYY-MM-DD',
          current?.accessExpirationTime
        ),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/inviteTeam',
        payload,
      }).then((data) => information(data))
    }
    // 编辑
    if (tableType === 'edit') {
      const payload = {
        ...current,
        id: queryInfo?.id,
        accessExpirationTime: changeTime(current?.accessExpirationTime),
        memberRole: Number(current?.memberRole),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/updateProjectMember',
        payload,
      }).then((data) => information(data))
    }
    dispatch({
      type: 'usersManagement/updateState',
      payload: { loading: true },
    })
  }

  //邀请成员-模糊查询
  const [useoption, setuseOption] = useState(userIdList)
  const handlememSearch = (e) => {
    setTimeout(() => {
      const filterOpion = userIdList.filter(
        (item) => !!item.label.includes(e.trim())
      )
      setuseOption([...filterOpion])
    }, 500)
  }

  //邀请团队-模糊查询
  const [option, setOption] = useState(teamIdList)
  const handleSearch = (e) => {
    setTimeout(() => {
      const filterOpion = teamIdList.filter(
        (item) => !!item.label.includes(e.trim())
      )
      setOption([...filterOpion])
    }, 500)
  }
  return (
    <ProDrawer
      title={
        tableType === 'edit'
          ? '编辑信息'
          : tableType === 'member'
          ? '邀请成员'
          : tableType === 'group' && '邀请团队'
      }
      visible={drawerVisible}
      onClose={onClose}
      width={500}
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
          onClick: async () => {
            baseRef?.submitvalidate?.()
          },
        },
      ]}>
      <ProForm
        // title={
        //   tableType === 'edit'
        //     ? '编辑信息'
        //     : tableType === 'member'
        //       ? '邀请成员'
        //       : tableType === 'group' && '邀请团队'
        // }
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
            ? items(queryInfo, tableType)
            : tableType === 'member'
            ? memberItems(queryInfo, useoption, handlememSearch)
            : groupItems(queryInfo, option, handleSearch)
        }
      />
    </ProDrawer>
  )
}

export default Drawer

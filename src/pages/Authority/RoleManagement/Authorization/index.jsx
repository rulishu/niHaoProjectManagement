import { ProDrawer, useForm } from '@uiw-admin/components'
import { TreeChecked, Notify } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { addMenu } from '@/servers/rolemanagement'
import useSWR from 'swr'

const Detail = ({ updateData }) => {
  const dispatch = useDispatch()
  const {
    rolemanagement: {
      drawerVisibleAuth,
      queryInfo,
      isView,
      allMenuList,
      dataRoleMenu,
    },
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'rolemanagement/clean' })

  // 扁平化数组
  const flatten = (arr) => {
    return !Array.isArray(arr) ? arr : [].concat.apply([], arr.map(flatten))
  }

  // 处理当前选择
  const isJudge = (dataArr, keys) => {
    // 继续进行判断
    const CheckPresence = (arr) => {
      return arr.children.filter((item) => {
        let isCan = 1
        if (item.children?.length) isCan = CheckPresence(item)
        return isCan && keys?.includes(item?.key)
      }).length
    }

    return flatten(
      dataArr
        ?.map((item) => {
          if (
            item?.children &&
            item?.children?.length &&
            item?.children?.filter((itemA) => {
              if (itemA.children?.length) return CheckPresence(itemA)
              return keys?.includes(itemA?.key)
            })?.length
          ) {
            return [item.key, ...isJudge(item.children, keys)]
          }
          if (keys.includes(item.key)) {
            return item.key
          }
          return undefined
        })
        .filter((s) => s)
    )
  }

  const data = allMenuList.filter((item) => item.id !== 59 && item.id !== 5)
  const dataRoleMenuIds = []
  dataRoleMenu.forEach((item) => {
    dataRoleMenuIds.push(item.menuId)
  })

  const { mutate } = useSWR(
    [
      addMenu,
      {
        method: 'POST',
        body: {
          roleId: queryInfo?.id,
          menuIds: queryInfo?.menuIds || dataRoleMenuIds,
        },
      },
    ],
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && data.code === 200) {
          Notify.success({
            title: data.message,
            description: '请刷新权限或重新登录',
          })
          onClose()
        }
      },
    }
  )

  //修改树结构
  function toTree(data) {
    const haveChildren =
      Array.isArray(data.managerMenus) && data.managerMenus.length > 0
    if (haveChildren) {
      return {
        label: data.menuName,
        key: data.id,
        children: data.managerMenus.map((i) => toTree(i)),
      }
    } else {
      return {
        label: data.menuName,
        key: data.id,
      }
    }
  }

  return (
    <ProDrawer
      width={500}
      title="授权"
      visible={drawerVisibleAuth}
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
      <TreeChecked
        data={data.map((item) => toTree(item))}
        selectedKeys={dataRoleMenu.map((item) => item.menuId)}
        onSelected={(key) => {
          updateData({
            queryInfo: {
              ...queryInfo,
              menuIds: isJudge(
                allMenuList.map((item) => toTree(item)),
                key
              ),
            },
          })
        }}
      />
    </ProDrawer>
  )
}

export default Detail

import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

const Detail = ({ updateData, handleTree, onSearch }) => {
  const dispatch = useDispatch()
  const {
    menumanagement: {
      drawerVisible,
      tableType,
      queryInfo,
      isView,
      dataSourceList,
    },
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'menumanagement/clean' })

  // 下拉
  const handleSearch = (type = '', value = '') => {
    if (type === 'searchTree') {
      console.log('value', value.key)
      updateData({
        queryInfo: {
          ...queryInfo,
          parentId: value.key,
        },
      })
    }
  }
  //修改树结构
  function toTree(data) {
    const haveChildren =
      Array.isArray(data.children) && data.children.length > 0
    if (haveChildren) {
      return {
        label: data.menuName,
        key: data.menuId,
        children: data.children.map((i) => toTree(i)),
      }
    } else {
      return {
        label: data.menuName,
        key: data.menuId,
      }
    }
  }
  const datsSource = (handleTree(dataSourceList || [], 'menuId') || []).map(
    (item) => toTree(item)
  )
  const dataParent = dataSourceList.find(
    (code) => code.menuId === queryInfo?.parentId
  )
  const topDataMenu = {
    label: dataParent?.menuName,
    key: queryInfo.parentId,
  }

  return (
    <ProDrawer
      width={500}
      title={
        tableType === 'add' ? '新增' : tableType === 'edit' ? '编辑' : '查看'
      }
      visible={drawerVisible}
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
            dispatch({
              type: `menumanagement/${
                tableType === 'edit' ? 'getEdit' : 'getAdd'
              }`,
              payload: {
                ...queryInfo,
              },
            })
          },
        },
      ]}>
      <ProForm
        form={form}
        title="基础信息"
        formType={isView ? 'pure' : 'card'}
        readOnly={isView}
        onChange={(initial, current) =>
          updateData({
            queryInfo: {
              ...queryInfo,
              ...current,
              parentId: current?.parentId?.[0]?.key || queryInfo.parentId,
              // parentId: tableType === 'addChild' ? queryInfo.parentId : null,
            },
          })
        }
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo, datsSource, handleSearch, topDataMenu)}
      />
    </ProDrawer>
  )
}

export default Detail

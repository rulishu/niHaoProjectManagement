import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

const Detail = ({ updateData, handleTree, onSearch, dataSourceList }) => {
  const dispatch = useDispatch()
  const {
    menumanagement: { drawerVisible, tableType, queryInfo, isView, saveState },
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'menumanagement/clean' })
  // 下拉
  const handleSearch = (type = '', value = '') => {
    if (type === 'searchTree') {
      // console.log('value', value.key)
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
  /** 菜单下拉树结构 */
  const datsSource = [
    {
      key: '0',
      label: '主类目',
      children: (handleTree(dataSourceList || [], 'menuId') || []).map((item) =>
        toTree(item)
      ),
    },
  ]
  /** 转换菜单数据结构 */
  const dataParent = dataSourceList.find(
    (code) => code.menuId === queryInfo?.parentId
  )
  const topDataMenu = {
    key: queryInfo.parentId || '0',
    label: dataParent?.menuName || '主类目',
  }
  return (
    <ProDrawer
      width={500}
      title={
        tableType === 'add' || tableType === 'addChild'
          ? '新增'
          : tableType === 'edit'
          ? '编辑'
          : '查看'
      }
      visible={drawerVisible}
      onClose={onClose}
      buttons={[
        // {
        //   label: '取消',
        //   onClick: onClose,
        //   show: !isView,
        //   loading: saveState
        // },
        {
          label: '保存',
          type: 'primary',
          style: { width: 80 },
          show: !isView,
          loading: saveState,
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
        // title="基础信息"
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

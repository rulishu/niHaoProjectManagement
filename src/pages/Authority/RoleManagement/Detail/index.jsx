import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { TreeChecked } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'
import { useEffect } from 'react'

const Detail = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    rolemanagement: {
      drawerVisible,
      tableType,
      queryInfo,
      isView,
      menuOptions,
      checkedKeys,
      saveState,
    },
  } = useSelector((state) => state)
  const form = useForm()
  const onClose = () => dispatch({ type: 'rolemanagement/clean' })

  useEffect(() => {
    if (tableType === 'edit')
      form &&
        form.setFields &&
        form.setFields({ ...queryInfo, menuIds: checkedKeys })
  }, [form, queryInfo, tableType, checkedKeys])

  //修改树结构
  function toTree(data) {
    const haveChildren =
      Array.isArray(data.children) && data.children.length > 0
    if (haveChildren) {
      return {
        label: data.label,
        key: data.id,
        children: data.children.map((i) => toTree(i)),
      }
    } else {
      return {
        label: data.label,
        key: data.id,
      }
    }
  }
  const TreeData = ({ value, onChange }) => {
    return (
      <TreeChecked
        data={menuOptions.map((item) => toTree(item))}
        selectedKeys={value || checkedKeys}
        // onExpand={(key, expanded, data, node) => {
        //   console.log(key, expanded, data, node)
        // }}
        onSelected={(key) => {
          onChange(key)
          const value = form.getFieldValues?.()
          form.setFields({ ...value, menuIds: key })
        }}
      />
    )
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
            const value = form.getFieldValues?.()
            dispatch({
              type: `rolemanagement/${
                tableType === 'add' ? 'getAdd' : 'getEdit'
              }`,
              payload: {
                ...value,
                menuIds: value.menuIds || [],
                roleId: queryInfo?.roleId || null,
              },
            })
          },
        },
      ]}>
      <ProForm
        form={form}
        // title="基础信息"
        // 自定义组件
        customWidgetsList={{
          TreeData: TreeData,
        }}
        formType={isView ? 'pure' : 'card'}
        readOnly={isView}
        // onChange={(initial, current) =>
        //   updateData({ queryInfo: { ...queryInfo, ...current } })
        // }
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo, TreeData)}
        readOnlyProps={{ column: 1 }}
      />
    </ProDrawer>
  )
}

export default Detail

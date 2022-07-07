import { ProForm } from '@uiw-admin/components'
export const TheForm = (props) => {
  const { onSubmit, menuItemData, fromType } = props
  // fromType 1 新增 2 编辑
  return (
    <ProForm
      title={fromType === 1 ? '新增' : fromType === 2 ? '编辑' : ''}
      showSaveButton
      showResetButton
      formType="card"
      saveButtonProps={{ type: 'primary' }}
      onSubmit={(_, current) => onSubmit(current)}
      formDatas={[
        {
          label: '菜单名称',
          key: 'menuName',
          widget: 'input',
          initialValue: fromType !== 1 ? menuItemData?.menuName : null,
          widgetProps: {},
          required: true,
          placeholder: '请输入菜单名称',
          rules: [{ required: true, message: '请输入菜单名称' }],
          help: '必填，请填写菜单名称（如：权限管理）',
          span: '24',
        },
        {
          label: '菜单图标',
          key: 'icon',
          widget: 'input',
          initialValue: fromType !== 1 ? menuItemData?.icon : null,
          widgetProps: {},
          disabled:
            menuItemData?.menuType === 2 || menuItemData?.menuType === 3,
          placeholder:
            menuItemData?.menuType === 2
              ? '菜单暂不支持选择uiw图标'
              : menuItemData?.menuType === 3
              ? '按钮暂不支持选择uiw图标'
              : '请输入uiw图标',
          help: '可选，设置菜单选项前置图标（如：home）',
          span: '24',
        },
        {
          label: '路由地址',
          key: 'path',
          widget: 'input',
          initialValue: fromType !== 1 ? menuItemData?.path : null,
          widgetProps: {},
          required: true,
          placeholder: '请输入路由地址',
          rules: [{ required: true, message: '请输入路由地址' }],
          help: '必填，请填写路由地址（如：/Authority/MenuManagement，对应的文件位于：pages/Authority/MenuManagement/）',
          span: '24',
        },
        {
          label: '菜单类型',
          key: 'menuType',
          widget: 'select',
          initialValue: fromType !== 1 ? menuItemData?.menuType : null,
          required: true,
          rules: [{ required: true, message: '请选择用例类型' }],
          help: '必填，选中为按钮，将不会显示在导航菜单上。用于菜单选中项渲染判断',
          widgetProps: {},
          span: '24',
          option: [
            { value: 1, label: '目录' },
            { value: 2, label: '菜单' },
            { value: 3, label: '按钮' },
          ],
        },
        {
          label: '排序',
          key: 'orderNum',
          widget: 'input',
          initialValue: fromType !== 1 ? menuItemData?.orderNum || '0' : '0',
          required: true,
          rules: [{ required: true, message: '请输入数字' }],
          help: '必填，整数。数字越小越靠前，最小值为0。',
          widgetProps: {},
          span: '24',
        },
        {
          label: '备注',
          key: 'remark',
          widget: 'textarea',
          style: { maxWidth: '420px' },
          initialValue: fromType !== 1 ? menuItemData?.remark : null,
          span: '24',
        },
      ]}
    />
  )
}

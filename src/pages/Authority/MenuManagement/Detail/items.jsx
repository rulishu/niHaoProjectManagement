export const items = (queryInfo, datsSource, handleSearch, topDataMenu) => [
  {
    label: '上级菜单',
    key: 'parentId',
    widget: 'searchTree',
    span: '24',
    readSpan: 3,
    widgetProps: {
      allowClear: true,
      treeProps: { style: { height: 250, overflowX: 'auto' } },
      // onSearch: (searchValue) => console.log('SearchTreeOption', searchValue),
      onChange: handleSearch.bind(this, 'searchTree'),
      // (selectedAll, selectd, isChecked)=>{
      //   console.log('onChange',selectedAll, selectd, isChecked)
      // }
    },
    initialValue: [topDataMenu],
    multiple: false,
    option: datsSource,
  },
  {
    label: '菜单类型',
    key: 'menuType',
    widget: 'select',
    initialValue: queryInfo?.menuType,
    required: true,
    rules: [{ required: true, message: '请选择用例类型' }],
    help: '必填，选中为按钮，将不会显示在导航菜单上。用于菜单选中项渲染判断',
    widgetProps: {},
    span: '24',
    option: [
      { value: 'M', label: '目录' },
      { value: 'C', label: '菜单' },
      { value: 'F', label: '按钮' },
    ],
  },
  {
    label: '菜单名称',
    key: 'menuName',
    widget: 'input',
    initialValue: queryInfo?.menuName,
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
    initialValue: queryInfo?.icon,
    widgetProps: {},
    placeholder: '请输入uiw图标',
    help: '可选，设置菜单选项前置图标（如：home）',
    span: '24',
  },
  {
    label: '路由地址',
    key: 'path',
    widget: 'input',
    initialValue: queryInfo?.path,
    widgetProps: {},
    required: true,
    placeholder: '请输入路由地址',
    rules: [{ required: true, message: '请输入路由地址' }],
    help: '必填，请填写路由地址（如：/Authority/MenuManagement，对应的文件位于：pages/Authority/MenuManagement/）',
    span: '24',
  },

  {
    label: '排序',
    key: 'orderNum',
    widget: 'input',
    initialValue: queryInfo?.orderNum || '0',
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
    initialValue: queryInfo?.remark,
    span: '24',
  },
]

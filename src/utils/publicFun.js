export function searchFun(table) {
  const data = [
    {
      label: '查询',
      type: 'primary',
      htmlType: 'submit',
      onClick: () => table.onSearch(),
      icon: 'search',
    },
    {
      label: '重置',
      onClick: () => table?.onReset(),
      icon: 'reload',
    },
  ]
  return data
}

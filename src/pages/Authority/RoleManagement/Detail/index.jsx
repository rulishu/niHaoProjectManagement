import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { TreeChecked } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { items } from './items'

const Detail = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    rolemanagement: { drawerVisible, tableType, queryInfo, isView },
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'rolemanagement/clean' })

  const data = [
    {
      label: '湖北省',
      key: '0-0-0',
      children: [
        {
          label: '武汉市',
          key: '0-1-0',
          children: [
            { label: '新洲区', key: '0-1-1', disabled: true },
            { label: '武昌区', key: '0-1-2' },
            {
              label: '汉南区',
              key: '0-1-3',
              children: [
                { label: '汉南区1', key: '0-1-3-1' },
                { label: '汉南区2', key: '0-1-3-2' },
                { label: '汉南区3', key: '0-1-3-3' },
              ],
            },
          ],
        },
        { label: '黄冈市', key: '0-2-0' },
        {
          label: '黄石市',
          key: '0-3-0',
          children: [
            { label: '青山区', key: '0-3-1' },
            { label: '黄陂区', key: '0-3-2' },
            { label: '青山区', key: '0-3-3' },
          ],
        },
      ],
    },
    { label: '澳门', key: '3' },
  ]

  function Demo({ value, onChange }) {
    return <TreeChecked data={data} selectedKeys={['0-2-0']} />
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
              type: `rolemanagement/${
                tableType === 'add' ? 'getAdd' : 'getEdit'
              }`,
              payload: {
                ...queryInfo,
                menuIds: [],
                roleId: queryInfo?.roleId || null,
              },
            })
          },
        },
      ]}>
      <ProForm
        form={form}
        title="基础信息"
        // 自定义组件
        customWidgetsList={{
          Demo: Demo,
        }}
        formType={isView ? 'pure' : 'card'}
        readOnly={isView}
        onChange={(initial, current) =>
          updateData({ queryInfo: { ...queryInfo, ...current } })
        }
        buttonsContainer={{ justifyContent: 'flex-start' }}
        formDatas={items(queryInfo, Demo)}
        readOnlyProps={{ column: 1 }}
      />
    </ProDrawer>
  )
}

export default Detail

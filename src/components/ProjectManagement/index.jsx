import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm } from '@uiw-admin/components'
// import { Notify } from 'uiw'
// import useSWR from 'swr'

const ProjectManagement = () => {
  const dispatch = useDispatch()
  const {
    global: { drawerVisible, drawerType },
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'global/updateState',
      payload,
    })
  }

  const onClose = () => {
    updateData({
      drawerVisible: false,
      seachValue: {},
    })
  }

  // const { mutate } = useSWR(
  //     [
  //         (drawerType === 'edit' && '/api/project/update') || (drawerType === 'add' && '/api/project/add'),
  //         { method: 'POST', body: seachValue },
  //     ],
  //     {
  //         revalidateOnMount: false,
  //         revalidateOnFocus: false,
  //         onSuccess: (data) => {
  //             if (data && data.code === 200) {
  //                 Notify.success({ title: data.message })
  //                 onClose()
  //             } else {
  //                 Notify.error({ title: data.message })
  //             }
  //         },
  //     }
  // )

  return (
    <div>
      <ProDrawer
        visible={drawerVisible}
        width={500}
        onClose={onClose}
        title={drawerType === 'edit' ? '编辑' : '新增'}
        buttons={[
          {
            label: '取消',
            onClick: onClose,
          },
          {
            label: '保存',
            type: 'primary',
            // onClick: mutate()
          },
        ]}>
        <ProForm
          formType="pure"
          formDatas={[
            {
              label: '项目名称:',
              key: 'name',
              widget: 'input',
              initialValue: '',
              widgetProps: {},
              span: '24',
            },
            {
              label: '项目负责人:',
              key: 'projectLeaderName',
              widget: 'select',
              option: [
                { value: 1, label: '苹果' },
                { value: 2, label: '西瓜' },
                { value: 3, label: '香蕉' },
                { value: 4, label: '东北大冻梨' },
              ],
              initialValue: '',
              widgetProps: {},
              span: '24',
            },
            {
              label: '起止日期:',
              key: 'begin',
              initialValue: '',
              widget: 'dateInput',
              widgetProps: {
                format: 'YYYY-MM-DD HH:mm:ss',
              },
              span: '24',
            },
            {
              label: '截止日期:',
              key: 'end',
              initialValue: '',
              widget: 'dateInput',
              widgetProps: {
                format: 'YYYY-MM-DD HH:mm:ss',
              },
              span: '24',
            },
            {
              label: '项目描述:',
              key: 'descr',
              widget: 'textarea',
              initialValue: '',
              widgetProps: {},
              span: '24',
            },
          ]}
          onChange={(initial, current) => {
            updateData({ seachValue: { ...current } })
          }}
        />
      </ProDrawer>
    </div>
  )
}
export default ProjectManagement

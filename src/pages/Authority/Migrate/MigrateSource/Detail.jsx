import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'uiw'
const Detail = (props) => {
  const {
    migrate: {
      source: { dataInfo },
    },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { isVisible, setIsVisible } = props
  const form = useForm()

  console.log('dataInfo=====>', dataInfo)

  return (
    <ProDrawer
      width={500}
      title={'新增'}
      visible={isVisible}
      onClose={() => setIsVisible(false)}
      buttons={[
        {
          label: '保存',
          type: 'primary',
          show: true,
          onClick: async () => {
            await form?.submitvalidate?.()
            const errors = form.getError()
            if (errors && Object.keys(errors).length > 0) return
            const fieldValues = form.getFieldValues()
            await dispatch({
              type: 'migrate/addDataSource',
              payload: fieldValues,
            })
          },
        },
      ]}>
      <Loader
        loading={loading.effects.migrate.getDataByIdSource}
        style={{ width: '100%' }}
        tip="loading...">
        <div>
          <ProForm
            formType="card"
            form={form}
            formDatas={[
              {
                label: '名称',
                key: 'name',
                required: true,
                widget: 'input',
                initialValue: dataInfo.name,
                widgetProps: {},
                span: '24',
              },
              {
                label: 'token',
                key: 'token',
                required: true,
                widget: 'input',
                initialValue: '',
                widgetProps: {},
                span: '24',
              },
              {
                label: '备注',
                key: 'remark',
                widget: 'input',
                initialValue: dataInfo.remark,
                widgetProps: {},
                span: '24',
              },
              {
                label: '迁移类型',
                key: 'type',
                required: true,
                widget: 'select',
                initialValue: dataInfo.type,
                widgetProps: {},
                span: '24',
                option: [
                  { value: 10, label: 'GitLab' },
                  { value: 20, label: 'GitHub' },
                  { value: 30, label: '禅道' },
                ],
              },
              {
                label: '迁移路径',
                key: 'url',
                required: true,
                widget: 'input',
                initialValue: dataInfo.url,
                widgetProps: {},
                span: '24',
              },
            ]}
          />
        </div>
      </Loader>
    </ProDrawer>
  )
}

export default Detail

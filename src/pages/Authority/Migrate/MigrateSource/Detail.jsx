import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'uiw'
import { formItem } from './item'
const Detail = (props) => {
  const {
    migrate: {
      source: { dataInfo, type },
    },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { isVisible, setIsVisible, curData } = props
  const form = useForm()

  const proForm = (initialValue) => {
    return (
      <ProForm
        formType="card"
        form={form}
        readOnlyProps={{ column: 1, layout: 'vertical' }}
        formDatas={formItem(initialValue, type)}
      />
    )
  }

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
          {Object.keys(dataInfo).length !== 1 &&
            (curData === dataInfo.id || type === 1) &&
            proForm(dataInfo)}
          {type === 1 && proForm({})}
        </div>
      </Loader>
    </ProDrawer>
  )
}

export default Detail

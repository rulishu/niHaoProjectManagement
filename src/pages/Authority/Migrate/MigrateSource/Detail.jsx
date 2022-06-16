import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'uiw'
import { formItem } from './item'
const Detail = (props) => {
  const {
    migrate: {
      source: { dataInfo, type },
      sourceState,
    },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { isVisible, setIsVisible, curData, table } = props
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
      title={type === 1 ? '新增' : type === 2 ? '编辑' : '查看'}
      visible={isVisible}
      onClose={() => setIsVisible(false)}
      buttons={
        type !== 3
          ? [
              {
                label: '保存',
                type: 'primary',
                style: { width: 80 },
                show: true,
                loading: sourceState,
                onClick: async () => {
                  await form?.submitvalidate?.()
                  const errors = form.getError()
                  if (errors && Object.keys(errors).length > 0) return
                  const fieldValues = form.getFieldValues()
                  const disType =
                    type === 1
                      ? 'migrate/addDataSource'
                      : type === 2
                      ? 'migrate/updateDataByIdSource'
                      : false
                  const param =
                    type === 2
                      ? { ...fieldValues, id: dataInfo?.id }
                      : fieldValues
                  disType &&
                    (await dispatch({
                      type: disType,
                      payload: {
                        param,
                        callback: () => {
                          setIsVisible(false)
                          table?.onRefersh()
                        },
                      },
                    }))
                },
              },
            ]
          : []
      }>
      <Loader
        loading={loading.effects.migrate.getDataByIdSource}
        style={{ width: '100%' }}
        tip="loading...">
        <div>
          {Object.keys(dataInfo).length !== 1 &&
            curData === dataInfo.id &&
            proForm(dataInfo)}
          {type === 1 && proForm({})}
        </div>
      </Loader>
    </ProDrawer>
  )
}

export default Detail

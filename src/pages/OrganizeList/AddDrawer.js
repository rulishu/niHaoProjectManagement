import { Notify } from 'uiw'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { isChina } from '@/utils/utils'

export default function DelectModals(props) {
  const {
    organizeList: { addVisible },
  } = useSelector((state) => state)
  const form = useForm()

  const dispatch = useDispatch()

  const onClose = () => {
    dispatch({
      type: 'organizeList/updateState',
      payload: {
        addVisible: false,
      },
    })
  }

  return (
    <ProDrawer
      width={500}
      title="新增组织"
      visible={addVisible}
      onClose={() => onClose()}
      buttons={[
        {
          label: '保存',
          type: 'primary',
          style: { width: 80 },
          onClick: () => {
            form?.submitvalidate()
          },
        },
      ]}>
      <ProForm
        form={form}
        // 提交后验证
        onSubmit={(initial, current) => {
          const errorObj = {}
          if (!current?.organizationName) {
            errorObj.organizationName = '组织名称不能为空'
          }
          if (!current?.urlCode) {
            errorObj.urlCode = '路由不能为空'
          }
          if (isChina(current?.urlCode) !== true) {
            errorObj.urlCode = '不能包含中文和空格'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }
          dispatch({
            type: 'organizeList/getAdd',
            payload: {
              ...current,
              parentId: 0,
            },
          })
        }}
        formDatas={[
          {
            label: '组织名称',
            key: 'organizationName',
            widget: 'input',
            placeholder: '请输入组织名称',
            // initialValue: queryInfo?.organizationName,
            span: '24',
            required: true,
          },
          {
            label: '路由',
            key: 'urlCode',
            placeholder: '请输入路由',
            widget: 'input',
            required: true,
            // initialValue: queryInfo?.urlCode,
            span: '24',
            widgetProps: {
              onChange: (e) => {
                if (isChina(e.target.value) === true) {
                  dispatch({
                    type: 'organizeList/checkUrlUniqueness',
                    payload: { urlCode: e.target.value },
                  })
                } else {
                  Notify.error({ title: isChina(e.target.value) })
                }
              },
            },
          },
          {
            label: '文本描述',
            key: 'textDescribe',
            placeholder: '请输入文本描述',
            widget: 'textarea',
            // initialValue: queryInfo?.textDescribe,
            span: '24',
          },
        ]}
      />
    </ProDrawer>
  )
}

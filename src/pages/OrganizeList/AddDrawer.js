import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { isChina } from '@/utils/utils'
import debounce from '@/utils/debounce'
import RouteInput from './RouteInput'

export default function DelectModals(props) {
  const {
    organizeList: { addVisible, search },
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
        customWidgetsList={{ inputs: RouteInput }}
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
              search,
            },
          })
        }}
        onChange={(initial, current) => {
          if (isChina(current.urlCode) === true && current.urlCode !== '') {
            debounce(dispatch, 500, {
              type: 'organizeList/checkUrlUniqueness',
              payload: { urlCode: current.urlCode },
            })
          } else {
            const errorObj = {}
            if (isChina(current?.urlCode) !== true) {
              errorObj.urlCode = '不能包含中文和空格'
            }
          }
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
            widget: 'inputs',
            required: true,
            // initialValue: queryInfo?.urlCode,
            span: '24',
            widgetProps: {
              onChange: (e) => {
                if (isChina(e.target.value) === true) {
                  debounce(dispatch, 200, {
                    type: 'organizeList/checkUrlUniqueness',
                    payload: { urlCode: e.target.value },
                  })
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

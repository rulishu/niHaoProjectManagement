import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { itemsDetail } from './items'
// import { addByDict, editByDict } from '@/servers/dictionary'
import DetailTable from './DetailTable'
// import useSWR from 'swr'
// const token = localStorage.getItem('token')
const Detail = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    dictionary: { drawerVisible, tableType, queryInfo, isView, saveState },
    loading,
  } = useSelector((state) => state)

  const form = useForm()
  const onClose = () => dispatch({ type: 'dictionary/clean' })

  // const { mutate } = useSWR(
  //   [
  //     (tableType === 'add' && addByDict) ||
  //       (tableType === 'edit' && editByDict),
  //     {
  //       method: 'POST',
  //       headers: { Authorization: 'Bearer ' + token },
  //       body: { ...queryInfo },
  //     },
  //   ],
  //   {
  //     revalidateOnMount: false,
  //     revalidateOnFocus: false,
  //     onSuccess: (data) => {
  //       if (data && data.code === 200) {
  //         Notify.success({ title: data?.message })
  //         onClose()
  //         onSearch?.()
  //       }
  //     },
  //   }
  // )

  return (
    <Loader
      tip="加载中..."
      vertical
      style={{ width: '100%' }}
      loading={loading.models.milestone}>
      <ProDrawer
        width={tableType === 'detail' ? 1000 : 500}
        title={
          tableType === 'add'
            ? '新增'
            : tableType === 'edit'
            ? '编辑'
            : '字典项'
        }
        visible={drawerVisible}
        onClose={onClose}
        buttons={
          tableType === 'detail'
            ? [
                {
                  label: '取消',
                  onClick: onClose,
                  show: !isView,
                  style: { width: 80 },
                },
              ]
            : [
                // {
                //   label: '取消',
                //   onClick: onClose,
                //   show: !isView,
                // },
                {
                  label: '保存',
                  type: 'primary',
                  show: !isView,
                  style: { width: 80 },
                  loading: saveState,
                  onClick: async () => {
                    await form?.submitvalidate?.()
                    const errors = form.getError()
                    if (errors && Object.keys(errors).length > 0) return
                    dispatch({
                      type: `dictionary/${
                        tableType === 'add' ? 'addByDict' : 'editByDict'
                      }`,
                      payload: {
                        ...queryInfo,
                      },
                    })
                  },
                },
              ]
        }>
        {tableType === 'detail' ? (
          <DetailTable />
        ) : (
          <ProForm
            form={form}
            // 更新表单的值
            onChange={(initial, current) =>
              updateData({
                queryInfo: {
                  ...queryInfo,
                  ...current,
                  dictSort: 1,
                  deleteMark:
                    current?.deleteMark && Number(current?.deleteMark),
                },
              })
            }
            buttonsContainer={{ justifyContent: 'flex-start' }}
            formDatas={itemsDetail(queryInfo, tableType)}
          />
        )}
      </ProDrawer>
    </Loader>
  )
}

export default Detail

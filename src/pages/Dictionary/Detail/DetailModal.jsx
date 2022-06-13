import { Button, Modal } from 'uiw'
import { ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
// import { addByDictData, editByDictData } from '@/servers/dictionary'
// import useSWR from 'swr'
import styles from './index.module.less'
import Block from '@uiw/react-color-block'
import dayjs from 'dayjs'

function Demo({ value, onChange }) {
  return <Block color={value?.hex || value} onChange={(e) => onChange(e)} />
}
// const token = localStorage.getItem('token')
const DetailModal = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    dictionary: {
      modalVisible,
      detailInfo,
      queryInfo,
      modalType,
      modalSaveState,
    },
  } = useSelector((state) => state)

  const form = useForm()

  const onClose = () =>
    dispatch({
      type: 'dictionary/update',
      payload: { modalVisible: false },
    })

  // const { mutate } = useSWR(
  //   [
  //     (modalType === 'add' && addByDictData) ||
  //       (modalType === 'edit' && editByDictData),
  //     {
  //       method: 'POST',
  //       headers: { Authorization: 'Bearer ' + token },
  //       body:
  //         modalType === 'add'
  //           ? { ...detailInfo, dictCode: dayjs().unix() }
  //           : detailInfo,
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
    <Modal
      title={
        modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'
      }
      isOpen={modalVisible}
      type="primary"
      useButton={false}
      onClosed={onClose}>
      <ProForm
        form={form}
        formType="card"
        buttonsContainer={{ justifyContent: 'flex-start' }}
        // 更新表单的值
        onChange={(initial, current) => {
          const { listClass, ...newCurrent } = current
          updateData({
            detailInfo: {
              ...detailInfo,
              ...newCurrent,
              // dictSort: 2,
              // dictTypeCode: queryInfo.dictTypeCode,
              // dictTypeName: queryInfo.dictTypeName,
              listClass: listClass?.hex,
            },
          })
        }}
        customWidgetsList={{ color: Demo }}
        formDatas={[
          {
            label: '字典类型',
            key: 'dictType',
            placeholder: '请输入字典类型',
            align: 'center',
            widget: 'input',
            initialValue: queryInfo.dictType,
            widgetProps: {
              disabled: true,
            },
            span: '24',
          },
          {
            label: '字典名称',
            key: 'dictLabel',
            widget: 'input',
            placeholder: '请输入字典名称',
            initialValue: detailInfo.dictLabel,
            required: true,
            rules: [{ required: true, message: '请输入字典名称' }],
            // rules: [
            //   {
            //     required: true,
            //     validator: (value = '') => {
            //       if (value.length < 2 || value.length > 50) return false
            //       return true
            //     },
            //     message: '请输入字典编码,长度为2-50',
            //   },
            // ],
            widgetProps: {
              // disabled: modalType !== 'add',
            },
            span: '24',
          },
          {
            label: '字典键值',
            key: 'dictValue',
            widget: 'input',
            placeholder: '请输入字典键值',
            initialValue: detailInfo.dictValue,
            required: true,
            rules: [{ required: true, message: '请输入字典键值' }],
            // rules: [
            //   {
            //     required: true,
            //     validator: (value = '') => {
            //       if (value.length < 2 || value.length > 50) return false
            //       return true
            //     },
            //     message: '请输入字典名称,长度为2-50',
            //   },
            // ],
            widgetProps: {},
            span: '24',
          },
          {
            label: '样式属性',
            key: 'cssClass',
            widget: 'input',
            placeholder: '请输入样式属性',
            initialValue: detailInfo.cssClass,
            widgetProps: {},
            span: '24',
          },
          {
            label: '显示排序',
            key: 'dictSort',
            placeholder: '请输入排序',
            widget: 'input',
            initialValue: detailInfo.dictSort,
            required: true,
            rules: [{ required: true, message: '请输入显示排序' }],
            // rules: [
            //   {
            //     required: true,
            //     validator: (value = '') => {
            //       if (value.length < 2 || value.length > 50) return false
            //       return true
            //     },
            //     message: '请输入字典名称,长度为2-50',
            //   },
            // ],
            widgetProps: {},
            span: '24',
          },
          {
            label: '回显样式',
            key: 'listClass',
            widget: 'color',
            // option: [
            //   {
            //     value: 'default',
            //     label: '默认',
            //   },
            //   {
            //     value: 'primary',
            //     label: '主要',
            //   },
            //   {
            //     value: 'success',
            //     label: '成功',
            //   },
            //   {
            //     value: 'info',
            //     label: '信息',
            //   },
            //   {
            //     value: 'warning',
            //     label: '警告',
            //   },
            //   {
            //     value: 'danger',
            //     label: '危险',
            //   },
            // ],
            initialValue: detailInfo?.listClass,
            span: '24',
          },
          {
            label: '状态',
            key: 'status',
            widget: 'select',
            option: [
              { label: '正常', value: '0' },
              { label: '停用', value: '1' },
            ],
            initialValue: detailInfo?.status,
            span: '24',
            required: true,
            rules: [
              {
                required: true,
                message: '请选择状态',
              },
            ],
          },
          {
            label: '备注',
            key: 'remark',
            widget: 'textarea',
            placeholder: '请输入备注',
            style: { maxWidth: '430px' },
            initialValue: detailInfo?.remark,
            span: '24',
          },
          // {
          //   label: '字典标签背景颜色',
          //   key: 'dictColour',
          //   widget: 'color',
          //   initialValue: detailInfo.dictColour,
          //   required: true,
          //   rules: [{ required: true, message: '请输入字典标签背景颜色' }],
          //   widgetProps: {},
          //   span: '24',
          // },
        ]}
      />
      <div className={styles.btnFoot}>
        {/* <Button onClick={onClose} className={styles.btn} type="light" loading={modalSaveState}>
          取消
        </Button> */}
        <Button
          className={styles.btn}
          type="primary"
          loading={modalSaveState}
          onClick={async () => {
            // 触发验证
            await form.submitvalidate()
            // 获取错误信息
            const errors = form.getError()
            if (errors && Object.keys(errors).length > 0) return
            // 调用请求接口
            dispatch({
              type: `dictionary/${
                modalType === 'add' ? 'addByDictData' : 'editByDictData'
              }`,
              payload:
                modalType === 'add'
                  ? { ...detailInfo, dictCode: dayjs().unix() }
                  : detailInfo,
            })
          }}>
          保存
        </Button>
      </div>
    </Modal>
  )
}

export default DetailModal

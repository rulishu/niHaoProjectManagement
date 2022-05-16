import { Button, Modal, Notify } from 'uiw'
import { ProForm, useForm } from '@uiw-admin/components'
import { useSelector, useDispatch } from 'react-redux'
import { addByDict, editByDict } from '@/servers/dictionary'
import useSWR from 'swr'
import styles from './index.module.less'
import Block from '@uiw/react-color-block'

function Demo({ value, onChange }) {
  return <Block color={value?.hex || value} onChange={(e) => onChange(e)} />
}

const DetailModal = ({ updateData, onSearch }) => {
  const dispatch = useDispatch()
  const {
    dictionary: { modalVisible, detailInfo, queryInfo, modalType },
  } = useSelector((state) => state)

  const form = useForm()

  const onClose = () =>
    dispatch({
      type: 'dictionary/update',
      payload: { modalVisible: false },
    })

  const { mutate } = useSWR(
    [
      (modalType === 'add' && addByDict) ||
        (modalType === 'edit' && editByDict),
      { method: 'POST', body: detailInfo },
    ],
    {
      revalidateOnMount: false,
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data && data.code === 200) {
          Notify.success({ title: data?.message })
          onClose()
          onSearch?.()
        }
      },
    }
  )

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
          const { dictColour, ...newCurrent } = current
          updateData({
            detailInfo: {
              ...detailInfo,
              ...newCurrent,
              dictSort: 2,
              dictTypeCode: queryInfo.dictTypeCode,
              dictTypeName: queryInfo.dictTypeName,
              dictColour: dictColour?.hex,
            },
          })
        }}
        customWidgetsList={{ color: Demo }}
        formDatas={[
          {
            label: '字典编码',
            key: 'dictCode',
            widget: 'input',
            initialValue: detailInfo.dictCode,
            required: true,
            rules: [
              {
                required: true,
                validator: (value = '') => {
                  if (value.length < 2 || value.length > 50) return false
                  return true
                },
                message: '请输入字典编码,长度为2-50',
              },
            ],
            widgetProps: {
              disabled: modalType !== 'add',
            },
            span: '24',
          },
          {
            label: '字典名称',
            key: 'dictName',
            widget: 'input',
            initialValue: detailInfo.dictName,
            required: true,
            rules: [
              {
                required: true,
                validator: (value = '') => {
                  if (value.length < 2 || value.length > 50) return false
                  return true
                },
                message: '请输入字典名称,长度为2-50',
              },
            ],
            widgetProps: {},
            span: '24',
          },
          {
            label: '字典标签背景颜色',
            key: 'dictColour',
            widget: 'color',
            initialValue: detailInfo.dictColour,
            required: true,
            rules: [{ required: true, message: '请输入字典标签背景颜色' }],
            widgetProps: {},
            span: '24',
          },
        ]}
      />
      <div className={styles.btnFoot}>
        <Button onClick={onClose} className={styles.btn} type="light">
          取消
        </Button>
        <Button
          className={styles.btn}
          type="primary"
          onClick={async () => {
            // 触发验证
            await form.submitvalidate()
            // 获取错误信息
            const errors = form.getError()
            if (errors && Object.keys(errors).length > 0) return
            // 调用请求接口
            mutate()
          }}>
          保存
        </Button>
      </div>
    </Modal>
  )
}

export default DetailModal

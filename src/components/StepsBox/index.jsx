import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Steps, Button, Card } from 'uiw'
import { useNavigate } from 'react-router-dom'
import { ProForm, useForm } from '@uiw-admin/components'
import { selectOption } from '@/utils/utils'
import './style.css'

const StepsBox = () => {
  const {
    company: { dataSourceList },
    home: { listData },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const form = useForm()
  const form2 = useForm()

  // 搜索
  const handleSearch = (type = '', value = '') => {
    if (type === 'searchSelect') {
      dispatch({
        type: 'company/selectCompanyPage',
        payload: { companyName: value },
      })
      // dispatch({
      //   type: 'home/selectPageList',
      //   payload: { name: value },
      // })
    }
  }

  const steps = [
    {
      title: '请选择公司',
      content: (
        <div>
          <ProForm
            form={form}
            title="选择公司"
            formType="card"
            formDatas={[
              {
                label: '公司名称',
                key: 'companyId',
                widget: 'searchSelect',
                option: selectOption(dataSourceList, 'id', 'companyName') || [],
                required: true,
                rules: [{ required: true, message: '请输入公司名称' }],
                span: '24',
                widgetProps: {
                  onChange: () => handleSearch('searchSelect'),
                  loading: loading,
                  allowClear: true,
                  showSearch: true,
                  style: { width: '100%' },
                },
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: '请选择项目',
      content: (
        <ProForm
          form={form2}
          title="选择项目"
          formType="card"
          formDatas={[
            {
              label: '项目名称',
              key: 'id',
              widget: 'searchSelect',
              option: selectOption(listData, 'id', 'name') || [],
              initialValue: '',
              widgetProps: {
                onChange: () => handleSearch('searchSelect'),
                loading: loading,
                allowClear: true,
                showSearch: true,
                style: { width: '100%' },
              },
              span: '24',
              required: true,
              rules: [
                {
                  validator: (value = '') => !!value,
                  message: '请输入项目名称',
                },
              ],
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div>
      <Modal
        width={500}
        title="选择公司与项目"
        isOpen={true}
        useButton={false}
        icon="information"
        type="primary"
        onConfirm={() => console.log('您点击了确定按钮！')}
        onCancel={() => console.log('您点击了取消按钮！')}
        // onClosed={this.onClosed.bind(this)}
      >
        <Card bordered={false} noHover={true}>
          <Steps current={current}>
            {steps.map((item) => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="StepsBoxCon">{steps[current].content} </div>
          <div className="StepsBoxBtn">
            {current > 0 && (
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => setCurrent(current - 1)}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button
                type="primary"
                onClick={async () => {
                  // 触发验证
                  await form.submitvalidate()
                  // 获取错误信息
                  const errors = form.getError()
                  if (errors && Object.keys(errors).length > 0) return
                  const value = form.getFieldValues?.()

                  dispatch({
                    type: 'home/selectPageList',
                    payload: value,
                  })
                  setCurrent(current + 1)
                }}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={async () => {
                  // 触发验证
                  await form?.submitvalidate()
                  await form2?.submitvalidate()
                  // 获取错误信息
                  const errors = form.getError()
                  const errors2 = form2.getError()

                  if (errors && Object.keys(errors).length > 0) return
                  if (errors2 && Object.keys(errors2).length > 0) return
                  // 获取表单值
                  const value = form.getFieldValues?.()
                  const value2 = form2.getFieldValues?.()
                  const params = { ...value, ...value2 }
                  sessionStorage.setItem('companyId', params?.companyId)
                  sessionStorage.setItem('id', params?.id)
                  navigate(`/project/task/${params?.id}`, {
                    state: { companyId: value2 },
                  })
                }}>
                确认跳转
              </Button>
            )}
          </div>
        </Card>
      </Modal>
    </div>
  )
}
export default StepsBox

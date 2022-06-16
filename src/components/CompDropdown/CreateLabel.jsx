import { useRef } from 'react'
import { Button, Form } from 'uiw'
import styles from './template.module.less'

// 创建标签
const CreateLabel = (props) => {
  const { setLabelStatus, createTag, createTagChange, form } = props
  const labelForm = useRef()
  return (
    <div className={styles.createLabel}>
      <Form
        ref={labelForm}
        onSubmitError={(error) => {
          if (error.filed) return { ...error.filed }
          return null
        }}
        onChange={({ initial, current }) => {
          createTagChange && createTagChange(initial, current)
        }}
        onSubmit={async ({ initial, current }) => {
          console.log('标签')
          // 表单校验
          const errorObj = form ? form?.verify(initial, current) : {}
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }
          // 返回结果
          const result = createTag && (await createTag(initial, current))
          result && setLabelStatus(1)
        }}
        fields={form && { ...form.fields(props) }}>
        {({ fields, state, canSubmit, resetForm }) => {
          return (
            <div>
              <div>
                {form &&
                  form?.fieldsShow({ fields, state, canSubmit, resetForm })}
              </div>
              <div className={styles.butGroup}>
                <Button
                  size="small"
                  type="success"
                  disabled={!Object.keys(state?.current)?.length}
                  // htmlType="submit"
                  onClick={() => labelForm.current.onSubmit()}>
                  创建
                </Button>
                <Button size="small" onClick={() => setLabelStatus(1)}>
                  取消
                </Button>
              </div>
            </div>
          )
        }}
      </Form>
    </div>
  )
}

export default CreateLabel

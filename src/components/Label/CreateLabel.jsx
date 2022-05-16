import { Input, Button, Form } from 'uiw'
import styles from './index.module.less'
import Custom from './Custom'

// 创建标签
const CreateLabel = (props) => {
  const { setLabelStatus, createTag, createTagChange } = props

  return (
    <div className={styles.createLabel}>
      <Form
        onSubmitError={(error) => {
          if (error.filed) return { ...error.filed }
          return null
        }}
        onChange={({ initial, current }) => {
          createTagChange && createTagChange(initial, current)
        }}
        onSubmit={async ({ initial, current }) => {
          const errorObj = {}
          if (current.dictCode.length < 2 || current.dictCode.length > 50) {
            errorObj.dictCode = '请输入字典编码,长度为2-50'
          }
          if (current.dictName.length < 2 || current.dictName.length > 50) {
            errorObj.dictName = '请输入标签名称,长度为2-50'
          }
          if (!current.dictColour) {
            errorObj.dictColour = '请选择或输入标签背景颜色'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }
          const result = createTag && (await createTag(initial, current))
          result && setLabelStatus(1)
        }}
        fields={{
          dictCode: {
            children: <Input size="small" placeholder="请输入字典编码" />,
          },
          dictName: {
            children: <Input size="small" placeholder="请输入标签名称" />,
          },
          dictColour: {
            children: <Custom color={props?.color} />,
          },
        }}>
        {({ fields, state, canSubmit, resetForm }) => {
          return (
            <div>
              <div className={styles.searchBox}>{fields.dictCode}</div>
              <div className={styles.searchBox}>{fields.dictName}</div>
              {fields.dictColour}
              <div className={styles.butGroup}>
                <Button
                  size="small"
                  type="success"
                  disabled={
                    !(
                      state.current.dictColour &&
                      state.current.dictCode &&
                      state.current.dictName
                    )
                  }
                  htmlType="submit">
                  创建
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setLabelStatus(1)
                  }}>
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

import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button, Form, Row, Col } from 'uiw'
import styles from './index.module.less'
import { NEWMDEditor } from '@/components'
const FromMD = (props) => {
  const {
    project: { editFromData, taskInfoData },
  } = useSelector((state) => state)
  const form = useRef()
  return (
    <>
      <Form
        style={{ flex: 1 }}
        ref={form}
        onChange={({ current }) => {
          props.updateData({
            editFromData: {
              ...editFromData,
              ...current,
            },
          })
        }}
        onSubmit={(item) => {
          props.updateData({
            editFromData: {
              ...editFromData,
              ...item,
            },
          })
          props.goSaveIssue()
        }}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          commentDescription: {
            inline: true,
            initialValue: editFromData.commentDescription,
            children: <NEWMDEditor />,
          },
        }}>
        {({ fields }) => {
          return (
            <div>
              <div className="from">
                <Row align="top" className="fromItem">
                  <Col>{fields.commentDescription}</Col>
                </Row>
              </div>
              <Row align="middle" className="fromButton">
                <Col>
                  <div className={styles.btnWrap}>
                    {editFromData === taskInfoData ? null : (
                      <Button type="primary" htmlType="submit">
                        保存编辑
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )
        }}
      </Form>
    </>
  )
}
export default FromMD

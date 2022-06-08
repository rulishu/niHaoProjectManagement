import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, Row, Col } from 'uiw'
import styles from './index.module.less'
import { NEWMDEditor } from '@/components'
import 'tributejs/tribute.css'
import Tribute from 'tributejs'

// let tribute = new Tribute({
//   trigger: '@',
//   values: [{aa:'1111',bb:'ccccc'}],
//   lookup: 'aa',
//   fillAttr: 'bb'
// })

const FromMD = (props) => {
  const {
    upDate,
    submit,
    editName,
    editData,
    infoData,
    fromValue,
    btnName,
    tributeList,
    isComment,
  } = props
  const dispatch = useDispatch()
  const form = useRef()
  const isBundle = useRef(false)
  const [mdRefs, setMdRefs] = useState()
  const newTribute = useMemo(() => {
    return new Tribute({
      trigger: '@',
      values: tributeList || [],
      lookup: 'memberName',
      fillAttr: 'userId',
    })
  }, [tributeList])
  useEffect(() => {
    if (mdRefs?.current?.textarea && !isBundle.current) {
      isBundle.current = true
      newTribute.attach(mdRefs.current.textarea)
      mdRefs.current.textarea.addEventListener('tribute-replaced', (e) => {
        form.current.setFieldValue(fromValue, e.target.value)
      })
    }
  }, [fromValue, mdRefs, newTribute])

  useEffect(() => {
    document.addEventListener('paste', pasteDataEvent)
    return () => {
      document.removeEventListener('paste', pasteDataEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData[fromValue]])

  const pasteDataEvent = (event) => {
    // event.preventDefault();
    if (event.clipboardData || event.originalEvent) {
      let clipboardData =
        event.clipboardData || event.originalEvent.clipboardData
      if (clipboardData.items) {
        let items = clipboardData.items,
          len = items.length,
          blob = null
        for (let i = 0; i < len; i++) {
          let item = clipboardData.items[i]
          if (item.kind === 'string') {
            // item.getAsString(function (str) {
            //   console.log('string', str);
            // })
          } else if (item.kind === 'file') {
            blob = item.getAsFile()
            addImg(blob)
          }
        }
      }
    }
  }

  const addImg = (event) => {
    const file = event
    if (!file) return
    dispatch({
      type: 'allusers/upLoadImg',
      payload: {
        file: file,
      },
    }).then((res) => {
      if (res && res.code === 200) {
        const fieldValues = form.current.getFieldValues()
        form.current.setFieldValue(
          fromValue,
          fieldValues[fromValue] + `![image](/api/file/selectFile/${res?.data})`
        )
      }
    })
  }
  return (
    <>
      <Form
        style={{ flex: 1, marginBottom: 10 }}
        ref={form}
        onChange={({ current }) => {
          upDate({
            [editName]: {
              ...editData,
              ...current,
            },
          })
        }}
        onSubmitError={(error) => {
          if (error.filed) {
            return { ...error.filed }
          }
          return null
        }}
        fields={{
          [fromValue]: {
            inline: true,
            initialValue: editData[fromValue],
            children: (
              <NEWMDEditor
                rfval={(e) => {
                  setMdRefs(e)
                }}
              />
            ),
          },
        }}>
        {({ fields }) => {
          return (
            <div>
              <div className="from">
                <Row align="top" className="fromItem">
                  <Col>{fields[fromValue]}</Col>
                </Row>
              </div>
              <Row align="middle" className="fromButton">
                <Col>
                  <div className={styles.btnWrap}>
                    <Button
                      type="primary"
                      // htmlType="submit"
                      onClick={() => {
                        submit()
                        if (form.current) {
                          form?.current?.setFieldValue(fromValue, '')
                        }
                      }}
                      disabled={
                        isComment
                          ? editData[fromValue] === ''
                          : infoData
                          ? editData === infoData
                          : false
                      }>
                      {btnName || '提交'}
                    </Button>
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

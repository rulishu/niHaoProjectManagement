import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, Row, Col } from 'uiw'
import styles from './index.module.less'
import { NEWMDEditor } from '@/components'
import 'tributejs/tribute.css'
import Tribute from 'tributejs'
import { useParams } from 'react-router-dom'
import { getAllLabelData } from '../../../servers/labels'
import {
  queryFuzzyAllProjectMember,
  getAssignment,
} from '../../../servers/project'
import { getSelectAll } from '../../../servers/milestone'

const FromMD = (props) => {
  const {
    upDate,
    submit,
    editName,
    editData,
    infoData,
    fromValue,
    btnName,
    isComment,
  } = props
  const dispatch = useDispatch()
  const params = useParams()
  const form = useRef()
  const isBundle = useRef(false)
  const [mdRefs, setMdRefs] = useState()
  const newTribute = useMemo(() => {
    return new Tribute({
      collection: [
        {
          trigger: '@',
          values: function (text, cb) {
            remoteSearch(queryFuzzyAllProjectMember, (users) => cb(users))
          },
          // lookup: 'memberName',
          lookup: function (memberName) {
            return `<div style='display: flex; align-items: center;'>
                <img style='width: 30px; height: 30px; border-radius: 50px; margin-right: 8px;' src='${memberName.avatar}' />
                <span style='font-size: 14px; font-weight: lighter;'>${memberName.memberName}</span>
              </div>`
          },
          fillAttr: 'memberName',
        },
        {
          trigger: '#',
          values: function (text, cb) {
            remoteSearch(getAssignment, (users) => cb(users))
          },
          lookup: function (allWork) {
            return '#' + allWork.assignmentId + ' ' + allWork.assignmentTitle
          },
          fillAttr: 'assignmentTitle',
        },
        {
          trigger: '~',
          values: function (text, cb) {
            remoteSearch(getAllLabelData, (users) => cb(users))
          },
          lookup: 'name',
          fillAttr: 'name',
        },
        {
          trigger: '%',
          values: function (text, cb) {
            remoteSearch(getSelectAll, (users) => cb(users))
          },
          lookup: 'milestonesTitle',
          fillAttr: 'milestonesTitle',
        },
      ],
    })
  }, []) // eslint-disable-line
  const remoteSearch = async (text, cb) => {
    const data = await text({ projectId: params.projectId })
    if (data && data.code === 200) {
      cb(data.data)
    } else {
      cb([])
    }
  }

  useEffect(() => {
    if (
      mdRefs?.current?.textarea &&
      !isBundle.current &&
      Object.keys(editData).length > 2
    ) {
      isBundle.current = true
      newTribute.attach(mdRefs.current.textarea)
      mdRefs.current.textarea.addEventListener('tribute-replaced', (e) => {
        form.current.setFieldValue(fromValue, e.target.value)
        upDate({
          [editName]: {
            ...editData,
            [fromValue]: e.target.value,
          },
        })
      })
    }
  }, [fromValue, mdRefs, newTribute, editData, editName, upDate])

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
              <Row
                align="middle"
                // className="fromButton"
              >
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

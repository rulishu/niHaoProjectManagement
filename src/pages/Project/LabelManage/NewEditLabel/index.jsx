import { Fragment, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Input, Form, Row, Col, Loader } from 'uiw'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import Custom from './Custom'
import styles from './index.module.less'
import { isColor } from '@/utils/utils'
// import TitleEx from '@/components/TitleEx'

const NewEditLabel = (props) => {
  const {
    labels: { labelInfo, type },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { projectId, labelsId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const form = useRef()
  const { getLabelInfoById, addLabelItem, editLabelInfo } =
    loading.effects.labels

  useEffect(() => {
    const pathArr = location?.pathname?.split('/')
    if (pathArr[pathArr.length - 1] === 'new') {
      dispatch({
        type: 'labels/updateState',
        payload: { labelInfo: {}, type: type !== 1 ? type : 1 },
      })
    }
    if (labelsId && type !== 2) {
      dispatch({
        type: 'labels/updateState',
        payload: { type: 2 },
      })
    }
    type === 2 && labelsId && dispatch.labels.getLabelInfoById(labelsId)
  }, [dispatch, labelsId, location?.pathname, type])

  // 取消回调
  const onCancel = () => {
    const path = location?.pathname
    const goPath = path?.substring(
      0,
      path?.lastIndexOf(`/${type === 1 ? 'new' : type === 2 ? labelsId : ''}`)
    )
    navigate(goPath)
  }

  const labelForm = () => {
    return (
      <Form
        ref={form}
        onSubmitError={(error) => {
          if (error.filed) return { ...error.filed }
          return null
        }}
        // onChange={({ initial, current }) => {
        //   console.log('onChange====>', initial, current)
        // }}
        onSubmit={async ({ initial, current }) => {
          const errorObj = {}
          const { name, desc, color } = current
          if (!name || name.length < 2 || name.length > 64) {
            errorObj.milestonesTitle = '请输入标题,长度为2~100'
          }
          if (desc && desc.length > 255) {
            errorObj.milestonesDesc = '描述内容长度不大于3000'
          }
          if (!color) {
            errorObj.startTime = '颜色必填'
          }
          if (!isColor(color)) {
            errorObj.color = '请填写正确的颜色码'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }

          // 判断h是新增还是编辑
          // const action =
          //   type === 1
          //     ? 'labels/addLabelItem'
          //     : type === 2
          //       ? 'labels/editLabelInfo'
          //       : ''

          // 提交 参数
          const param = { ...current, projectId }
          if (type === 2) param.id = labelInfo.id
          if (type === 1) {
            dispatch.labels.addLabelItem({
              param,
              callback: onCancel,
            })
          }
          if (type === 2) {
            dispatch.labels.editLabelInfo({
              param,
              callback: onCancel,
            })
          }
          // action &&
          //   (await dispatch({
          //     type: action,
          //     payload: { param, callback: onCancel },
          //   }))
        }}
        fields={{
          name: {
            // label: <TitleEx must>标题</TitleEx>,
            initialValue: labelInfo.name,
            inline: true,
            required: true,
            children: <Input placeholder="请输入标签标题" />,
          },
          desc: {
            // label: '描述',
            initialValue: labelInfo.desc,
            inline: true,
            children: <Input placeholder="请输入标签描述" />,
          },
          color: {
            // label: <TitleEx must>背景颜色</TitleEx>,
            initialValue: labelInfo.color,
            inline: true,
            required: true,
            children: <Custom color={props?.color} />,
          },
        }}>
        {({ fields, state, canSubmit }) => {
          return (
            <div className={styles.fromDiv}>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  标题
                </Col>
                <Col span="19">{fields.name}</Col>
              </Row>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  描述
                </Col>
                <Col span="19">{fields.desc}</Col>
              </Row>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  背景颜色
                </Col>
                <Col span="19">{fields.color}</Col>
              </Row>
              <Row align="baseline" className={styles.fromButton}>
                <Col>
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={addLabelItem || editLabelInfo}>
                    保存
                  </Button>
                  <Button onClick={() => onCancel()}>取消</Button>
                </Col>
              </Row>
            </div>
          )
        }}
      </Form>
    )
  }

  return (
    <Fragment>
      <Card>
        <div className={styles.main}>
          <div className={styles.wrap}>
            <div className={styles.title}>
              {type === 1 ? '新增标签' : type === 2 ? '编辑标签' : ''}
            </div>
            <div className={styles.newEditForm}>
              <Loader
                tip="加载中..."
                vertical
                style={{ width: '100%' }}
                loading={getLabelInfoById}>
                <div>
                  {!labelsId ? (
                    labelForm()
                  ) : labelsId && Object.keys(labelInfo).length ? (
                    labelForm()
                  ) : (
                    <></>
                  )}
                </div>
              </Loader>
            </div>
          </div>
        </div>
      </Card>
    </Fragment>
  )
}

export default NewEditLabel

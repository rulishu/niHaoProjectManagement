import { Fragment, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Card, Input, Form, Divider, Row, Col, Loader } from 'uiw'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import Custom from './Custom'
import styles from './index.module.less'

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
            errorObj.milestonesDesc = '描述内容长度为应西不大于3000'
          }
          if (!color) {
            errorObj.startTime = '颜色必填'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }

          // 判断h是新增还是编辑
          const action =
            type === 1
              ? 'labels/addLabelItem'
              : type === 2
              ? 'labels/editLabelInfo'
              : ''

          // 提交 参数
          const param = { ...current, projectId }
          if (type === 2) param.id = labelInfo.id
          action &&
            (await dispatch({
              type: action,
              payload: { param, callback: onCancel },
            }))
        }}
        fields={{
          name: {
            initialValue: labelInfo.name,
            inline: true,
            children: <Input size="small" placeholder="请输入标签标题" />,
          },
          desc: {
            initialValue: labelInfo.desc,
            inline: true,
            children: <Input size="small" placeholder="请输入标签描述" />,
          },
          color: {
            initialValue: labelInfo.color,
            inline: true,
            children: <Custom color={props?.color} />,
          },
        }}>
        {({ fields, state, canSubmit }) => {
          return (
            <div>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  标题
                </Col>
                <Col span="19">{fields?.name}</Col>
              </Row>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  描述
                </Col>
                <Col span="19">{fields?.desc}</Col>
              </Row>
              <Row align="baseline" className={styles.fromItem}>
                <Col span="4" className={styles.titleInput}>
                  背景颜色
                </Col>
                <Col span="19">{fields?.color}</Col>
              </Row>
              <Row align="baseline" className={styles.fromButton}>
                <Col>
                  <Button
                    disabled={
                      !state?.current?.color ||
                      !state?.current?.name ||
                      !canSubmit()
                    }
                    htmlType="submit"
                    size="small">
                    保存
                  </Button>
                  <Button onClick={() => onCancel()} size="small">
                    取消
                  </Button>
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
        <div className={styles.wrap}>
          <div className={styles.newEditTitle}>
            <h2>{type === 1 ? '新增标签' : type === 2 ? '编辑标签' : ''}</h2>
          </div>
          <Divider />
          <div className={styles.newEditForm}>
            <Loader
              tip="加载中..."
              vertical
              style={{ width: '100%' }}
              loading={loading.effects.labels.getLabelInfoById}>
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
      </Card>
    </Fragment>
  )
}

export default NewEditLabel

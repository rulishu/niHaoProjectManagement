import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Card,
  OverlayTrigger,
  Loader,
  Empty,
  Icon,
  Input,
  Modal,
  Row,
  Col,
  Tooltip,
} from 'uiw'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import timeDistance from '@/utils/timeDistance'
import styles from './index.module.less'

const LabelManage = (props) => {
  const {
    labels: { listData },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { projectId } = useParams()
  const [sorting, setSorting] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [isPulldown, setIsPulldown] = useState(false)
  const [alertShow, setAlertShow] = useState(false)
  const [delId, setDelId] = useState()

  // 获取列表数据
  const getListData = async (param) => {
    await dispatch({
      type: 'labels/getAllLabelData',
      payload: { projectId, ...param },
    })
  }

  // 获取列表数据
  const updateState = async (param) => {
    await dispatch({
      type: 'labels/updateState',
      payload: param,
    })
  }

  useEffect(() => {
    updateState({ projectId })
    getListData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // 下拉框数据
  const sortingList = [
    { value: 1, title: '名称升序' },
    { value: 2, title: '名称降序' },
    { value: 3, title: '创建时间升序' },
    { value: 4, title: '创建时间降序' },
    { value: 5, title: '更新时间升序' },
    { value: 6, title: '更新时间降序' },
  ]

  // 对应的排序对象
  const sortingObj = [
    { key: 1, value: { orderByColumn: 'name', isAsc: 'asc' } },
    { key: 2, value: { orderByColumn: 'name', isAsc: 'desc' } },
    { key: 3, value: { orderByColumn: 'createTime', isAsc: 'asc' } },
    { key: 4, value: { orderByColumn: 'createTime', isAsc: 'desc' } },
    { key: 5, value: { orderByColumn: 'updateTime', isAsc: 'asc' } },
    { key: 6, value: { orderByColumn: 'updateTime', isAsc: 'desc' } },
  ]

  // 下拉框内容
  const card = (
    <div className={styles.dropdownMenu}>
      <ul>
        {sortingList.map((item) => (
          <li
            key={item.value}
            onClick={async () => {
              const sort = sortingObj.filter(
                (itemA) => itemA.key === item.value
              )[0]
              setSorting(item.value)
              setIsPulldown(false)
              await updateState({ sorting: sort.value })
              await getListData({ name: inputValue })
            }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )

  // 删除标签
  const deleteLabelItem = (labelId) => {
    setDelId(labelId)
    setAlertShow(true)
  }

  // 跳转新增/编辑页面
  const goNewEditLabel = (id, info) => {
    updateState({
      labelInfo: id ? info : {},
      type: id ? 2 : 1,
    })
    navigate(`${location.pathname}/${id ? id : 'new'}`)
  }

  const Blank = ({ children, style }) => (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      {children}
    </div>
  )
  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <div className={styles.labelManageBox}>
            <div className={styles.labelsHead}>
              <div className={styles.headLeft}></div>
              <div className={styles.headRight}>
                <div>
                  <Input
                    placeholder="请输入标签名"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                    }}
                    addonAfter={
                      <Button
                        icon="search"
                        size="small"
                        basic
                        type="light"
                        onClick={() => getListData({ name: inputValue })}
                      />
                    }
                  />
                </div>
                <div className={styles.dropdown}>
                  <OverlayTrigger
                    placement="bottomRight"
                    trigger="click"
                    isOpen={isPulldown}
                    onVisibleChange={(open) => setIsPulldown(open)}
                    overlay={card}>
                    <div className={styles.toggle}>
                      <span>
                        {sortingList.map(
                          (item) => item.value === sorting && item.title
                        )}
                      </span>
                      <Icon type={isPulldown ? 'up' : 'down'} />
                    </div>
                  </OverlayTrigger>
                </div>

                <div className={styles.addLabelBut}>
                  <Button type="primary" onClick={() => goNewEditLabel()}>
                    新增标签
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.labelsList}>
              <ul>
                <Loader
                  tip="加载中..."
                  vertical
                  style={{ width: '100%' }}
                  loading={loading.effects.labels.getAllLabelData}>
                  <>
                    {listData?.length ? (
                      listData?.map((item) => {
                        return (
                          <li key={item?.id}>
                            <Row gutter={24} align="middle">
                              <Col span={6}>
                                <Blank
                                  style={{
                                    justifyContent: 'flex-start',
                                    paddingLeft: 0,
                                  }}>
                                  <Tooltip placement="top" content={item?.name}>
                                    <span
                                      className={styles.namebox}
                                      style={{
                                        backgroundColor: item?.color,
                                        color:
                                          item?.color === '#ffffff' ||
                                          item?.color === '#FFFFFF' ||
                                          item?.color === '#fff' ||
                                          item?.color === '#FFF'
                                            ? '#000000'
                                            : '#ffffff',
                                        border: '1px solid #f0f0f0',
                                      }}>
                                      {`${
                                        item?.name && item?.name.length > 10
                                          ? item?.name.substring(0, 10) + '...'
                                          : item?.name || ''
                                      }`}
                                    </span>
                                  </Tooltip>
                                </Blank>
                              </Col>
                              <Col span={6}>
                                <Blank
                                  style={{
                                    justifyContent: 'flex-start',
                                    paddingLeft: 0,
                                  }}>
                                  <Tooltip placement="top" content={item?.desc}>
                                    <span>
                                      {`${
                                        item?.desc && item?.desc.length > 30
                                          ? item?.desc.substring(0, 30) + '...'
                                          : item?.desc || ''
                                      }`}
                                    </span>
                                  </Tooltip>
                                </Blank>
                              </Col>
                              <Col span={8}>
                                <Blank
                                  style={{
                                    justifyContent: 'flex-end',
                                    paddingLeft: 0,
                                  }}>
                                  {`更新于${
                                    timeDistance(item?.updateTime).time
                                  }前`}
                                </Blank>
                              </Col>
                              <Col span={4}>
                                <Blank
                                  style={{
                                    justifyContent: 'flex-end',
                                    paddingLeft: 0,
                                  }}>
                                  <Button
                                    icon="edit"
                                    basic
                                    type="dark"
                                    size="small"
                                    onClick={() =>
                                      goNewEditLabel(item?.id, item)
                                    }
                                  />
                                  <Button
                                    icon="delete"
                                    basic
                                    type="dark"
                                    size="small"
                                    onClick={() => deleteLabelItem(item?.id)}
                                  />
                                </Blank>
                              </Col>
                            </Row>
                          </li>
                        )
                      })
                    ) : (
                      <Empty />
                    )}
                  </>
                </Loader>
              </ul>
            </div>
            {/* <Alert
              isOpen={alertShow}
              confirmText="确认"
              onClosed={() => setAlertShow(false)}
              type="danger"
              content={`是否确认删除本条标签！`}
              onConfirm={() => {
                dispatch({
                  type: 'labels/deleteLabel',
                  payload: [delId],
                })
              }}></Alert> */}
            {/* 统一删除按钮样式 */}
            <Modal
              title="删除提示"
              isOpen={alertShow}
              confirmText="确定"
              cancelText="取消"
              icon="information"
              type="danger"
              onConfirm={() => {
                dispatch({
                  type: 'labels/deleteLabel',
                  payload: [delId],
                })
              }}
              onCancel={() => setAlertShow(false)}
              onClosed={() => setAlertShow(false)}>
              <p>确认删除本条标签吗?</p>
            </Modal>
          </div>
        </div>
      </Card>
    </Fragment>
  )
}

export default LabelManage

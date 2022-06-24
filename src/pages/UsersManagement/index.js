import { useEffect, useState, Fragment } from 'react'
import useLocationPage from '@/hooks/useLocationPage'
import { useSelector, useDispatch } from 'react-redux'
import styles from './index.module.less'
import {
  Card,
  Pagination,
  Avatar,
  Row,
  Col,
  Tooltip,
  Modal,
  Notify,
  OverlayTrigger,
  Icon,
  DateInput,
  Button,
} from 'uiw'
import { useParams, useNavigate } from 'react-router-dom'
import timeDistance from '@/utils/timeDistance'
// import formatter from '@uiw/formatter'
import { changeTime } from '@/utils/utils'
import formatter from '@uiw/formatter'
import Search from './search'
import Invite from './invite'

const Index = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projectId } = useParams()
  const [isPulldown, setIsPulldown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(10)
  const {
    usersManagement: { listData, total, delectVisible, type, memberInfo },
    routeManagement: { userInfo, dataUser },
  } = useSelector((state) => state)
  const updateData = (payload) => {
    dispatch({
      type: 'usersManagement/updateState',
      payload,
    })
  }
  const onSearch = () => {
    dispatch({
      type: 'usersManagement/selectPageList',
      payload: {
        page: 1,
        pageSize: 10,
        projectId: projectId,
      },
    })
  }
  useEffect(() => {
    dispatch({
      type: 'routeManagement/getInfo',
      payload: {
        callback: '',
      },
    })
    dispatch({
      type: 'usersManagement/selectPageList',
      payload: {
        page: 1,
        pageSize: 10,
        projectId: projectId,
      },
    })
  }, [dispatch, projectId])
  // 跳转页面方法
  const goPage = (value) => {
    navigate(`/${value}`)
  }
  useLocationPage()
  //表头
  const userTitle = [
    {
      name: '账户',
      length: '8',
    },
    {
      name: '授予访问时间',
      length: '3',
    },
    {
      name: '邮箱',
      length: '5',
    },
    {
      name: '成员角色',
      length: '3',
    },
    {
      name: '授予到期时间',
      length: '3',
    },
    {
      name: '操作',
      length: '2',
    },
  ]
  //操作
  const handleEditTable = (type, item) => {
    if (type === 'del' || type === 'out') {
      updateData({
        delectVisible: true,
        type: type,
        memberInfo: item,
      })
    }
    if (type === 'edit') {
      updateData({
        type: type,
        memberInfo: item,
      })
    }
  }

  const onClose = () => {
    updateData({
      delectVisible: false,
    })
  }
  // 执行成功返回的信息
  const information = (data) => {
    if (data.code === 200) {
      if (type === 'out') {
        onClose()
        Notify.success({ title: data?.message || '' })
        navigate(`/dashboard`, { replace: true })
        return
      }
      onClose()
      onSearch()
      setIsPulldown(false)
      Notify.success({ title: data?.message || '' })
    } else {
      dispatch({
        type: 'usersManagement/updateState',
        payload: { loading: false },
      })
      Notify.error({ title: data?.message || '' })
    }
  }
  const onConfirm = () => {
    dispatch({
      type: 'usersManagement/deleteProjectMember',
      payload: {
        userId: memberInfo.userId,
        projectId: memberInfo.projectId,
      },
    }).then((data) => information(data))
  }
  // 下拉框数据
  const roleList = [
    { value: 1, title: '开发' },
    { value: 2, title: '测试' },
    { value: 3, title: '项目管理者' },
    { value: 4, title: '创建者' },
  ]
  const editUser = (memberRole) => {
    const payload = {
      id: memberInfo.id,
      accessExpirationTime: memberInfo.accessExpirationTime,
      memberRole: Number(memberRole),
      userId: memberInfo.userId,
      projectId: memberInfo.projectId,
    }
    dispatch({
      type: 'usersManagement/updateProjectMember',
      payload,
    }).then((data) => information(data))
  }
  const editTime = (memberTime) => {
    if (memberTime) {
      const payload = {
        id: memberInfo.id,
        accessExpirationTime: formatter('YYYY-MM-DD', new Date(memberTime)),
        memberRole: memberInfo.memberRole,
        userId: memberInfo.userId,
        projectId: memberInfo.projectId,
      }
      dispatch({
        type: 'usersManagement/updateProjectMember',
        payload,
      }).then((data) => information(data))
    } else {
      Notify.error({ title: '授予到期时间不能为空' })
    }
  }
  const roleMenu = (
    <div className={styles.dropdownMenu}>
      <ul>
        {roleList?.slice(0, 3).map((item) => (
          <li
            key={item.value}
            onClick={() => {
              editUser(item.value)
            }}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
  const getTitle = (value) => {
    const data = roleList.filter((item) => item.value === value)
    return data[0]?.title
  }

  //超级管理员权限
  const owner = localStorage.getItem('key')
  //权限设置:仅项目管理者可以邀请/编辑删除
  let memberRoles = dataUser
    ?.filter((item) => {
      return item.memberName === userInfo
    })
    .map((a) => a.memberRole)
  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <div className={styles.userContent}>
            <Invite />
            <Search />
            <div className={styles.userList}>
              <div className={styles.userListTitle}>
                <Row>
                  {userTitle &&
                    userTitle.map((item, index) => {
                      return (
                        <Col span={item.length} key={index}>
                          {item.name}
                        </Col>
                      )
                    })}
                </Row>
              </div>
              {listData &&
                listData.map((item, index) => {
                  return (
                    <Row className={styles.userListItem} key={index}>
                      <Col span={userTitle && userTitle[0]?.length}>
                        <div
                          className={styles.userInfo}
                          onClick={() => goPage(`${item.userName}`)}>
                          <Avatar
                            size="small"
                            src={
                              item?.avatar &&
                              `/api/file/selectFile/${item?.avatar}`
                            }
                            className={styles.userAvatar}>
                            {item.memberName && item.memberName[0]}
                          </Avatar>
                          <div className={styles.userAcount}>
                            <span>{item.memberName}</span>
                            <span>@{item.userName}</span>
                          </div>
                        </div>
                      </Col>
                      <Col span={userTitle && userTitle[1]?.length}>
                        <div className={styles.createTime}>
                          <Tooltip
                            placement="top"
                            content={item?.createTime?.slice(0, 10)}>
                            {`${timeDistance(item?.createTime).time}前`}
                          </Tooltip>
                        </div>
                      </Col>
                      <Col span={userTitle && userTitle[2]?.length}>
                        <Tooltip placement="top" content={item?.email}>
                          <div className={styles.userMail}>
                            <span>{item.email}</span>
                          </div>
                        </Tooltip>
                      </Col>
                      <Col span={userTitle && userTitle[3]?.length}>
                        <div className={styles.userRole}>
                          {owner === 'true' || Number(memberRoles) === 3 ? (
                            <OverlayTrigger
                              placement="bottomRight"
                              trigger="click"
                              isOpen={isPulldown && activeIndex === index}
                              onVisibleChange={(open) => {
                                setIsPulldown(open)
                                setActiveIndex(index)
                                handleEditTable('edit', item)
                              }}
                              overlay={roleMenu}>
                              <div className={styles.toggle}>
                                <span>{getTitle(item.memberRole)}</span>
                                <Icon
                                  type={
                                    isPulldown && activeIndex === index
                                      ? 'up'
                                      : 'down'
                                  }
                                />
                              </div>
                            </OverlayTrigger>
                          ) : (
                            <div className={styles.noChange}>
                              {getTitle(item.memberRole)}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col span={userTitle && userTitle[4]?.length}>
                        <div className={styles.createTime}>
                          {owner === 'true' || Number(memberRoles) === 3 ? (
                            <DateInput
                              style={{ width: '90%' }}
                              value={item.accessExpirationTime}
                              format="YYYY-MM-DD"
                              autoClose
                              onChange={(e) => {
                                handleEditTable('edit', item)
                                // editTime(formatter('YYYY-MM-DD', new Date(e)))
                                editTime(changeTime(e))
                              }}
                            />
                          ) : (
                            item.accessExpirationTime
                          )}
                        </div>
                      </Col>
                      <Col span={userTitle && userTitle[5]?.length}>
                        <div className={styles.userButton}>
                          {userInfo === item?.memberName ? (
                            // <div
                            //   className={styles.userDel}
                            //   onClick={() => handleEditTable('out', item)}>
                            //   退出该项目
                            // </div>
                            <Tooltip placement="top" content="退出项目">
                              <Button
                                type="danger"
                                className={styles.userDel}
                                onClick={() => handleEditTable('out', item)}
                                icon="rollback"
                              />
                            </Tooltip>
                          ) : (
                            (owner === 'true' || Number(memberRoles) === 3) && (
                              // <div
                              //   className={styles.userDel}
                              //   onClick={() => handleEditTable('del', item)}>
                              //   移出该成员
                              // </div>
                              <Button
                                type="danger"
                                className={styles.userDel}
                                onClick={() => handleEditTable('del', item)}>
                                删除成员
                              </Button>
                            )
                          )}
                        </div>
                      </Col>
                    </Row>
                  )
                })}
            </div>
            <div className={styles.pagination}>
              {total > 10 && (
                <Pagination
                  current={1}
                  alignment="center"
                  pageSize={10}
                  total={total}
                  onChange={(page) =>
                    dispatch({
                      type: 'usersManagement/selectPageList',
                      payload: {
                        page: page,
                        pageSize: 10,
                        projectId: projectId,
                      },
                    })
                  }
                />
              )}
            </div>
            <Modal
              title={type === 'del' ? '移出成员提示' : '退出项目提示'}
              isOpen={delectVisible}
              confirmText="确定"
              cancelText="取消"
              icon="information"
              type="danger"
              onConfirm={() => onConfirm()}
              onCancel={() => onClose()}
              onClosed={onClose}>
              <p>
                确定要
                {type === 'del'
                  ? `确认移出成员${memberInfo.memberName}`
                  : '确认退出该项目'}
                吗?
              </p>
            </Modal>
          </div>
        </div>
      </Card>
    </Fragment>
  )
}

export default Index

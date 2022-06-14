import { useState, useEffect } from 'react'
import { Card, Avatar, Tabs, Button, Loader, Icon, Overlay } from 'uiw'
import { useSelector, useDispatch, connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Container } from '@/components'
import Summary from './Summary'
import ProjectList from './ProjectList'
import DynamicsList from './DynamicsList'
import styles from './index.module.less'
import PopupBox from '../PopupBox'
import TaskList from './TaskList'

const UserHome = (props) => {
  const {
    userHome: { user },
    routeManagement: { userInfoName },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  const { navigate } = props.router
  const { userAccount } = useParams()

  const [activeKey, setActiveKey] = useState('1')
  const [isOverlay, setIsOverlay] = useState(false)

  useEffect(() => {
    dispatch.rolemanagement?.getAllRoleList()
    dispatch.rolemanagement?.getAllDepartment()
    dispatch.dictionary?.getQueryAll()
    const callback = async () => {
      await dispatch({
        type: 'userHome/getUserInfoByAccount',
        payload: userAccount,
      })
    }
    callback()
  }, [dispatch, userAccount])

  // 跳转页面方法
  const goSpecifyPage = (option) => {
    navigate(option?.id ? `${option?.path}/${option?.id}` : `${option?.path}`)
  }

  //编辑用户
  const handleEdit = async (value, type) => {
    setIsOverlay(true)
    await dispatch.allusers.update({
      baseDetail: { ...value },
      cUser: value,
      isShow: 'isshow',
    })
    await dispatch.allusers.queryById(value.userId)
    dispatch({
      type: 'allusers/update',
      payload: {
        types: type,
        userData: user,
      },
    })
  }

  return (
    <div>
      <Container>
        <div className={styles.userHomeWrap}>
          <div className={styles.userInfo}>
            <Card>
              <>
                <div className={styles.avatar}>
                  <Avatar
                    src={
                      user?.avatar?.substring(0, 4) === 'http'
                        ? user?.avatar
                        : user?.avatar?.substring(0, 4) !== 'http' &&
                          user?.avatar !== ''
                        ? `/api/file/selectFile/${user?.avatar}`
                        : ''
                    }>
                    {user?.nickName && user?.nickName[0]}
                  </Avatar>
                </div>
                <Loader
                  tip="用户信息加载中..."
                  vertical
                  style={{ width: '100%' }}
                  loading={loading.effects.userHome.getUserInfo}>
                  <>
                    <div className={styles.name}>
                      <h2>{user?.nickName}</h2>
                    </div>
                  </>
                </Loader>
                {userInfoName === user?.userName ? (
                  userInfoName === 'admin' ? null : (
                    <div className={styles.editBut}>
                      <Button
                        block
                        type="light"
                        onClick={() => handleEdit(user, 2)}>
                        编辑用户
                      </Button>
                    </div>
                  )
                ) : null}
                <div className={styles.note}>
                  <p>
                    <span>简介：</span>
                    {user?.remark}
                  </p>
                </div>
                <div className={styles.userBasicInfo}>
                  <ul>
                    {user?.userName && (
                      <li>
                        <span>
                          <Icon type="user" />
                        </span>
                        <span>{user?.userName}</span>
                      </li>
                    )}
                    {user?.email && (
                      <li>
                        <span>
                          <Icon type="mail-o" />
                        </span>
                        <span>{user?.email}</span>
                      </li>
                    )}
                    {user?.phonenumber && (
                      <li>
                        <span>
                          <Icon type="mobile" />
                        </span>
                        <span>{user?.phonenumber}</span>
                      </li>
                    )}
                    {user?.roles?.length && (
                      <li>
                        <span>
                          <Icon type="verification" />
                        </span>
                        <span>{user?.roles[0].roleName}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </>
            </Card>
          </div>
          <div className={styles.userProject}>
            <Card>
              <>
                <Tabs
                  type="line"
                  activeKey={activeKey}
                  onTabClick={(key) => setActiveKey(key)}>
                  <Tabs.Pane label="概述" key="1">
                    <div>
                      <Summary
                        goSpecifyPage={goSpecifyPage}
                        setActiveKey={setActiveKey}
                      />
                    </div>
                  </Tabs.Pane>
                  <Tabs.Pane label="项目" key="2">
                    <div>
                      <ProjectList goSpecifyPage={goSpecifyPage} />
                    </div>
                  </Tabs.Pane>
                  <Tabs.Pane label="任务" key="3">
                    <div>
                      <TaskList goSpecifyPage={goSpecifyPage} />
                    </div>
                  </Tabs.Pane>
                  <Tabs.Pane label="动态" key="4">
                    <div>
                      <DynamicsList goSpecifyPage={goSpecifyPage} />
                    </div>
                  </Tabs.Pane>
                </Tabs>
              </>
            </Card>
          </div>
        </div>
        <Overlay
          hasBackdrop={true}
          isOpen={isOverlay}
          onClose={() => {
            setIsOverlay(false)
            dispatch.allusers.update({
              isShow: '',
              userData: '',
              postsDataInfo: [],
            })
          }}>
          <div>
            <PopupBox setIsOverlay={setIsOverlay} />
          </div>
        </Overlay>
      </Container>
    </div>
  )
}
// export default UserHome
const mapStateToProps = ({ allusers, rolemanagement, dictionary }) => ({
  state: { allusers, rolemanagement, dictionary },
})

const mapDispatchToProps = ({ allusers, rolemanagement }) => ({
  dispatch: allusers,
  roleDispatch: rolemanagement,
})

export default connect(mapStateToProps, mapDispatchToProps)(UserHome)

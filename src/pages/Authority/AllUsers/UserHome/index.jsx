import { useState, useEffect } from 'react'
import { Card, Avatar, Tabs, Button, Loader, Icon, Overlay } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Container } from '@/components'
import Summary from './Summary'
import ProjectList from './ProjectList'
import DynamicsList from './DynamicsList'
import styles from './index.module.less'
import PopupBox from '../PopupBox'

const UserHome = (props) => {
  const {
    userHome: { user },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { userId } = useParams()
  const { navigate } = props.router

  const [activeKey, setActiveKey] = useState('1')
  const [isOverlay, setIsOverlay] = useState(false)

  useEffect(() => {
    const callback = async () => {
      await dispatch({
        type: 'userHome/getUserInfo',
        payload: { id: userId },
      })
    }
    callback()
  }, [dispatch, userId])

  // 跳转页面方法
  const goSpecifyPage = (option) => {
    navigate(`${option?.path}/${option?.id}`)
  }

  //编辑用户
  const handleEdit = async (value, type) => {
    setIsOverlay(true)
    await dispatch.allusers.update({
      baseDetail: { ...value },
      cUser: value,
    })
    await dispatch.allusers.queryById(value.userId)
    dispatch({
      type: 'allusers/update',
      payload: {
        types: type,
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
                      user?.avatar ? `/api/file/selectFile/${user?.avatar}` : ''
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
                <div className={styles.editBut}>
                  <Button
                    block
                    type="light"
                    onClick={() => handleEdit(user, 2)}>
                    编辑用户
                  </Button>
                </div>
                <div className={styles.note}>
                  <p>{user?.remark}</p>
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
                  <Tabs.Pane label="动态" key="3">
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
          onClose={() => setIsOverlay(false)}>
          <div>
            <PopupBox setIsOverlay={setIsOverlay} />
          </div>
        </Overlay>
      </Container>
    </div>
  )
}
export default UserHome

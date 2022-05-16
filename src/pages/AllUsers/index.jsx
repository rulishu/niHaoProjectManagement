import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { Icon, Loader, Overlay, Tabs, Button } from 'uiw'
import Head from './Head'
import MembersProject from './MembersProject'
import UsersBox from './UsersBox' // 成员列表
import PopupBox from './PopupBox' // 操作弹窗
import styles from './index.module.less'
const Users = (props) => {
  const { dispatch, state, update } = props
  const { dataList, page, pages, pageSize, memberAvatarArr } = state.allusers
  const [type, setType] = useState()
  const [isOverlay, setIsOverlay] = useState(false)
  const [userList, setUserList] = useState(dataList)

  useEffect(() => {
    dispatch.allusers?.queryByPage()
    dispatch.dictionary?.getQueryAll({ dictTypeCode: 'position', dictSort: 2 })
    dispatch.rolemanagement?.getAllRoleList()
  }, [dispatch])

  useEffect(() => {
    page === 1 && setUserList(dataList)
  }, [dataList, page])

  useEffect(() => {
    getItemList()
    if (userList.length < (page - 1) * pageSize + userList.length) {
      const allUserList = sessionStorage.getItem('allUserList')
      setUserList(JSON.parse(allUserList))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { loading } = useSelector((state) => state)

  // 初始化所有公司与项目列表
  const getItemList = async () => {
    await dispatch.allusers.getAllCompanyProjects()
  }

  const handleEdit = async (value, type) => {
    // await dispatch.allusers.getNewUserAvatarFile({ uuid: value.uuid })

    if (type === 2) {
      setType(2)
      setIsOverlay(true)
      await update({ baseDetail: { ...value }, cUser: value })
      await dispatch.allusers.queryById(value.id)
    } else if (type === 1) {
      setType(1)
      setIsOverlay(true)
      await update({ baseDetail: { ...value }, cUser: value })
      await dispatch.allusers.queryById(value.id)
    } else {
      setType('delete')
      await dispatch.allusers.deleteById(value)
    }
  }
  // 头部组件的回调
  const handleOnSearch = async (value, is) => {
    let callback = is ? (data) => setUserList([...data]) : null
    dispatch.allusers.queryByPage({ page: 1, ...value }, callback)
  }

  // 获取更多按钮的回调
  const forMoreUsers = async () => {
    await dispatch.allusers.queryByPage({ page: page + 1 }, queryCallback)
  }

  // 加载更多成员回调函数
  const queryCallback = (data) => {
    sessionStorage.setItem(
      'allUserList',
      JSON.stringify([...userList, ...data])
    )
    setUserList([...userList, ...data])
  }

  return (
    <div className={styles.userWrap}>
      <Tabs type="line" activeKey="1">
        <Tabs.Pane label="成员信息" key="1">
          <div>
            <Head
              setVisible={setIsOverlay}
              setType={setType}
              handleOnSearch={handleOnSearch}
            />
            <div className={styles.child}>
              <UsersBox
                data={userList}
                handleEdit={handleEdit}
                memberAvatarArr={memberAvatarArr}
              />
              <div className={styles.loadInfo}>
                <Loader
                  tip="加载中..."
                  vertical
                  loading={loading.effects.allusers.queryByPage}
                  className={styles.forMore}
                  size="large"
                  indicator={
                    <Icon
                      type="loading"
                      spin={true}
                      style={{ verticalAlign: 'text-top', fontSize: '16px' }}
                    />
                  }>
                  <>
                    {pages > page ? (
                      <Button onClick={() => forMoreUsers()}>
                        ↓↓↓ 加载更多...↓↓↓
                      </Button>
                    ) : (
                      <span className={styles.prompt}>没有更多了！！！</span>
                    )}
                  </>
                </Loader>
              </div>
            </div>
          </div>
        </Tabs.Pane>
        <Tabs.Pane label="公司&项目" key="2">
          <MembersProject />
        </Tabs.Pane>
      </Tabs>
      <Overlay
        hasBackdrop={true}
        isOpen={isOverlay}
        onClose={() => setIsOverlay(false)}>
        <div>
          <PopupBox setIsOverlay={setIsOverlay} type={type} />
        </div>
      </Overlay>
    </div>
  )
}

const mapStateToProps = ({ allusers, dictionary }) => ({
  state: { allusers, dictionary },
})

const mapDispatchToProps = ({ allusers, dictionary, rolemanagement }) => ({
  dispatch: { allusers, dictionary, rolemanagement },
  update: allusers.update,
})

export default connect(mapStateToProps, mapDispatchToProps)(Users)

import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { Icon, Loader, Overlay, Button } from 'uiw'
import Head from './Head'
// import MembersProject from './MembersProject'
import UsersBox from './UsersBox' // 成员列表
import PopupBox from './PopupBox' // 操作弹窗
import styles from './index.module.less'
const Users = (props) => {
  const { dispatch, state, update } = props
  const { dataList, page, pageSize, total, types, memberAvatarArr } =
    state.allusers // dataListPage,
  const [type, setType] = useState()
  const [isOverlay, setIsOverlay] = useState(false)
  const [newPage, setNewPage] = useState(1)
  const [userList, setUserList] = useState(dataList)

  useEffect(() => {
    dispatch.allusers?.queryByPage({ page: 1 })
    dispatch.dictionary.getDictDataList({
      dictType: 'assignment_label',
      page: 1,
      pageSize: 999,
    })
    dispatch.rolemanagement?.getAllRoleList()
    dispatch.rolemanagement?.getAllDepartment()
    dispatch.dictionary?.getQueryAll()
  }, [dispatch])

  useEffect(() => {
    setNewPage(page)
  }, [page])

  useEffect(() => {
    newPage === 1 && setUserList(dataList)
  }, [dataList, newPage])

  useEffect(() => {
    const allUserList = JSON.parse(sessionStorage.getItem('allUserList'))
    if (userList.length < (page - 1) * pageSize + userList.length) {
      setUserList(allUserList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { loading } = useSelector((state) => state)

  const handleEdit = async (value, type) => {
    // await dispatch.allusers.getNewUserAvatarFile({ uuid: value.avatar })
    if (type === 2 || types === 2) {
      setType(2)
      setIsOverlay(true)
      await update({ baseDetail: { ...value }, cUser: value })
      await dispatch.allusers.queryById(value.userId)
    } else if (type === 1) {
      setType(1)
      setIsOverlay(true)
      await update({ baseDetail: { ...value }, cUser: value })
      await dispatch.allusers.queryById(value.userId)
    } else {
      setType('delete')
      await dispatch.allusers.deleteById(value)
      setNewPage(1)
    }
  }
  // 头部组件的回调
  const handleOnSearch = async (value, is) => {
    let callback = is ? (data) => setUserList([...data]) : null
    setNewPage(1)
    dispatch.allusers.queryByPage({ page: 1, ...value }, callback)
  }

  // 获取更多按钮的回调
  const forMoreUsers = async () => {
    setNewPage(() => page + 1)
    await dispatch.allusers.queryByPage({ page: page + 1 }, queryCallback)
    await dispatch.allusers.listNotPage({ page: page }, queryCallback)
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
                {total > userList?.length ? (
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
      <Overlay
        hasBackdrop={true}
        isOpen={isOverlay}
        onClose={() => {
          setIsOverlay(false)
          dispatch.allusers.update({
            isShow: '',
            userData: '',
          })
        }}>
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

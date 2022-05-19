import { useEffect } from 'react'
import { connect } from 'react-redux'
import { List, Row, Col, Avatar, Icon, Loader } from 'uiw'
import styles from './index.module.less'
import MembersProjectBox from './MembersProjectBox'
import './index.css'

// 成员公司及项目
const MembersProject = (props) => {
  const { dispatch, loading } = props
  const { UserList, cUser } = props.state

  useEffect(() => {
    dispatch.getUserList() // 初始化获取99条用户数据
  }, [dispatch])

  // 点击成员用户
  const listClick = async (item) => {
    await dispatch.update({ cUser: item })
    // 获取指定角色的公司与项目
    // dispatch.getUserCompanyProjects()
  }

  return (
    <div className={styles.membersProject}>
      <Row className="roleMembersProject">
        <Col span="4" className={styles.roleList}>
          <Loader
            tip="公司列表加载中..."
            vertical
            style={{ width: '100%' }}
            loading={loading.effects.allusers.getUserList}
            className="allRoleList">
            <List
              header={
                <div className={styles.roleTitle}>
                  选择角色
                  <span className={styles.roleNumber}>{UserList.length}</span>
                </div>
              }
              dataSource={UserList}
              noHover={true}
              renderItem={(item) => {
                return (
                  <List.Item
                    onClick={() => listClick(item)}
                    active={item.id === cUser.id}>
                    <div className={styles.roleListitem}>
                      <span className={styles.roleInfo}>
                        <Avatar
                          src={
                            item.uuid
                              ? `/api/file/selectFile/${item.uuid}`
                              : item.path
                          }
                          className={styles.roleAvatar}>
                          {item.userName}
                        </Avatar>
                        <span>{item.userName}</span>
                      </span>
                      <Icon
                        type={
                          item.id === cUser.id
                            ? 'right-square'
                            : 'right-square-o'
                        }
                      />
                    </div>
                  </List.Item>
                )
              }}
            />
          </Loader>
        </Col>
        <Col span="20">{cUser.id && <MembersProjectBox />}</Col>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ allusers, loading }) => ({
  state: allusers,
  loading: loading,
})

const mapDispatchToProps = ({ allusers }) => ({
  dispatch: allusers,
})

export default connect(mapStateToProps, mapDispatchToProps)(MembersProject)

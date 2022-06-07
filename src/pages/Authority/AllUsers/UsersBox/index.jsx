import { Divider, Icon, Card, Row, Col, Button, Tooltip, Avatar } from 'uiw'
import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import styles from './index.module.less'
import DeletePopover from './DeletePopover'
import { useSelector } from 'react-redux'
import { guid } from '../../../../utils/utils'
import { Fragment } from 'react'

const UsersBox = (props) => {
  const {
    routeManagement: { userInfoName },
  } = useSelector((state) => state)
  const { data, handleEdit, pageSize } = props
  const navigate = useNavigate()
  // const { dictionary } = useSelector((state) => state)

  // 性别图标
  const gender = (sex) => {
    if (sex === '0') return <Icon type="woman" className={styles.woman} />
    else if (sex === '1') return <Icon type="man" className={styles.man} />
    else return
  }

  // // 处理职位标签
  // const userPositionBox = (num) => {
  //   let arr = {}
  //   for (let index = 0; index < dictionary.dictAllData.length; index++) {
  //     const item = dictionary.dictAllData[index]
  //     arr[item.dictCode] = { value: item.dictName, color: item.dictColour }
  //   }
  //   return (
  //     <span
  //       style={{
  //         background: arr[num]?.color,
  //         boxShadow: `0 0 2px 1px ${arr[num]?.color}`,
  //       }}
  //       className={`${styles.position}`}>
  //       {arr[num]?.value}
  //     </span>
  //   )
  // }

  // const convertUrls = (userId) => {
  //   const result = memberAvatarArr.filter((item) => item.id === userId.id)
  //   return result?.length && result[0].url
  // }
  return (
    <div className={styles.content}>
      {data?.map((item) => {
        return (
          <div className={styles.userBoxFather} key={item.userId}>
            <Card className={styles.userBox}>
              <div className={styles.userBoxChild}>
                <Row>
                  <Col span="6" className={styles.userHead}>
                    <Avatar
                      src={
                        item.avatar
                          ? `/api/file/selectFile/${item.avatar}`
                          : item.path
                      }>
                      {item?.nickName[0]}
                    </Avatar>
                  </Col>
                  <Col span="18">
                    <Row>
                      <div
                        className={styles.userName}
                        style={{ paddingBottom: 10 }}
                        onClick={() => navigate(`/${item.userName}`)}>
                        {item.nickName}
                        <span>{gender(item.sex)}</span>
                      </div>
                    </Row>
                    {/* <Row>
                      <div className={styles.userId}>
                        {item.roleIds &&
                          userPositionBox(item.roleIds)}
                      </div>
                    </Row> */}
                    <Row className={styles.buttonGroup}>
                      <Col span="6">
                        <AuthBtn path="/api/system/user/edit">
                          <Tooltip placement="top" content="编辑">
                            {userInfoName !== item.userName ? (
                              <Button
                                icon="edit"
                                type="light"
                                size="small"
                                // type 1 : 查看 2 : 编辑 3 :新增
                                onClick={() => handleEdit(item, 2)}></Button>
                            ) : (
                              ''
                            )}
                          </Tooltip>
                        </AuthBtn>
                      </Col>
                      <Col span="6">
                        <AuthBtn path="/api/managerUser/queryById">
                          <Tooltip placement="top" content="详情">
                            <Button
                              icon="more"
                              type="light"
                              size="small"
                              // type 1 : 查看 2 : 编辑 3 :新增
                              onClick={() =>
                                navigate(`/${item.userName}`)
                              }></Button>
                          </Tooltip>
                        </AuthBtn>
                      </Col>
                      <Col span="6">
                        <AuthBtn path="/api/managerUser/deleteById">
                          <DeletePopover handleEdit={handleEdit} data={item} />
                        </AuthBtn>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Divider />
                <Row className={styles.info}>
                  <Col span="6" className={styles.infoName}>
                    <Icon type="user" style={{ marginRight: 3 }} /> 帐号:
                  </Col>
                  <Col span="18" className={styles.infoCon}>
                    {item.userName}
                  </Col>
                </Row>
                <Row className={styles.info}>
                  <Col span="6" className={styles.infoName}>
                    <Icon type="mobile" style={{ marginRight: 3 }} /> 手机:
                  </Col>
                  <Col span="18" className={styles.infoCon}>
                    {item.phonenumber}
                  </Col>
                </Row>
                <Row className={styles.info}>
                  <Col span="6" className={styles.infoName}>
                    <Icon type="mail-o" style={{ marginRight: 3 }} /> 邮箱：
                  </Col>
                  <Col span="18" className={styles.infoCon}>
                    {item.email}
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        )
      })}
      {/* 👇辅助布局使用👇 */}
      {data?.map((_, index, arr) => {
        if (arr.length !== pageSize || arr.length !== pageSize / 2)
          return (
            <Fragment key={guid()}>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
              <i key={guid()} className={styles.auxiliaryLayout}></i>
            </Fragment>
          )
        return null
      })}
    </div>
  )
}

export default UsersBox

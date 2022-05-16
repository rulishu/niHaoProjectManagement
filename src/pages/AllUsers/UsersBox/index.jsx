import { Divider, Icon, Card, Row, Col, Button, Tooltip, Avatar } from 'uiw'
import { useSelector } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import styles from './index.module.less'
import DeletePopover from './DeletePopover'

const UsersBox = (props) => {
  const { data, handleEdit } = props

  const { dictionary } = useSelector((state) => state)

  // 性别图标
  const gender = (sex) => {
    if (sex === 0) return <Icon type="woman" className={styles.woman} />
    else if (sex === 1) return <Icon type="man" className={styles.man} />
    else return
  }

  // 处理职位标签
  const userPositionBox = (num) => {
    let arr = {}
    for (let index = 0; index < dictionary.dictAllData.length; index++) {
      const item = dictionary.dictAllData[index]
      arr[item.dictCode] = { value: item.dictName, color: item.dictColour }
    }
    return (
      <span
        style={{
          background: arr[num]?.color,
          boxShadow: `0 0 2px 1px ${arr[num]?.color}`,
        }}
        className={`${styles.position}`}>
        {arr[num]?.value}
      </span>
    )
  }

  // const convertUrls = (userId) => {
  //   const result = memberAvatarArr.filter((item) => item.id === userId.id)
  //   return result?.length && result[0].url
  // }

  return (
    <div className={styles.content}>
      {data.map((item) => {
        return (
          <div className={styles.userBoxFather} key={item.id}>
            <Card className={styles.userBox}>
              <div className={styles.userBoxChild}>
                <Row>
                  <Col span="6" className={styles.userHead}>
                    {/* <Avatar src={item.path || null}>{item.userName}</Avatar> */}
                    {/* <Avatar
                      src={
                        memberAvatarArr?.length &&
                        item.path &&
                        convertUrls(item)
                      }> */}
                    <Avatar
                      src={
                        item.uuid
                          ? `/api/file/selectFile/${item.uuid}`
                          : item.path
                      }>
                      {item.userName}
                    </Avatar>
                  </Col>
                  <Col span="18">
                    <Row>
                      <div className={styles.userName}>
                        {item.userName}
                        <span>{gender(item.sex)}</span>
                      </div>
                    </Row>
                    <Row>
                      <div className={styles.userId}>
                        {item.userPosition &&
                          userPositionBox(item.userPosition)}
                        ID:{item.id}
                      </div>
                    </Row>
                    <Row className={styles.buttonGroup}>
                      <Col span="6">
                        <AuthBtn path="/api/managerUser/edit">
                          <Tooltip placement="top" content="编辑">
                            <Button
                              icon="edit"
                              type="light"
                              size="small"
                              // type 1 : 查看 2 : 编辑 3 :新增
                              onClick={() => handleEdit(item, 2)}></Button>
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
                              onClick={() => handleEdit(item, 1)}></Button>
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
                    <Icon type="user" /> 账号:
                  </Col>
                  <Col span="18" className={styles.infoCon}>
                    {item.userAccount}
                  </Col>
                </Row>
                <Row className={styles.info}>
                  <Col span="6" className={styles.infoName}>
                    <Icon type="mobile" /> 手机:
                  </Col>
                  <Col span="18" className={styles.infoCon}>
                    {item.userPhone}
                  </Col>
                </Row>
                <Row className={styles.info}>
                  <Col span="6" className={styles.infoName}>
                    <Icon type="mail-o" /> 邮箱：
                  </Col>
                  <Col span="18" className={styles.infoCon}>
                    {item.userEmail}
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        )
      })}
      {/* 👇辅助布局使用👇 */}
      {data.map((_, index) => {
        if (index !== 0)
          return <i key={index} className={styles.auxiliaryLayout}></i>
        return null
      })}
    </div>
  )
}

export default UsersBox

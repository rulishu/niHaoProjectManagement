import { useState, useEffect } from 'react'
import { Card, Row, Col, Input, Button, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import MemberBox from './MemberBox'
import styles from './index.module.less'

const TeamItem = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const {
    team: { teamData },
    allusers: { UserList },
    loading,
  } = useSelector((state) => state)

  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    dispatch({
      type: 'team/getMemberByTeamId',
      payload: { teamId: location.pathname.split('/')[3] },
    })
    dispatch({
      type: 'team/getTeamInfoById',
      payload: { id: location.pathname.split('/')[3] },
    })
    dispatch({ type: 'allusers/getUserList', payload: {} })
  }, [dispatch, location.pathname])

  // 保存编辑
  const saveEdit = (value) => {
    console.log('value===>', value)
  }

  return (
    <div className={styles.teamItem}>
      <Row style={{ width: '100%' }}>
        <Col span="18">
          <div className={styles.teamItemLeft}>
            <Card>
              <div className={styles.switchTeam}>
                <div>请选择团队</div>
                <Input placeholder="请输入内容" style={{ maxWidth: 200 }} />
              </div>
            </Card>
            <Card>
              <div className={styles.memberTabHead}>
                <div className={styles.headTitle}>
                  {isEdit ? '成员管理' : '团队成员'}
                </div>
                {!isEdit && (
                  <Button type="primary" onClick={() => setIsEdit(true)}>
                    成员管理
                  </Button>
                )}
              </div>
              <Loader loading={loading.effects.team?.getMemberByTeamId}>
                <MemberBox
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  saveEdit={saveEdit}
                  userList={UserList}
                />
              </Loader>
            </Card>
          </div>
        </Col>
        <Col span="6">
          <Card className={styles.teamItemRingth}>
            <div>{teamData.id}</div>
            <div>{teamData.projectId}</div>
            <div>{teamData.createTime}</div>
            <div>{teamData.teamName}</div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default TeamItem

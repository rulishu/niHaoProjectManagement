import { useEffect } from 'react'
import { List, Row, Col, Button } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const TeamManagement = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    team: { dataList },
    // loading,
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch({ type: 'projectAuth/getall', payload: {} })
  }, [dispatch])

  const goTeamItem = (item) => {
    dispatch({ type: 'team/update', payload: { teamData: item } })
    navigate(`/team/teamItem/${item.id}`, { state: {} })
  }

  const ListHeader = (
    <Row style={{ width: '100%', fontWeight: 'bold' }}>
      <Col span="2">ID</Col>
      <Col span="4">项目ID</Col>
      <Col span="10">团队名称</Col>
      <Col span="4">创建时间</Col>
      <Col span="4">操作</Col>
    </Row>
  )

  return (
    <div className={styles.teamManagement}>
      <div>
        <Button type="primary">新增团队</Button>
      </div>
      <List
        dataSource={dataList}
        header={ListHeader}
        renderItem={(item) => {
          return (
            <List.Item>
              <div className={styles.teamItem}>
                <Row style={{ width: '100%' }}>
                  <Col span="2">{item?.id}</Col>
                  <Col span="4">{item?.projectId}</Col>
                  <Col span="10" onClick={() => goTeamItem(item)}>
                    {item?.teamName}
                  </Col>
                  <Col span="4">{item?.createTime}</Col>
                  <Col span="4" className={styles.handle}>
                    <Button icon="edit" basic size="small" type="primary">
                      编辑
                    </Button>
                    <Button icon="delete" basic size="small" type="danger">
                      删除
                    </Button>
                  </Col>
                </Row>
              </div>
            </List.Item>
          )
        }}
      />
    </div>
  )
}

export default TeamManagement

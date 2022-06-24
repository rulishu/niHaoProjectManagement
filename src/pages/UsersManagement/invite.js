import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './index.module.less'
import {
  Tabs,
  Button,
  Modal,
  Form,
  Row,
  Col,
  SearchSelect,
  DateInput,
  Notify,
} from 'uiw'
import { useParams } from 'react-router-dom'
import formatter from '@uiw/formatter'

const Invite = () => {
  const dispatch = useDispatch()
  const form = useRef()
  const { projectId } = useParams()
  const {
    usersManagement: {
      total,
      activeKey,
      modalVisible,
      modalTitle,
      userList,
      groupList,
      userIdList,
    },
  } = useSelector((state) => state)
  useEffect(() => {
    dispatch({
      type: 'usersManagement/queryFuzzyAllUser',
    })
  }, [dispatch])
  //邀请团队、成员-模糊查询
  const handleSearch = (e) => {
    setTimeout(() => {
      const filterOpion = groupList?.filter(
        (item) => !!item.label.includes(e.trim())
      )
      updateData({
        groupList: [...filterOpion],
      })
    }, 500)
  }
  // Tabs标签
  const tabsLabel = (title, num) => {
    return (
      <>
        <span className={styles.tabsLabelTitle}>{title}</span>
        <span className={styles.tabsLabelNum}>{num || 0}</span>
      </>
    )
  }
  const updateData = (payload) => {
    dispatch({
      type: 'usersManagement/updateState',
      payload,
    })
  }
  const invite = (type) => {
    const userIds = userIdList.map((item) => item.value)
    type === 'team' &&
      dispatch.usersManagement.fuzzyNameS({
        userIds: userIds,
      })
    updateData({
      modalVisible: true,
      modalTitle: type === 'member' ? '邀请成员' : '邀请团队',
    })
  }
  const closeVisible = () => {
    updateData({
      modalVisible: false,
      modalTitle: '',
    })
  }
  const options = [
    { label: '开发', value: 1 },
    { label: '测试', value: 2 },
    { label: '项目管理者', value: 3 },
  ]
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
  // 执行成功返回的信息
  const information = (data) => {
    if (data?.code === 200) {
      closeVisible()
      onSearch()
      Notify.success({ title: data?.message || '' })
    }
  }
  const submitData = (current) => {
    // 邀请成员
    if (modalTitle === '邀请成员') {
      let userId = current.userId.map((a) => a.value)
      const payload = {
        ...current,
        userId: Number(userId),
        memberRole: Number(current?.memberRole),
        accessExpirationTime: formatter(
          'YYYY-MM-DD',
          current?.accessExpirationTime
        ),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/inviteMember',
        payload,
      }).then((data) => information(data))
    }
    // 邀请团队
    if (modalTitle === '邀请团队') {
      let teamId = current.teamId.map((a) => a.value)
      const payload = {
        ...current,
        teamId: Number(teamId),
        memberRole: Number(current?.memberRole),
        accessExpirationTime: formatter(
          'YYYY-MM-DD',
          current?.accessExpirationTime
        ),
        projectId: projectId,
      }
      dispatch({
        type: 'usersManagement/inviteTeam',
        payload,
      }).then((data) => information(data))
    }
  }
  return (
    <div className={styles.topInvite}>
      <Tabs type="line" activeKey={activeKey}>
        <Tabs.Pane label={tabsLabel('成员', total)} key="1" />
      </Tabs>
      <div className={styles.topButton}>
        <Button icon="user-add" type="primary" onClick={() => invite('member')}>
          邀请成员
        </Button>
        <Button
          icon="usergroup-add"
          type="primary"
          onClick={() => invite('team')}>
          邀请团队
        </Button>
      </div>
      <Modal
        title={modalTitle}
        isOpen={modalVisible}
        useButton={false}
        icon="information"
        type="primary"
        onClosed={() => closeVisible()}
        width={500}>
        <Form
          ref={form}
          onSubmit={({ initial, current }) => submitData(current)}
          onSubmitError={(error) => {
            if (error.filed) {
              return { ...error.filed }
            }
            return null
          }}
          fields={{
            userId: {
              label: '按账户姓名邮箱搜索',
              children: (
                <SearchSelect
                  option={userList}
                  labelInValue={true}
                  showSearch={true}
                  allowClear={true}
                  placeholder={'按账户姓名邮箱搜索'}
                  onSearch={(e) => {
                    dispatch.usersManagement.searchUser(e)
                  }}
                />
              ),
            },
            teamId: {
              label: '邀请团队',
              children: (
                <SearchSelect
                  option={groupList}
                  labelInValue={true}
                  showSearch={true}
                  allowClear={true}
                  placeholder={'按账户姓名邮箱搜索'}
                  onSearch={(e) => {
                    handleSearch(e)
                  }}
                />
              ),
            },
            memberRole: {
              label: '成员角色',
              children: (
                <SearchSelect
                  option={options}
                  mode="single"
                  placeholder="请选择成员角色"
                />
              ),
            },
            accessExpirationTime: {
              label: '授予到期时间',
              children: (
                <DateInput
                  placeholder="请输入访问到期日期"
                  format="YYYY-MM-DD"
                />
              ),
            },
          }}>
          {({ fields, state, canSubmit }) => {
            return (
              <div>
                <Row gutter={10}>
                  <Col>
                    {modalTitle === '邀请成员' ? fields.userId : fields.teamId}
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.memberRole}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.accessExpirationTime}</Col>
                </Row>
              </div>
            )
          }}
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            style={{ width: 80 }}
            onClick={() => form.current.onSubmit()}
            type="primary">
            保存
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default Invite

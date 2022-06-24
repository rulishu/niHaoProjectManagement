import { Fragment, useState } from 'react'
import { List, Button, Empty, Drawer, Avatar } from 'uiw'
import formatter from '@uiw/formatter'
import DrawerBox from './DrawerBox'
import styles from './index.module.less'
// import { useNavigate } from 'react-router-dom'

const TabBox = (props) => {
  const { data, type } = props

  const [isDrawer, setIsDrawer] = useState(false)
  const [drawerType, setDrawerType] = useState(false)
  const [drawerCon, setDrawerCon] = useState({})
  // const navigate = useNavigate()

  const ListDataObj = (data) => {
    const dataObj = {
      issues: (value) => taskBox(value),
      labels: (value) => labelBox(value),
      member: (value) => memberBox(value),
      milestone: (value) => milestoneBox(value),
    }
    return <div className={styles.LiItemContent}>{dataObj?.[type]?.(data)}</div>
  }

  // 打开抽屉
  const openDrawer = (value, type) => {
    setIsDrawer(true)
    setDrawerCon(value)
    setDrawerType(type)
  }

  // 任务板块
  const taskBox = (value) => {
    return (
      <div className={styles.taskBox}>
        <div className={styles.taskBoxLeft}>
          <div>
            <span
              className={styles.taskTitle}
              onClick={() => openDrawer(value, 'issues')}>
              {value.title}
            </span>
            <span className={styles.taskState}>{value.state}</span>
          </div>
          <div>by:{value.author.name}</div>
        </div>
        <div>
          <Button
            basic
            type="light"
            onClick={() => openDrawer(value, 'issues')}>
            详情
          </Button>
        </div>
      </div>
    )
  }

  // 标签板块
  const labelBox = (value) => {
    return (
      <div className={styles.labelBox}>
        <p style={{ backgroundColor: value?.color }}>
          <span>{value?.name}</span>
        </p>
      </div>
    )
  }

  // 人员板块
  const memberBox = (value) => {
    return (
      <div
        className={styles.memberBox}
        // style={{cursor: 'pointer'}}
        // onClick={() => {
        //   navigate(`/${value.username}`)
        // }}
      >
        <div className={styles.memberBoxLeft}>
          <div className={styles.memberAvatar}>
            <Avatar src={value.avatarUrl}>{value.name[0]}</Avatar>
          </div>
          <div className={styles.memberAccount}>
            <span className={styles.name}>{value.name}</span>
            <span className={styles.username}>{value.username}</span>
          </div>
        </div>
        <div className={styles.memberBoxRight}>
          <div className={styles.membersRole}>
            最大角色：{value.access_level}
          </div>
          <div className={styles.membersCreatedAt}>
            创建日期：{formatter('YYYY年MM月DD日', new Date(value.createdAt))}
          </div>
        </div>
      </div>
    )
  }

  // 里程碑板块
  const milestoneBox = (value) => {
    return (
      <div className={styles.milestoneBox}>
        <div className={styles.milestoneBoxLeft}>
          <div
            className={styles.title}
            onClick={() => openDrawer(value, 'milestone')}>
            {value?.title}
          </div>
          <div className={styles.time}>
            {value.start_date &&
              formatter('YYYY年MM月DD日', new Date(value.start_date)) +
                '-' +
                formatter('YYYY年MM月DD日', new Date(value.due_date))}
          </div>
        </div>
      </div>
    )
  }

  // // 列表头部
  // const listHeader = () => {
  //   const obj = {
  //     issues: { title: '任务' },
  //     labels: { title: '标签' },
  //     member: { title: '人员' },
  //     milestone: { title: '里程碑', requestPath: 'migrateProjectDataById' },
  //   }
  // }

  return (
    <Fragment>
      <div>
        {data?.length ? (
          <List
            // header={listHeader()}
            dataSource={data}
            renderItem={(item, index) => {
              return <List.Item key={index}>{ListDataObj(item)}</List.Item>
            }}
          />
        ) : (
          <Empty />
        )}
      </div>
      <Drawer
        title={
          drawerType === 'issues'
            ? '任务详情'
            : drawerType === 'milestone'
            ? '里程碑详情'
            : ''
        }
        isOpen={isDrawer}
        onClose={() => setIsDrawer(false)}
        size={800}>
        <div>
          <DrawerBox data={drawerCon} type={drawerType} />
        </div>
      </Drawer>
    </Fragment>
  )
}

export default TabBox

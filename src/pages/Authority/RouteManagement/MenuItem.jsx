// import { useState } from 'react'
import { List, Row, Col, Icon } from 'uiw'
// import { StatusTag } from '@/components'
import styles from './index.module.less'

const MenuItem = (props) => {
  const { dataList, buttonGroup } = props

  // const [show, setShow] = useState(false)
  // 是否显示
  // const butClick = () => setShow(!show)

  // const statusList = {
  //   1: { title: '目录', className: 'blue' },
  //   2: { title: '菜单', className: 'red' },
  //   3: { title: '按钮', className: 'brown' },
  // }

  // const retract = () => {
  //   let nodeList = new Array(tier !== -1 ? tier : 0)
  //   for (let i = 0; i < nodeList.length; i++) {
  //     nodeList[i] = (
  //       <span key={i} className={tier !== -1 && styles.retract}></span>
  //     )
  //   }
  //   return nodeList
  // }

  return (
    <List.Item
      key={dataList.id}
      style={{ width: '100%' }}
      className={styles.listMenuItem}>
      <Row className={styles.menuItem}>
        {/* <Col span="6">
          <span className="menuItemTitle">
            {retract()}
            {!!dataList.managerMenus.length && (
              <Icon
                type={show ? 'minus-square-o' : 'plus-square-o'}
                color="#008ef0"
                className={styles.titleIcon}
                onClick={butClick}
              />
            )}
            {dataList.menuName}
          </span>
        </Col> */}
        <Col span="2">
          <Icon type={dataList.icon} />
        </Col>
        <Col span="10">{dataList.path}</Col>
        <Col span="2">
          {/* <StatusTag statusList={statusList} status={dataList.menuType} /> */}
        </Col>
        <Col span="4">{buttonGroup(dataList)}</Col>
      </Row>
      {/* {show && dataList.managerMenus.length && (
        <div className="menuListItem">
          <Row className={styles.menuItem}>
            <List
              style={{ width: '100%' }}
              bordered={false}
              dataSource={dataList.managerMenus}
              renderItem={(item) => {
                return (
                  <MenuItem
                    dataList={item}
                    buttonGroup={buttonGroup}
                    tier={tier !== -1 ? tier + 1 : tier}
                  />
                )
              }}
            />
          </Row>
        </div>
      )} */}
    </List.Item>
  )
}

export default MenuItem

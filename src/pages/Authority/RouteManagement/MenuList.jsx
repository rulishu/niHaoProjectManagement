import { useEffect, useState } from 'react'
import { List, Button, Row, Col, Tooltip, Affix, Alert } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import { AuthBtn } from '@uiw-admin/authorized'
import MenuForm from './MenuForm'
import MenuItem from './MenuItem'
import styles from './index.module.less'
import './index.css'

function MenuList() {
  const {
    routeManagement: { routeMenuList },
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'routeManagement/getRouteMenu',
      payload: {},
    })
  }, [dispatch])

  // const [tier, setTier] = useState(0)
  const [openAlert, setOpenAlert] = useState(false)
  const [childrenId, setChildrenId] = useState()

  const buttonGroup = (item) => {
    const butList = [
      { label: '添加', icon: 'plus', type: 1, path: '/api/menu/addMenu' },
      { label: '编辑', icon: 'edit', type: 2, path: '/api/menu/updateMenu' },
      {
        label: '删除',
        icon: 'delete',
        butType: 'danger',
        type: 3,
        path: '/api/menu/deleteById',
      },
    ]
    return butList.map((itemA, index) => {
      return (
        <AuthBtn path={itemA.path} key={index}>
          <Tooltip content={<label>{itemA.label}</label>}>
            <Button
              icon={itemA.icon}
              basic
              type={itemA.butType || 'primary'}
              onClick={() => addChildren(item, itemA.type)}
            />
          </Tooltip>
        </AuthBtn>
      )
    })
  }

  // type 1: 新增 2 编辑
  const addChildren = async (menuItemData, fromType) => {
    // 新增 || 编辑
    if (fromType !== 3) {
      dispatch({
        type: 'routeManagement/update',
        payload: {
          isOpenModal: true,
          menuItemData,
          fromType,
        },
      })
    }
    // 删除
    if (fromType === 3) {
      await setOpenAlert(true)
      await setChildrenId(menuItemData.id)
    }
  }

  const delChildren = async (id) => {
    await dispatch({
      type: 'routeManagement/deleteById',
      payload: { id },
    })
  }

  return (
    <div className="menuListContainer">
      <Affix
        offsetTop={60}
        className={styles.addMenuBut}
        style={{ textAlign: 'right' }}>
        {/* <Button type="primary" onClick={() => setTier(tier === 0 ? -1 : 0)}>
          {tier === 0 ? '取消虚线' : '添加虚线'}
        </Button> */}
        <Button icon="plus" type="primary" onClick={() => addChildren({}, 1)}>
          新增路由
        </Button>
      </Affix>
      <Row>
        <Col span="24">
          <List
            header={
              <Affix offsetTop={60} className={styles.listHeader}>
                <Row>
                  <Col span="6" style={{ paddingLeft: '16px' }}>
                    菜单名称
                  </Col>
                  <Col span="2">菜单图标</Col>
                  <Col span="10">菜单路径</Col>
                  <Col span="2">菜单类型</Col>
                  <Col span="4">操作</Col>
                </Row>
              </Affix>
            }
            size="small"
            className={styles.menuList}
            dataSource={routeMenuList}
            renderItem={(item) => (
              <MenuItem dataList={item} buttonGroup={buttonGroup} tier={0} />
            )}
          />
        </Col>
      </Row>
      <MenuForm />
      <Alert
        isOpen={openAlert}
        confirmText="确定删除"
        cancelText="取消删除"
        icon="delete"
        type="danger"
        onConfirm={() => childrenId && delChildren(childrenId)}
        onCancel={() => setOpenAlert(false)}
        onClosed={() => setOpenAlert(false)}>
        <div>
          请谨慎删除，你确定要删除路由吗？
          <br />
          删除路由会导致不可估计的错误！！！
          <br />
          <strong>删除后数据不可恢复!</strong>
        </div>
      </Alert>
    </div>
  )
}

export default MenuList

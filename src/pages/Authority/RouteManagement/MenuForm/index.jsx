import { useDispatch, useSelector } from 'react-redux'
import { TheForm } from './TheForm'
import { Modal } from 'uiw'
import styles from './index.module.less'

const MenuForm = () => {
  const {
    routeManagement: { isOpenModal, menuItemData, fromType },
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  //提交按钮
  const onSubmit = async (current) => {
    const { parentId, id } = menuItemData
    await dispatch({
      type: 'routeManagement/update',
      payload: { fromData: current, id, parentId },
    })
    // 新增菜单
    if (fromType === 1) {
      await dispatch({
        type: 'routeManagement/addMenuData',
        payload: { parentId: id || null, ...current },
      })
    }
    // 编辑菜单
    if (fromType === 2) {
      await dispatch({
        type: 'routeManagement/editMenu',
        payload: { id, parentId, ...current },
      })
    }
  }

  return (
    <div className={styles.menuFrom}>
      {/* <TheForm onSubmit={onSubmit} menuItemData={menuItemData} fromType={fromType} /> */}
      <Modal
        useButton={false}
        isOpen={isOpenModal}
        onClosed={() => {
          dispatch({
            type: 'routeManagement/update',
            payload: { isOpenModal: false },
          })
        }}>
        <TheForm
          onSubmit={onSubmit}
          menuItemData={menuItemData}
          fromType={fromType}
        />
      </Modal>
    </div>
  )
}

export default MenuForm

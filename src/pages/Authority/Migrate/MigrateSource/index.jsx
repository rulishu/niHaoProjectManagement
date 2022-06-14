import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import { searchFun } from '@/utils/publicFun'
import { useNavigate } from 'react-router-dom'
import Detail from './Detail'
import { columns } from './item'
import MigrateConfig from './MigrateConfig'
import styles from './index.module.less'
import DeletePopover from '@/components/DeletePopover'

const MigrateSource = (props) => {
  const {
    migrate: {
      isOpen,
      ids,
      source,
      source: { dataInfo },
    },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const updateData = (payload) => {
    dispatch({
      type: 'migrate/updateState',
      payload,
    })
  }

  const [isVisible, setIsVisible] = useState(false)
  const [isConfig, setIsConfig] = useState(false)
  const [curData, setCurData] = useState()

  const token = localStorage.getItem('token')
  const table = useTable('/api/system/transfersource/selectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data?.total,
        data: data?.data?.rows,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (page, pageSize, formData) => {
      return { ...formData }
    },
    requestOptions: {
      headers: { Authorization: 'Bearer ' + token },
    },
  })

  // 打开配置
  // type  1：新增 2：编辑 3： 查看
  const getDataByIdSource = async (id, type) => {
    setCurData(type !== 1 ? id : 0)
    setIsVisible(true)
    await dispatch({
      type: 'migrate/updateState',
      payload: {
        source: { ...source, type, dataInfo: type === 1 ? {} : dataInfo },
      },
    })
    type !== 1 &&
      (await dispatch({
        type: 'migrate/getDataByIdSource',
        payload: id,
      }))
  }

  // 删除迁移配置
  const delDatSource = (id) => {
    updateData({
      isOpen: true,
      ids: id,
    })
  }

  //删除确定
  const onConfirm = async () => {
    await dispatch({
      type: 'migrate/delDataByIdSource',
      payload: ids,
    })
    await table?.onRefersh()
  }

  //删除取消
  const onClosed = () => {
    updateData({ isOpen: false })
  }

  // 同步数据
  const synchrodata = async (rowData) => {
    const callback = () => navigate('/Authority/migrate/control')
    await dispatch?.migrate?.synchronizationControl({
      param: rowData.id,
      callback,
    })
  }

  return (
    <Fragment>
      <Card>
        <DeletePopover
          isOpen={isOpen}
          onConfirm={() => onConfirm()}
          onClosed={() => onClosed()}
        />
        <div className={styles.wrap}>
          <>
            <ProTable
              // 操作栏按钮
              operateButtons={[
                {
                  label: '新增',
                  type: 'primary',
                  icon: 'plus',
                  onClick: () => getDataByIdSource({}, 1),
                },
                {
                  label: '第三方迁移配置',
                  type: 'success',
                  icon: 'setting',
                  style: { float: 'right' },
                  onClick: () => setIsConfig(true),
                },
              ]}
              // 搜索栏按钮
              searchBtns={searchFun(table)}
              className="menuTable"
              table={table}
              columns={columns({
                getDataByIdSource,
                delDatSource,
                synchrodata,
                loading,
              })}
            />
          </>
        </div>
      </Card>
      <Detail
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        dataInfo={dataInfo}
        curData={curData}
        table={table}
      />
      <MigrateConfig isConfig={isConfig} setIsConfig={setIsConfig} />
    </Fragment>
  )
}

export default MigrateSource

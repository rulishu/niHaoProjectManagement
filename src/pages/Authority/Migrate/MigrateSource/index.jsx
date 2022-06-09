import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.module.less'
import { searchFun } from '@/utils/publicFun'
import Detail from './Detail'

const MigrateSource = (props) => {
  const {
    migrate: {
      source,
      source: { dataInfo },
    },
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  const [isVisible, setIsVisible] = useState(false)
  const [curData, setCurData] = useState()

  const token = localStorage.getItem('token')
  const table = useTable('/api/system/transfersource/selectPage', {
    // 格式化接口返回的数据，必须返回{total 总数, data: 列表数据}的格式
    formatData: (data) => {
      return {
        total: data?.data,
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
      payload: { source: { ...source, type } },
    })
    type !== 1 &&
      (await dispatch({
        type: 'migrate/getDataByIdSource',
        payload: id,
      }))
  }

  // 删除迁移配置
  const delDatSource = async (id) => {
    await dispatch({
      type: 'migrate/delDataByIdSource',
      payload: id,
    })
    await table?.onRefersh()
  }

  // 同步数据
  const synchrodata = async (rowData) => {
    console.log('synchrodata', rowData)
    await dispatch({
      type: 'migrate/synchronizationControl',
      payload: rowData.id,
    })
  }

  return (
    <Fragment>
      <Card>
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
              ]}
              paginationProps={{ style: { display: 'none' } }}
              // 搜索栏按钮
              searchBtns={searchFun(table)}
              className="menuTable"
              table={table}
              columns={[
                {
                  title: '迁移源名称',
                  key: 'name',
                  width: 200,
                  props: {
                    widget: 'input',
                    widgetProps: {
                      placeholder: '请输入迁移源名称',
                    },
                  },
                },
                {
                  title: '迁移源类型',
                  key: 'type',
                  width: 120,
                  ellipsis: true,
                  align: 'center',
                },
                {
                  title: '迁移源地址',
                  key: 'url',
                  width: 220,
                  ellipsis: true,
                  align: 'center',
                },
                {
                  title: '创建时间',
                  key: 'createTime',
                  width: 180,
                  ellipsis: true,
                  align: 'center',
                },
                {
                  title: '更新时间',
                  key: 'updateTime',
                  width: 180,
                  ellipsis: true,
                  align: 'center',
                },
                {
                  title: '备注',
                  key: 'remark',
                  ellipsis: true,
                  align: 'center',
                },
                {
                  title: '操作',
                  key: 'edit',
                  width: 300,
                  align: 'center',
                  render: (text, key, rowData) => {
                    // console.log(text, key, rowData);
                    return (
                      <div>
                        <Button
                          size="small"
                          type="success"
                          icon="eye-o"
                          onClick={() => getDataByIdSource(rowData.id, 3)}
                        />
                        <Button
                          size="small"
                          type="primary"
                          icon="edit"
                          onClick={() => getDataByIdSource(rowData.id, 2)}
                        />
                        <Button
                          size="small"
                          type="danger"
                          icon="delete"
                          onClick={() => delDatSource(rowData.id)}
                        />
                        <Button
                          size="small"
                          type="warning"
                          icon="reload"
                          onClick={() => synchrodata(rowData)}>
                          同步项目数据
                        </Button>
                      </div>
                    )
                  },
                },
              ]}
            />
          </>
        </div>
      </Card>
      <Detail
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        dataInfo={dataInfo}
        curData={curData}
      />
    </Fragment>
  )
}

export default MigrateSource

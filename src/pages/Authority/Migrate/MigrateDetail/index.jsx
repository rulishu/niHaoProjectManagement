import { useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Loader, Button } from 'uiw'
import styles from './index.module.less'

const MigrateDetail = (props) => {
  const {
    migrate: {
      detail: { listData },
    },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'migrate/getPagingDataDetail' })
  }, [dispatch])

  console.log('数据迁移明细====>', listData)

  return (
    <Fragment>
      <Card>
        <div className={styles.wrap}>
          <Button>同步更新</Button>
          <Loader
            loading={loading.effects.migrate.getPagingDataDetail}
            style={{ width: '100%' }}
            tip="loading...">
            <div>数据迁移日志</div>
          </Loader>
        </div>
      </Card>
    </Fragment>
  )
}

export default MigrateDetail

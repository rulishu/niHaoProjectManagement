import { useState, useEffect, Fragment } from 'react'
import { ProDrawer } from '@uiw-admin/components'
import { Card, Button, Loader } from 'uiw'
import { useSelector, useDispatch } from 'react-redux'

// GitLab第三方迁移配置
const Config = (props) => {
  const {
    migrate: { loginConfig },
    loading,
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  // 配置第三方迁移表单
  const [isCfgForm, setIsCfgForm] = useState(false)
  useEffect(() => {
    dispatch({ type: 'migrate/getConfigControl' })
  }, [dispatch])

  const setConfigControl = (data) => {
    setIsCfgForm(true)
    dispatch({
      type: 'migrate/setConfigControl',
      payload: data,
    })
  }

  console.log('loginConfig====>', loginConfig)

  return (
    <Fragment>
      <Card>
        <Button onClick={() => setIsCfgForm(true)}>
          设置GitLab第三方迁移配置
        </Button>
        <ProDrawer
          visible={isCfgForm}
          onClose={() => setIsCfgForm(false)}
          buttons={[
            {
              label: '取消',
              type: 'primary',
              onClick: () => setIsCfgForm(false),
            },
            {
              label: '保存',
              type: 'primary',
              onClick: () => {
                setConfigControl()
              },
              path: '/demo/drawer',
            },
          ]}>
          <div>
            <Loader
              loading={loading.effects.migrate.getConfigControl}
              style={{ width: '100%' }}
              tip="loading...">
              <div>数据 集成了Button</div>
            </Loader>
          </div>
        </ProDrawer>
      </Card>
    </Fragment>
  )
}

export default Config

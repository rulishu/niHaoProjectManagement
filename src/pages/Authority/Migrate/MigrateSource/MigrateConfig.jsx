import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Collapse } from 'uiw'
import { ProForm, useForm } from '@uiw-admin/components'
import styles from './index.module.less'
import { configItem } from './item'

const Panel = Collapse.Panel

const MigrateConfig = (props) => {
  const {
    migrate: { loginConfig },
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { isConfig, setIsConfig } = props

  const form = useForm()

  // 获取配置信息
  useEffect(() => {
    dispatch({ type: 'migrate/getConfigControl' })
  }, [dispatch])

  // 设置第三方迁移配置
  const setConfigControl = async (payload) => {
    await dispatch({ type: 'migrate/setConfigControl', payload })
  }

  return (
    <div>
      <Modal
        title="第三方迁移配置"
        isOpen={isConfig}
        icon="setting"
        type="primary"
        maxWidth={800}
        useButton={false}
        onClosed={() => setIsConfig(false)}>
        <div className={styles.configForm}>
          <Collapse accordion bordered={true} activeKey={['1']}>
            <Panel header="GitLab配置" key="1">
              <ProForm
                formType="card"
                form={form}
                readOnlyProps={{ column: 1, layout: 'vertical' }}
                onSubmit={async () => {
                  const errors = form.getError()
                  if (errors && Object.keys(errors).length > 0) return
                  const value = form.getFieldValues?.()
                  await setConfigControl({
                    param: value,
                    callback: setIsConfig,
                  })
                }}
                formDatas={configItem(loginConfig, 1)}
                showSaveButton={true}
                showResetButton={true}
              />
            </Panel>
          </Collapse>
        </div>
      </Modal>
    </div>
  )
}

export default MigrateConfig

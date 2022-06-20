import { ProDrawer } from '@uiw-admin/components'
import { useSelector } from 'react-redux'
import { Loader, Descriptions } from 'uiw'

const sourceTypeObj = { 10: '项目', 20: 'issue', 30: '里程碑', 40: '标签' }

const Detail = (props) => {
  const {
    migrate: {
      detail: { dataInfo },
    },

    loading,
  } = useSelector((state) => state)
  const { isVisible, setIsVisible } = props

  return (
    <ProDrawer
      width={500}
      title={'迁移详细信息'}
      visible={isVisible}
      onClose={() => setIsVisible(false)}>
      <Loader
        loading={loading.effects.migrate.getDataByIdDetail}
        style={{ width: '100%' }}
        tip="loading...">
        <div>
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="迁移任务id" span={3}>
              {dataInfo.transferId}
            </Descriptions.Item>
            <Descriptions.Item label="迁移类型" span={3}>
              {sourceTypeObj[dataInfo.transferType]}
            </Descriptions.Item>
            <Descriptions.Item label="更新数量" span={3}>
              {dataInfo.updateNumber}
            </Descriptions.Item>
            <Descriptions.Item label="新增数量" span={3}>
              {dataInfo.addNumber}
            </Descriptions.Item>
            <Descriptions.Item label="最后的编号" span={3}>
              {dataInfo.fineCode}
            </Descriptions.Item>
            <Descriptions.Item label="创建人" span={3}>
              {' '}
              {dataInfo.createBy}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Loader>
    </ProDrawer>
  )
}

export default Detail

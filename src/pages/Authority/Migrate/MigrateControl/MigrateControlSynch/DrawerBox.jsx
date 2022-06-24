// import { useSelector, useDispatch } from 'react-redux'
import { Descriptions, Avatar, Divider } from 'uiw'
import MDEditor from '@uiw/react-md-editor'
import formatter from '@uiw/formatter'
import styles from './index.module.less'

const DrawerBox = (props) => {
  const { data, type } = props

  return (
    <div className={styles.drawerBox}>
      <div className={styles.title}>
        <h1>{data?.title}</h1>
        <span className={styles.taskState}>{data?.state}</span>
      </div>
      <Divider />
      <div>
        {type === 'issues' && (
          <Descriptions>
            <Descriptions.Item label="创建人">
              <div className={styles.founder}>
                <Avatar src={data?.author?.avatarUrl} size="mini">
                  {' '}
                  {data?.author?.name[0]}{' '}
                </Avatar>
                <span>{data?.author?.name}</span>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {formatter('YYYY年MM月DD日', new Date(data.created_at))}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {formatter('YYYY年MM月DD日', new Date(data.updated_at))}
            </Descriptions.Item>
            <Descriptions.Item label="web地址" span={3}>
              {data.web_url}
            </Descriptions.Item>
          </Descriptions>
        )}
        {type === 'milestone' && (
          <Descriptions>
            <Descriptions.Item label="开始时间">
              {formatter('YYYY年MM月DD日', new Date(data.start_date))}
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
      <Divider />
      <div className={styles.description}>
        <MDEditor
          style={{ boxShadow: 'none' }}
          value={data?.description || ''}
          hideToolbar={true}
          preview="preview"
          autoFocus={true}
          visiableDragbar={false}
        />
      </div>
    </div>
  )
}

export default DrawerBox

import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Card, Loader } from 'uiw'
import styles from './index.module.less'
import BasicInfo from './BasicInfo'
// import MembersProjectBox from '../MembersProject/MembersProjectBox'

const PopupBox = (props) => {
  const { state, type, setIsOverlay, dispatch, loading } = props

  useEffect(() => {
    if (type === 2) {
      // 获取指定角色的公司与项目
      // dispatch?.getUserCompanyProjects()
    }
  }, [dispatch, state.cUser, type])

  return (
    <div className={styles.content}>
      <Card style={{ width: '100%' }} title="用户基本信息">
        <div>
          <Loader
            tip="用户信息加载中..."
            vertical
            style={{ width: '100%' }}
            bgColor="rgba(0, 0, 0, 0.3)"
            loading={loading.effects.allusers.queryById}>
            <BasicInfo type={type} setIsOverlay={setIsOverlay} />
          </Loader>
        </div>
      </Card>
    </div>
  )
}

const mapStateToProps = ({ allusers, loading }) => ({
  state: allusers,
  loading: loading,
})

const mapDispatchToProps = ({ allusers }) => ({
  dispatch: allusers,
})

export default connect(mapStateToProps, mapDispatchToProps)(PopupBox)

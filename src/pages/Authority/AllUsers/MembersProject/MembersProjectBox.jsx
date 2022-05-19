import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { List, Row, Col, Card, Loader, Icon, Button } from 'uiw'
import styles from './index.module.less'
import UniformNotice from '@/components/UniformNotice'

// 成员公司及项目
const MembersProjectBox = (props) => {
  const { state, loading, dispatch } = props

  const { cUser, allCompaniesProjects, userCompaniesProjects } = state

  const [userCompanyProject, setUserCompanyProject] = useState([])

  useEffect(() => {
    setUserCompanyProject(userCompaniesProjects)
  }, [userCompaniesProjects])

  // 判断是否存在
  const itemExists = (List, item) => {
    const result = List.filter((itemA) => item.id === itemA.id).length
    return !!result
  }

  // 设置所选项目
  const userCompanyProjectClick = (item, type) => {
    if (type === 1) {
      // 判断是否选中公司
      const isExists = userCompanyProject.filter(
        (itemA) => itemA.managerCompany.id === item.id
      ).length
      if (!isExists) {
        const result = [
          ...userCompanyProject,
          { managerCompany: item, managerProjects: [] },
        ]
        setUserCompanyProject(result)
      }
      if (isExists) {
        if (userCompanyProject.length > 1) {
          const result = userCompanyProject
            .map((itemA) => {
              // 判断是否选中公司
              if (itemA.managerCompany.id === item.id) {
                // 判断选中公司中是否选中项目
                if (itemA.managerProjects.length === 0) {
                  return null
                }
                UniformNotice(
                  'warning',
                  {
                    title: '不能取消勾选',
                    description: '该用户参与的公司下有项目,不能取消勾选！',
                  },
                  300
                )
              }
              return itemA
            })
            .filter((s) => s)
          setUserCompanyProject(result)
        }
        if (userCompanyProject.length <= 1) {
          return UniformNotice(
            'warning',
            {
              title: '不能取消勾选',
              description: '成员至少选择一家公司！',
            },
            300
          )
        }
      }
    }
    if (type === 2) {
      const result = userCompanyProject.map((itemB) => {
        // 判断是否选中公司
        if (itemB.managerCompany.id === item.companyId) {
          // 处理项目是否选中操作
          const managerProjects = itemExists(itemB.managerProjects, item)
            ? itemB.managerProjects.filter((itemD) => itemD.id !== item.id)
            : Array.from(new Set([...itemB.managerProjects, item]))
          return { ...itemB, managerProjects }
        }
        return itemB
      })
      setUserCompanyProject(result)
    }
  }

  // 保存设置按钮
  const saveSettings = () => {
    const mangerURPVos = userCompanyProject.map((item) => {
      const projects = item?.managerProjects?.length
        ? item?.managerProjects?.map((itemA) => {
            return {
              companyId: itemA.companyId,
              projectId: itemA.id,
              userId: cUser.id,
            }
          })
        : {
            companyId: item.managerCompany?.id,
            userId: cUser?.id,
          }
      return projects
    })
    // 扁平化数组
    const flatten = (arr) => {
      return !Array.isArray(arr) ? arr : [].concat.apply([], arr.map(flatten))
    }
    dispatch.saveBatchUser(flatten(mangerURPVos))
  }

  // 保存按钮块
  const cardTitle = () => {
    return (
      <div className={styles.cardTitle}>
        <span>项目设置</span>
        {cUser.id && (
          <Button type="primary" onClick={() => saveSettings()}>
            保存设置
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.membersProjectBox}>
      <Card title={cardTitle()}>
        <Row>
          <Col span="6">
            <Loader
              tip="公司列表加载中..."
              vertical
              style={{ width: '100%' }}
              // loading={loading.effects.allusers.getUserCompanyProjects}
            >
              <List
                header={<div>选择公司</div>}
                dataSource={allCompaniesProjects}
                noHover={true}
                style={{ maxHeight: 'calc(100vh - 230px)', overflow: 'auto' }}
                renderItem={(item) => {
                  const itemCompany = item.managerCompany
                  const userCompany = userCompanyProject.map(
                    (item) => item.managerCompany
                  )
                  return (
                    <List.Item
                      active={itemExists(userCompany, itemCompany)}
                      onClick={() => userCompanyProjectClick(itemCompany, 1)}>
                      <div className={styles.companyListitem}>
                        <span>{itemCompany.companyName}</span>
                        <Icon
                          type={
                            itemExists(userCompany, itemCompany)
                              ? 'check-square'
                              : 'check-square-o'
                          }
                        />
                      </div>
                    </List.Item>
                  )
                }}
              />
            </Loader>
          </Col>
          <Col span="18">
            <Loader
              tip="项目列表加载中..."
              vertical
              style={{ width: '100%' }}
              loading={loading.effects.allusers.getUserCompanyProjects}>
              <div
                style={{ maxHeight: 'calc(100vh - 260px)', overflow: 'auto' }}>
                <Card className={styles.projectEdit}>
                  选择项目
                  <div className={styles.projectEditBot}>
                    {allCompaniesProjects.map((item) => {
                      // 所有的公司
                      const itemCompany = item.managerCompany
                      // 所有的项目
                      const itemProjectList = item.managerProjects
                      // 筛选出被选中的公司及其所属被选中项目
                      const userItem = userCompanyProject?.filter(
                        (itemUserCompany) =>
                          itemUserCompany?.managerCompany?.id ===
                          itemCompany?.id
                      )
                      // 赋值被选中的项目
                      const userProjectItem = userItem?.length
                        ? userItem[0]?.managerProjects
                        : []
                      if (userItem.length) {
                        return (
                          <Row key={itemCompany.id}>
                            <div className={styles.companyName}>
                              <span>{itemCompany.companyName}</span>
                            </div>
                            <div className={styles.projectList}>
                              {itemProjectList.map((itemProject, index) => {
                                return (
                                  <Col
                                    span="8"
                                    key={itemProject.id}
                                    onClick={() =>
                                      userCompanyProjectClick(itemProject, 2)
                                    }>
                                    <div
                                      className={`${styles.projectItem} ${
                                        itemExists(
                                          userProjectItem,
                                          itemProject
                                        ) && styles.active
                                      }`}>
                                      {itemProject.name}
                                      <Icon
                                        type={
                                          itemExists(
                                            userProjectItem,
                                            itemProject
                                          )
                                            ? 'check-square'
                                            : 'check-square-o'
                                        }
                                      />
                                    </div>
                                  </Col>
                                )
                              })}
                            </div>
                          </Row>
                        )
                      }
                      return null
                    })}
                  </div>
                </Card>
              </div>
            </Loader>
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(MembersProjectBox)

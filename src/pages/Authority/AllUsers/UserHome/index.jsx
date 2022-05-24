import { Card, Avatar, Icon, Tabs, Button } from 'uiw'
import { Container } from '@/components'
import Summary from './Summary'
import styles from './index.module.less'
const UserHome = (props) => {
  return (
    <div>
      <Container>
        <div className={styles.userHomeWrap}>
          <div className={styles.userInfo}>
            <Card>
              <>
                <div className={styles.avatar}>
                  <Avatar icon={<Icon type="user" />} />
                </div>
                <div className={styles.name}>
                  <h2>名称</h2>
                </div>
                <div className={styles.editBut}>
                  <Button block type="light">
                    编辑用户
                  </Button>
                </div>
              </>
            </Card>
          </div>
          <div className={styles.userProject}>
            <Card>
              <>
                <Tabs type="line" activeKey="1">
                  <Tabs.Pane label="概述" key="1">
                    <div>
                      <Summary />
                    </div>
                  </Tabs.Pane>
                  <Tabs.Pane label="项目" key="2">
                    <div></div>
                  </Tabs.Pane>
                </Tabs>
              </>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default UserHome

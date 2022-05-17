import { Card, Split, Button, Icon, Menu, Steps } from 'uiw'

export default function ProjectHeader() {
  const dataRows = [
    {
      icon: 'uiw',
      menusList: '智慧监控系统软件',
      numAll: 10,
      notStart: 1,
      inDevelopment: 2,
      overProject: 3,
      closer: 4,
      expired: 5,
      online: 6,
    },
    {
      icon: 'folder-add',
      menusList: '每车U货',
      numAll: 20,
      notStart: 11,
      inDevelopment: 12,
      overProject: 13,
      closer: 14,
      expired: 15,
      online: 16,
    },
    {
      icon: 'linux',
      menusList: '尼好企业分销',
      numAll: 30,
      notStart: 21,
      inDevelopment: 22,
      overProject: 23,
      closer: 24,
      expired: 25,
      online: 26,
    },
    {
      icon: 'apple',
      menusList: '尼好数据库运营管理平台',
      numAll: 40,
      notStart: 31,
      inDevelopment: 32,
      overProject: 33,
      closer: 34,
      expired: 35,
      online: 36,
    },
    {
      icon: 'twitter',
      menusList: '帝江OA',
      numAll: 50,
      notStart: 41,
      inDevelopment: 42,
      overProject: 43,
      closer: 44,
      expired: 45,
      online: 46,
    },
    {
      icon: 'baidu',
      menusList: '尼好程序开发测试项目管理软件',
      numAll: 60,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
    {
      icon: 'baidu',
      menusList: '尼好程序开发测试项目管理软件',
      numAll: 60,
      notStart: 51,
      inDevelopment: 52,
      overProject: 53,
      closer: 54,
      expired: 55,
      online: 56,
    },
  ]
  return (
    <div style={{}}>
      <Split
        style={{ height: 250, border: '1px solid #d5d5d5', borderRadius: 3 }}>
        <div
          style={{
            width: '25%',
            height: '100%',
            minWidth: 30,
            overflowX: 'hidden',
            overflowY: 'auto',
          }}>
          <Card title="近期参与的项目" bordered={false}>
            <Menu>
              {dataRows.map((e, key) => {
                return <Menu.Item icon={e.icon} text={e.menusList} key={key} />
              })}
            </Menu>
          </Card>
        </div>
        <div style={{ width: '45%', minWidth: 30 }}>
          <Card
            bordered={false}
            style={{ height: '100%', textAlign: 'center' }}>
            <p style={{ fontSize: 20, color: '#ccc' }}>项目任务</p>
            <h1 style={{ fontSize: 30, color: 'black' }}>{'3'}</h1>
            <Button type="primary">
              <span>查看全部</span>
              <Icon type="right" />
            </Button>
            <Steps
              progressDot
              status="wait"
              current={2}
              style={{ padding: '20px 0' }}>
              <Steps.Step title="未开始" description="3" />
              <Steps.Step title="开发中" description="10" />
              <Steps.Step title="已完成" description="3" />
              <Steps.Step title="已延期" description="6" />
            </Steps>
          </Card>
        </div>
        <div style={{ width: '30%', minWidth: 100 }}>
          <Card title="里程碑" bordered={false} style={{ height: '100%' }}>
            <Steps
              direction="vertical"
              progressDot
              status="error"
              current={2}
              style={{ padding: '20px 0' }}>
              <Steps.Step
                title="步骤一"
                description="这里是步骤一的说明，可以很长很长哦。"
              />
              <Steps.Step
                title="步骤二"
                description="这里是步骤一的说明，可以很长很长哦。"
              />
            </Steps>
          </Card>
        </div>
      </Split>
    </div>
  )
}

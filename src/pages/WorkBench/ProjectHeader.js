import { Card, Split, Button, Icon, Menu, Steps } from 'uiw'

export default function ProjectHeader() {
  return (
    <div>
      <Split
        style={{ height: 250, border: '1px solid #d5d5d5', borderRadius: 3 }}>
        <div style={{ width: '25%', minWidth: 30 }}>
          <Card
            title="近期参与的项目"
            bordered={false}
            style={{ height: '100%' }}>
            <Menu>
              <Menu.Item text={'项目测试管理'}></Menu.Item>
              <Menu.Item text={'智慧监控系统软件'}></Menu.Item>
              <Menu.Item text={'项目集成管理软件'}></Menu.Item>
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
          <Card
            title="里程碑"
            bordered={false}
            style={{ height: '100%' }}></Card>
        </div>
      </Split>
    </div>
  )
}

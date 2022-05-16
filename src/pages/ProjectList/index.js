import { Tabs, Divider, Button, Input, Select, Icon, Avatar } from 'uiw'
import { ProTable, useTable } from '@uiw-admin/components'
import styles from './index.module.less'

const Demo = () => {
  const table = useTable('/api/project/selectPageList', {
    formatData: (data) => {
      return {
        total: data.data.total,
        data: data.data.list,
      }
    },
    // 格式化查询参数 会接收到pageIndex 当前页  searchValues 表单数据
    query: (pageIndex, pageSize, searchValues) => {
      return {
        page: pageIndex,
        results: pageSize,
      }
    },
    requestOptions: { method: 'POST' },
  })

  return (
    <div>
      <div className={styles.header}>
        <span>项目</span>
        <div>
          <Button type="primary">新建项目</Button>
        </div>
      </div>
      <Divider />
      <div className={styles.tabsDiv}>
        <Tabs
          style={{ padding: '5px' }}
          type="line"
          activeKey="1"
          // onTabClick={(tab, key, e) => {}}
        >
          <Tabs.Pane label="全部" key="1"></Tabs.Pane>
          <Tabs.Pane label="进行中" key="2"></Tabs.Pane>
          <Tabs.Pane label="已完成" key="3"></Tabs.Pane>
        </Tabs>
        <div style={{ display: 'flex', lineHeight: '30px' }}>
          <Input
            placeholder="按名称筛选"
            style={{ maxWidth: 200, margin: '10px' }}
          />
          <Select
            style={{ maxWidth: 200, maxHeight: '30px', margin: '10px' }}
            defaultValue="1">
            <Select.Option value="1">One</Select.Option>
            <Select.Option value="2">Two</Select.Option>
            <Select.Option value="3">Three</Select.Option>
          </Select>
        </div>
      </div>
      <ProTable
        paginationProps={{
          pageSize: 10,
        }}
        table={table}
        columns={[
          {
            title: 'ID',
            key: 'id',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            title: '名字',
            key: 'companyName',
            render: (text, keyName, rowData) => {
              console.log(text[0])
              return (
                <div>
                  <Avatar
                    size="small"
                    className={styles.listImg}
                    src={rowData.fileIds !== null ? rowData.fileIds[0] : ''}>
                    {text[0]}
                  </Avatar>
                  {text}
                </div>
              )
            },
          },
          {
            title: '开始时间',
            key: 'begin',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            title: '结束时间',
            key: 'end',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            // title: '操作',
            key: 'edit',
            width: 50,
            render: (text, keyName, rowData) => {
              return (
                <div>
                  <Icon type="more" />
                </div>
              )
            },
          },
        ]}
      />
    </div>
  )
}

export default Demo

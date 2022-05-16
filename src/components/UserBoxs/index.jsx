import { useState } from 'react'
import { Button, Popover, Card, Avatar } from 'uiw'
import { AuthBtn } from '@uiw-admin/authorized'
import './index.less'

/**
 * @type 1: 成员列表 2: 项目成员列表
 */
const Boxs = (props) => {
  const { type = 1, data, handleEdit, dictionary } = props
  const [isOpen, setIsOpen] = useState(false)

  // 处理职位标签
  const userPositionBox = (num) => {
    let arr = {}
    for (let index = 0; index < dictionary?.dictAllData.length; index++) {
      const item = dictionary?.dictAllData[index]
      arr[item.dictCode] = { value: item.dictName, color: item.dictColour }
    }
    return (
      <span
        style={{
          background: arr[num]?.color,
          boxShadow: `0 0 4px 2px ${arr[num]?.color}`,
        }}
        className="position">
        {arr[num]?.value}{' '}
      </span>
    )
  }

  return (
    <div className="users-boxs">
      <div className="left">
        <div className="top">
          <div className="usersAvatar">
            <Avatar
              src={
                data?.uuid ? `/api/file/selectFile/${data?.uuid}` : data?.path
              }
              className="avatar">
              {data?.userName}
            </Avatar>
          </div>
          <div className="name">{data?.userName}</div>
          {data?.userPosition !== '0' && (
            <div className="meta">{userPositionBox(data?.userPosition)}</div>
          )}
          {/* <div className="meta meta2">我自己</div> */}
        </div>
        <div className="bom">
          <span>
            授权于 {data?.createTime} by <i>{data?.userName}</i>
          </span>
          {type === '1' ? (
            <span>({data?.userEmail})</span>
          ) : (
            <span>
              参与项目 <i>{data?.porNum}</i> 个
            </span>
          )}
        </div>
      </div>
      <div className="edit">
        {/* {type !== '1' && (
          <Select defaultValue="w" style={{ width: 120 }}>
            <Select.Option value="w">开发者</Select.Option>
            <Select.Option value="1">管理者</Select.Option>
            <Select.Option value="2">观察者</Select.Option>
          </Select>
        )} */}
        {type === '1' && (
          <>
            <Button
              type="primary"
              size="small"
              style={{ marginLeft: 10 }}
              onClick={() => handleEdit(data, 'edit')}>
              编辑
            </Button>
            <Button
              type="success"
              size="small"
              style={{ marginLeft: 10 }}
              onClick={() => handleEdit(data.id, 'view')}>
              详情
            </Button>
          </>
        )}
        <Popover
          trigger="click"
          placement="left"
          isOpen={isOpen}
          onVisibleChange={setIsOpen}
          content={
            <Card bordered={false} style={{ width: 200 }}>
              <div>{type === '1' ? '确定删除该成员' : '确定移出该项目'}</div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 15,
                }}>
                <Button size="small" onClick={() => setIsOpen(false)}>
                  取消
                </Button>
                <Button
                  type="danger"
                  size="small"
                  onClick={() => {
                    handleEdit(data?.id, 'delete')
                    setIsOpen(false)
                  }}>
                  确定
                </Button>
              </div>
            </Card>
          }></Popover>
        <AuthBtn path="/api/managerUCP/delete">
          <Button
            type="danger"
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => setIsOpen(true)}>
            {type === '1' ? '删除' : '移出项目'}
          </Button>
        </AuthBtn>
      </div>
    </div>
  )
}

export default Boxs

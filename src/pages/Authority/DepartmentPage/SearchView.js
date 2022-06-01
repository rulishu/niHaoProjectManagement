import { useDispatch } from 'react-redux'
import { Button, Form, Input, Row, Col, Select } from 'uiw'
function SearchView() {
  const dispatch = useDispatch()
  return (
    <div>
      {/* 查询列表 */}
      <Form
        onSubmit={(...other) => {
          const { current } = other[0]
          dispatch({
            type: 'department/getList',
            payload: {
              ...current,
            },
          })
        }}
        fields={{
          deptName: {
            label: '部门名称',
            children: <Input placeholder="请输入部门名称" />,
          },
          status: {
            label: '部门状态',
            children: (
              <Select>
                <Select.Option value="">全部</Select.Option>
                <Select.Option value="0">正常</Select.Option>
                <Select.Option value="1">停用</Select.Option>
              </Select>
            ),
          },
        }}>
        {({ fields, canSubmit, resetForm }) => {
          return (
            <div
              style={{
                maxWidth: '100%',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 5,
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Row gutter={10} justify="flex-start">
                  <Col style={{ idth: 200 }}>{fields.deptName}</Col>
                </Row>
                <Row gutter={10} justify="flex-start">
                  <Col style={{ width: 200 }}>{fields.status}</Col>
                </Row>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Row gutter={10} style={{ marginRight: 10 }}>
                  <Col align="middle">
                    <Button
                      disabled={!canSubmit()}
                      type="primary"
                      htmlType="submit"
                      icon="search">
                      查询
                    </Button>
                  </Col>
                </Row>
                <Row gutter={10} style={{ marginRight: 10 }}>
                  <Col align="middle">
                    <Button
                      disabled={!canSubmit()}
                      htmlType="submit"
                      onClick={resetForm}
                      icon="reload">
                      重置
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          )
        }}
      </Form>
    </div>
  )
}
export default SearchView

// import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Drawer, SearchTree, Select } from 'uiw'
// import flattenDeep from "lodash/flattenDeep";
export default function DrawerView() {
  const {
    department: {
      dataSource = [],
      drawerVisible,
      allEditData,
      drawerVisibleText,
    },
  } = useSelector((state) => state)

  const dataParent = dataSource.find(
    (code) => code.deptId === allEditData?.parentId
  )
  const topDataInfo = {
    label: dataParent?.deptName,
    key: dataParent?.deptId?.toString(),
  }
  const dispatch = useDispatch()
  // const [checkID] = useState({ pid: 0 }) //setCheckID

  // 层级遍历
  const getChildrenDepart = function (data, root) {
    let children = []
    for (let i = 0; i < data.length; i++) {
      if (root === data[i].parentId) {
        data[i].children = getChildrenDepart(data, data[i].deptId)
        children.push(data[i])
      }
    }
    return children
  }
  const dataSourceTreeData = dataSource?.map((code) => ({
    ...code,
    label: code.deptName,
    key: code.deptId,
  }))
  const arrSource = getChildrenDepart(dataSourceTreeData, 100) || []
  const arrLeverTop = [
    {
      createBy: 'admin',
      createTime: '2022-05-15 13:53:04',
      delFlag: '0',
      key: 100,
      label: '尼好科技',
      orderNum: 0,
      parentId: 0,
      parentName: null,
      status: '0',
      children: arrSource,
    },
  ]
  const onClose = () => {
    dispatch({
      type: 'department/updateState',
      payload: {
        drawerVisible: false,
      },
    })
  }
  return (
    <>
      <Drawer
        title={drawerVisibleText === 'add' ? '新增' : '编辑'}
        isOpen={drawerVisible}
        onClose={() => {
          onClose()
        }}
        size={500}>
        <Form
          onSubmit={({ initial, current }) => {
            // const { current } = allFormItem
            const errorObj = {}
            if (current?.parentId.length === 0) {
              errorObj.parentId = '上级部门不能为空！'
            } else if (!current?.deptName) {
              errorObj.deptName = '部门名称不能为空！'
            } else if (!current?.orderNum) {
              errorObj.orderNum = '部门名称不能为空！'
            } else if (!current?.orderNum) {
              errorObj.orderNum = '排序不能为空！'
            } else if (!current?.leader) {
              errorObj.leader = '负责人不能为空！'
            } else if (!current?.phone) {
              errorObj.phone = '电话不能为空！'
            } else if (!current?.email) {
              errorObj.email = '邮箱不能为空！'
            } else if (current?.status === '') {
              errorObj.status = '状态不能为空！'
            }
            console.log(current, errorObj)
            if (Object.keys(errorObj).length > 0) {
              const err = new Error()
              err.filed = errorObj
              throw err
            }
            dispatch({
              type: `department/${
                drawerVisibleText === 'add' ? 'getAdd' : 'getEdit'
              }`,
              payload: {
                ...current,
                deptId: allEditData.deptId || '',
                parentId: Number(current?.parentId[0].key) || 0,
                parentName: current?.parentName?.label,
                status: Number(current?.status),
                orderNum: Number(current?.orderNum),
              },
            })
          }}
          onSubmitError={(error) => {
            if (error.filed) {
              return { ...error.filed }
            }
            return null
          }}
          fields={{
            parentId: {
              labelClassName: 'fieldLabel',
              label: '上级部门',
              initialValue: dataParent ? [topDataInfo] : [],
              required: true,
              labelFor: 'username-inline',
              disabled: drawerVisibleText !== 'add',
              children: (
                <SearchTree
                  id="username-inline"
                  options={arrLeverTop} //sourceArrFather(dataSource)
                  multiple={false}
                  style={{ width: '100%' }}
                  allowClear={true}
                  // onSearch={(searchValue) =>
                  //   console.log('SearchTree-> SearchTreeOption', searchValue)
                  // }
                  // onChange={(selectd, selectedAll, isChecked) =>
                  //   console.log(
                  //     'SearchTree-> onChange',
                  //     selectd,
                  //     selectedAll,
                  //     isChecked
                  //   )
                  // }
                  placeholder="请选择上级部门"
                  treeProps={{ style: { height: 250, overflowX: 'auto' } }}
                />
              ),
            },
            deptName: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.deptName || '',
              label: '部门名称',
              placeholder: '请输入部门名称',
              required: true,
              children: <Input />,
            },
            orderNum: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              label: '排序',
              placeholder: '请输入排序',
              required: true,
              initialValue: allEditData.orderNum || '',
              children: <Input type="number" />,
            },
            leader: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.leader || '',
              label: '负责人',
              placeholder: '请输入负责人',
              required: true,
              children: <Input />,
            },
            phone: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.phone || '',
              required: true,
              label: '联系电话',
              placeholder: '请输入联系电话',
              children: <Input />,
            },
            email: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.email || '',
              required: true,
              label: '邮箱',
              placeholder: '请输入邮箱',
              children: <Input />,
            },
            status: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.status,
              required: true,
              label: '部门状态',
              children: (
                <Select>
                  <Select.Option value="">请选择</Select.Option>
                  <Select.Option value="0">正常</Select.Option>
                  <Select.Option value="1">停用</Select.Option>
                </Select>
              ),
            },
          }}>
          {({ fields, canSubmit }) => {
            return (
              <div>
                <Row gutter={10}>
                  <Col>{fields.deptName}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.orderNum}</Col>
                </Row>
                <Row gutter={10} style={{ marginBottom: 10 }}>
                  <Col>{fields.leader}</Col>
                </Row>
                <Row gutter={10} style={{ marginBottom: 10 }}>
                  <Col>{fields.phone}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.email}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.status}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.parentId}</Col>
                </Row>
                <Row gutter={10}>
                  <Col />
                  <Col fixed align="bottom">
                    <Button
                      disabled={!canSubmit()}
                      type="primary"
                      htmlType="submit">
                      提交
                    </Button>
                  </Col>
                </Row>
              </div>
            )
          }}
        </Form>
      </Drawer>
    </>
  )
}

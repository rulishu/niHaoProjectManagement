// import { useState } from 'react'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { useDispatch, useSelector } from 'react-redux'
// import { Button, Form, Input, Row, Col, Drawer, SearchTree, Select } from 'uiw'
// import flattenDeep from "lodash/flattenDeep";
export default function DrawerView() {
  const form = useForm()
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
  // const otherLabel = {
  //   parentId: {
  //     labelClassName: 'fieldLabel',
  //     label: '上级部门',
  //     initialValue: dataParent ? [topDataInfo] : [],
  //     labelFor: 'username-inline',
  //     disabled: drawerVisibleText !== 'add',
  //     children: (
  //       <SearchTree
  //         id="username-inline"
  //         options={arrLeverTop} //sourceArrFather(dataSource)
  //         multiple={false}
  //         style={{ width: '100%' }}
  //         allowClear={true}
  //         // onSearch={(searchValue) =>
  //         //   console.log('SearchTree-> SearchTreeOption', searchValue)
  //         // }
  //         // onChange={(selectd, selectedAll, isChecked) =>
  //         //   console.log(
  //         //     'SearchTree-> onChange',
  //         //     selectd,
  //         //     selectedAll,
  //         //     isChecked
  //         //   )
  //         // }
  //         placeholder="请选择上级部门"
  //         treeProps={{ style: { height: 250, overflowX: 'auto' } }}
  //       />
  //     ),
  //   },
  // }
  // const mainLabel = {
  //   deptName: {
  //     labelClassName: 'fieldLabel',
  //     labelStyle: { width: 60 },
  //     initialValue: allEditData.deptName || '',
  //     label: '部门名称',
  //     placeholder: '请输入部门名称',
  //     children: <Input />,
  //     required: true
  //   },
  //   orderNum: {
  //     labelClassName: 'fieldLabel',
  //     labelStyle: { width: 60 },
  //     label: '排序',
  //     placeholder: '请输入排序',
  //     initialValue: allEditData.orderNum || '',
  //     children: <Input type="number" />,
  //     required: true
  //   },
  //   leader: {
  //     labelClassName: 'fieldLabel',
  //     labelStyle: { width: 60 },
  //     initialValue: allEditData.leader || '',
  //     label: '负责人',
  //     placeholder: '请输入负责人',
  //     children: <Input />,
  //   },
  //   phone: {
  //     labelClassName: 'fieldLabel',
  //     labelStyle: { width: 60 },
  //     initialValue: allEditData.phone || '',
  //     label: '联系电话',
  //     placeholder: '请输入联系电话',
  //     children: <Input />,
  //   },
  //   email: {
  //     labelClassName: 'fieldLabel',
  //     labelStyle: { width: 60 },
  //     initialValue: allEditData.email || '',
  //     label: '邮箱',
  //     placeholder: '请输入邮箱',
  //     children: <Input />,
  //   },
  //   status: {
  //     labelClassName: 'fieldLabel',
  //     labelStyle: { width: 60 },
  //     initialValue: allEditData.status,
  //     label: '部门状态',
  //     children: (
  //       <Select>
  //         <Select.Option value="">请选择</Select.Option>
  //         <Select.Option value="0">正常</Select.Option>
  //         <Select.Option value="1">停用</Select.Option>
  //       </Select>
  //     ),
  //   },
  // }
  const formItem = [
    {
      label: '部门名称',
      key: 'deptName',
      widget: 'input',
      initialValue: allEditData.deptName || '',
      widgetProps: {},
      span: '24',
      required: true,
      placeholder: '请输入部门名称',
    },
    {
      label: '排序',
      key: 'orderNum',
      widget: 'input',
      initialValue: allEditData.orderNum || '',
      widgetProps: {},
      span: '24',
      required: true,
      placeholder: '请输入排序',
    },
    {
      label: '负责人',
      key: 'leader',
      widget: 'input',
      initialValue: allEditData.leader || '',
      widgetProps: {},
      span: '24',
      required: true,
      placeholder: '请输入负责人',
    },
    {
      label: '联系电话',
      key: 'phone',
      widget: 'input',
      initialValue: allEditData.phone || '',
      widgetProps: {},
      span: '24',
      required: true,
      placeholder: '请输入联系电话',
    },
    {
      label: '邮箱',
      key: 'email',
      widget: 'input',
      initialValue: allEditData.email || '',
      widgetProps: {},
      span: '24',
      required: true,
      placeholder: '请输入邮箱',
    },
    {
      label: '状态',
      key: 'status',
      widget: 'select',
      option: [
        { value: '0', label: '正常' },
        { value: '1', label: '停用' },
      ],
      initialValue: allEditData.status,
      widgetProps: {},
      span: '24',
      required: true,
      placeholder: '请选择',
    },
    {
      label: '上级部门',
      key: 'parentId',
      widget: 'searchTree',
      initialValue: dataParent ? [topDataInfo] : [],
      widgetProps: {
        disabled: drawerVisibleText !== 'add',
        allowClear: true,
        treeProps: { style: { height: 250, overflowX: 'auto' } },
      },
      multiple: false,
      option: arrLeverTop,
      span: '24',
      required: true,
      placeholder: '请选择上级部门',
      hide: drawerVisibleText !== 'add' && !dataParent,
    },
  ]
  return (
    <>
      <ProDrawer
        title={drawerVisibleText === 'add' ? '新增' : '编辑'}
        isOpen={drawerVisible}
        onClose={() => {
          onClose()
        }}
        buttons={[
          {
            label: '取消',
            onClick: onClose,
          },
          {
            label: '保存',
            type: 'primary',
            onClick: () => {
              form?.submitvalidate()
            },
          },
        ]}
        size={500}>
        <ProForm
          form={form}
          formType="card"
          onSubmit={(initial, current) => {
            const pattern = /^[1][3,4,5,7,8,9][0-9]{9}$/
            const errorObj = {}
            if (current?.parentId?.length === 0) {
              errorObj.parentId = '上级部门不能为空！'
            }
            if (!current?.deptName) {
              errorObj.deptName = '部门名称不能为空！'
            }
            if (!current?.orderNum) {
              errorObj.orderNum = '排序不能为空！'
            }
            if (!current?.leader) {
              errorObj.leader = '负责人不能为空！'
            }
            if (!current?.phone) {
              errorObj.phone = '电话不能为空！'
            } else if (!pattern.test(current?.phone)) {
              errorObj.phone = '电话格式不正确！'
            }
            if (!current?.email) {
              errorObj.email = '邮箱不能为空！'
            }
            if (current?.status === '') {
              errorObj.status = '状态不能为空！'
            }
            if (Object.keys(errorObj).length > 0) {
              const err = new Error()
              err.filed = errorObj
              throw err
            }
            dispatch({
              type: `department/${
                drawerVisibleText === 'add' ? 'getAdd' : 'getEdit'
              }`,
              payload: current?.parentId
                ? {
                    ...current,
                    deptId: allEditData.deptId || '',
                    parentId: Number(current?.parentId[0]?.key),
                    parentName: current?.parentId[0]?.label,
                    status: Number(current?.status),
                    orderNum: Number(current?.orderNum),
                  }
                : {
                    ...current,
                    deptId: allEditData.deptId || '',
                    parentId: allEditData.parentId,
                    status: Number(current?.status),
                    orderNum: Number(current?.orderNum),
                  },
            })
          }}
          buttonsContainer={{ justifyContent: 'flex-start' }}
          formDatas={formItem}
        />
        {/* <Form
          onSubmit={({ ...allFormItem }) => {
            const pattern = /^[1][3,4,5,7,8,9][0-9]{9}$/
            const { current } = allFormItem
            const errorObj = {}
            if (current?.parentId?.length === 0) {
              errorObj.parentId = '上级部门不能为空！'
            }
            if (!current?.deptName) {
              errorObj.deptName = '部门名称不能为空！'
            }
            if (!current?.orderNum) {
              errorObj.orderNum = '排序不能为空！'
            }
            if (!current?.leader) {
              errorObj.leader = '负责人不能为空！'
            }
            if (!current?.phone) {
              errorObj.phone = '电话不能为空！'
            } else if (!pattern.test(current?.phone)) {
              errorObj.phone = '电话格式不正确！'
            }
            if (!current?.email) {
              errorObj.email = '邮箱不能为空！'
            }
            if (current?.status === '') {
              errorObj.status = '状态不能为空！'
            }
            if (Object.keys(errorObj).length > 0) {
              const err = new Error()
              err.filed = errorObj
              throw err
            }
            dispatch({
              type: `department/${drawerVisibleText === 'add' ? 'getAdd' : 'getEdit'
                }`,
              payload: current?.parentId
                ? {
                  ...current,
                  deptId: allEditData.deptId || '',
                  parentId: Number(current?.parentId[0]?.key),
                  parentName: current?.parentId[0]?.label,
                  status: Number(current?.status),
                  orderNum: Number(current?.orderNum),
                }
                : {
                  ...current,
                  deptId: allEditData.deptId || '',
                  parentId: allEditData.parentId,
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
          fields={
            drawerVisibleText !== 'add' && !dataParent
              ? mainLabel
              : Object.assign(otherLabel, mainLabel)
          }>
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
        </Form> */}
      </ProDrawer>
    </>
  )
}

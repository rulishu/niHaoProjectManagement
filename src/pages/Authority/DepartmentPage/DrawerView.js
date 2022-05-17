import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Input, Row, Col, Drawer, SearchTree, Select } from 'uiw'
// import flattenDeep from "lodash/flattenDeep";
export default function DrawerView() {
  const {
    department: {
      // dataSource = [],
      drawerVisible,
      allEditData,
      drawerVisibleText,
    },
  } = useSelector((state) => state)
  const dispatch = useDispatch()
  const [checkID] = useState({ pid: 0 }) //setCheckID

  //   const dataSourceTreeData = dataSource?.map((code) => ({
  //     ...code,
  //     label: code.fullName,
  //     key: code.id,
  //   }));
  //   // 层级遍历
  // const getChildrenDepart = function (data,root) {
  //   let children = [];
  //   for (let i = 0; i < data.length; i++) {
  //     if (root === data[i].pid) {
  //       data[i].children = getChildrenDepart(data, data[i].id);
  //       children.push(data[i]);
  //     }
  //   }
  //   return children;
  // };
  const arrSource = [
    //getChildrenDepart(dataSourceTreeData, 0)||
    {
      label: '上海市',
      key: '1-0-0',
      children: [
        { label: '黄浦区', key: '1-0-1' },
        { label: '卢湾区', key: '1-0-2' },
        {
          label: '徐汇区',
          key: '1-0-3',
          children: [
            { label: '半淞园路街道', key: '1-1-0' },
            { label: '南京东路街道', key: '1-2-0' },
            { label: '外滩街道', key: '1-3-0' },
          ],
        },
      ],
    },
    { label: '澳门', key: '3' },
  ]
  const arrLeverTop = [
    {
      key: '0',
      label: '顶级',
      level: 0,
      id: 999,
      url: '/top',
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
        size={700}>
        <Form
          onSubmit={({ ...allFormItem }) => {
            const { current } = allFormItem
            console.log(allFormItem)
            dispatch({
              type: `department/${
                drawerVisibleText === 'add' ? 'getAdd' : 'getEdit'
              }`,
              payload: {
                ...current,
                pid: Number(checkID.pid),
                id: drawerVisibleText === 'add' ? null : allEditData.id,
              },
            })
          }}
          fields={{
            pid: {
              labelClassName: 'fieldLabel',
              label: '上级部门',
              initialValue: [{ label: '黄浦区', key: '1-0-1' }],
              required: true,
              children: (
                <SearchTree
                  options={arrLeverTop} //sourceArrFather(dataSource)
                  multiple={false}
                  style={{ width: '100%' }}
                  allowClear={true}
                  onSearch={(searchValue) =>
                    console.log('SearchTree-> SearchTreeOption', searchValue)
                  }
                  onChange={(selectd, selectedAll, isChecked) =>
                    console.log(
                      'SearchTree-> onChange',
                      selectd,
                      selectedAll,
                      isChecked
                    )
                  }
                  placeholder="请选择选项"
                  // onSelected={(...allData) => {
                  //   // const { evn } = allData
                  //   const checkID = {
                  //     pid: allData[3].key,
                  //   };
                  //   setCheckID(checkID);
                  // }}
                />
              ),
            },
            simpleName: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.simpleName || '',
              label: '部门名称',
              required: true,
              children: <Input />,
            },
            num: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              label: '排序',
              required: true,
              initialValue: allEditData.num || '',
              children: <Input type="number" />,
            },
            simpleName1: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.simpleName || '',
              label: '负责人',
              required: true,
              children: <Input />,
            },
            fullName: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.fullName || '',
              required: true,
              label: '联系电话',
              children: <Input />,
            },
            fullName1: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.fullName || '',
              required: true,
              label: '邮箱',
              children: <Input />,
            },
            tips: {
              labelClassName: 'fieldLabel',
              labelStyle: { width: 60 },
              initialValue: allEditData.tips || '',
              label: '部门状态',
              children: (
                <Select>
                  <Select.Option value="w">正常</Select.Option>
                  <Select.Option value="1">停用</Select.Option>
                </Select>
              ),
            },
          }}>
          {({ fields, canSubmit }) => {
            return (
              <div>
                <Row gutter={10}>
                  <Col>{fields.pid}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.simpleName}</Col>
                  <Col>{fields.num}</Col>
                </Row>
                <Row gutter={10} style={{ marginBottom: 10 }}>
                  <Col>{fields.simpleName1}</Col>
                  <Col>{fields.fullName}</Col>
                </Row>
                <Row gutter={10}>
                  <Col>{fields.fullName1}</Col>
                  <Col>{fields.tips}</Col>
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

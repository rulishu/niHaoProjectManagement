import { useState } from 'react'
import { connect } from 'react-redux'
import { Divider, Row, Col, Button } from 'uiw'
import styles from './index.module.less'
import { ProForm, useForm } from '@uiw-admin/components'
import './index.css'
import { memberForm } from '@/utils/formValidation'

// 基础信息
// type 1 : 查看 2 : 编辑 3 :新增
const BasicInfo = (props) => {
  const form = useForm()
  const form1 = useForm()

  const { type, setIsOverlay, dispatch, state } = props
  const { baseDetail, uuid, page, pageSize } = state.allusers
  const { dictAllData } = state.dictionary

  // 所有角色列表
  const { allRoleList, arrLeverTop, arrRole } = state.rolemanagement

  // useEffect(() => {
  //   // 获取图片
  //   if (!baseDetail.path) uuid && dispatch.getNewUserAvatarFile({ uuid })
  // }, [baseDetail.path, dispatch, uuid])
  // 搜索角色变化回调
  // const handleSearch = (value) => {
  //   const initialValue = allRoleList.map((item) => {
  //     return { value: item.roleId, label: item.roleName }
  //   })
  //   const newDropDownBox = initialValue.filter((item) =>
  //     item.label.includes(value.trim())
  //   )
  //   setDropDownBox([...newDropDownBox])
  // }

  const [btnIcon, setBtnIcon] = useState('lock')

  // 下拉框值
  const [dropDownBox] = useState(
    allRoleList.map((item) => {
      return { value: item.roleId, label: item.roleName }
    })
  )
  // 寻找部门名称
  const postName =
    arrRole?.find((e) => e?.deptId === baseDetail?.deptId)?.deptName || ''
  console.log('baseDetail', baseDetail, arrRole, postName)
  return (
    <div className={styles.BasicInfo}>
      <Row>
        <Col span="8" className={styles.left}>
          <div>
            <div className="BasicInfoLeft">
              <ProForm
                form={form}
                formType="pure"
                className={styles.leftForm}
                onChange={(initial, current) => {
                  current.upload[0] &&
                    dispatch.getUploadAvatar(current.upload[0])
                }}
                onSubmit={async (initial, current) => {
                  const errorObj = {}
                  if (Object.keys(errorObj).length > 0) {
                    const err = new Error()
                    err.filed = errorObj
                    throw err
                  }
                }}
                formDatas={[
                  {
                    label: type === 3 ? '选择头像' : null,
                    key: 'avatar',
                    widget: 'upload',
                    span: '24',
                    initialValue:
                      type !== 3
                        ? baseDetail.uuid
                          ? [
                              {
                                dataURL: `/api/file/selectFile/${baseDetail.uuid}`,
                              },
                            ]
                          : null
                        : null,
                    widgetProps: {
                      uploadType: 'card',
                      shape: 'circle',
                      maxNumber: 1,
                      showFileIcon: {
                        showPreviewIcon: true,
                        showRemoveIcon: type !== 1,
                      },
                    },
                  },
                ]}
              />
            </div>
            <Row className={styles.message}>{baseDetail.userName}</Row>
            <Row className={styles.message}>{baseDetail.userEmail}</Row>
          </div>
        </Col>
        <Col span="2">
          <Divider type="vertical" style={{ height: '100%' }} />
        </Col>
        <Col span="14">
          <ProForm
            form={form1}
            formType="pure"
            // title={`成员基本信息${type === 2 ? '编辑' : ''}`}
            // // 是否展示uiw/form提交按钮
            // showSaveButton
            // // 是否展示uiw/form重置按钮
            // showResetButton
            // 提交后验证
            onSubmit={(initial, current) => {
              const errorObj = memberForm({ initial, current })
              if (Object.keys(errorObj).length > 0) {
                const err = new Error()
                err.filed = errorObj
                throw err
              }
            }}
            formDatas={[
              // {
              //   label: 'ID: ',
              //   key: 'userId',
              //   widget: 'input',
              //   inline: true,
              //   span: '24',
              //   readOnly: true,
              //   disabled: true,
              //   hide: type === 3,
              //   initialValue: baseDetail.userId,
              // },
              {
                label: '姓名: ',
                key: 'nickName',
                widget: 'input',
                inline: true,
                span: '24',
                required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.nickName,
              },
              {
                label: '帐号: ',
                key: 'userName',
                widget: 'input',
                inline: true,
                span: '24',
                required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.userName,
              },
              //
              {
                label: '密码: ',
                key: 'password',
                widget: 'input',
                inline: true,
                span: '24',
                required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.password,
                widgetProps: {
                  type: btnIcon === 'lock' ? 'password' : 'text',
                  addonAfter: (
                    <Button
                      icon={btnIcon}
                      onClick={() =>
                        setBtnIcon(btnIcon === 'lock' ? 'unlock' : 'lock')
                      }
                      size="small"
                      basic
                      type="light"
                    />
                  ),
                },
              },
              {
                label: '性别: ',
                key: 'sex',
                widget: 'radio',
                inline: true,
                span: '24',
                disabled: type === 1 && true,
                // required: true,
                initialValue: Number(baseDetail.sex),
                option: [
                  { label: '男', value: 0 },
                  { label: '女', value: 1 },
                ],
                widgetProps: {
                  disabled: true,
                },
              },
              {
                label: '电话: ',
                key: 'phonenumber',
                widget: 'input',
                inline: true,
                span: '24',
                // required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.phonenumber,
                widgetProps: {},
              },
              {
                label: '状态: ',
                key: 'status',
                widget: 'select',
                option: [
                  { label: '正常', value: 0 },
                  { label: '停用', value: 1 },
                ],
                inline: true,
                span: '24',
                // required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.status,
                widgetProps: {},
              },
              {
                label: '邮箱: ',
                key: 'email',
                widget: 'input',
                inline: true,
                // required: true,
                span: '24',
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.email,
              },
              {
                label: '角色: ', // baseDetail.roleIds 角色为null
                key: 'roleIds',
                widget: 'searchSelect',
                inline: true,
                span: '24',
                // required: true,
                disabled: type === 1 && true,
                initialValue:
                  [{ label: baseDetail.roleIds, key: baseDetail?.deptName }] ||
                  '',
                option: dropDownBox,
                widgetProps: {
                  multiple: false,
                  showSearch: true,
                  allowClear: true,
                },
              },
              {
                label: '职位: ', // baseDetail.postIds 职位为null
                key: 'postIds',
                widget: 'select',
                inline: true,
                span: '24',
                // required: true,
                disabled: type === 1 && true,
                initialValue: baseDetail.postIds,
                option: dictAllData?.map((e) => ({
                  label: e?.postName,
                  value: e.postId,
                })),
              },
              {
                label: '部门: ',
                key: 'deptId',
                widget: 'searchTree',
                inline: true,
                span: '24',
                // required: true,
                disabled: type === 1 && true,
                initialValue: baseDetail.deptId
                  ? [{ key: baseDetail.deptId, label: postName }]
                  : '',
                option: arrLeverTop,
                widgetProps: {
                  multiple: false,
                  // onSearch: handleSearch,
                  style: { width: '100%' },
                  showSearch: true,
                },
              },
              {
                label: '备注: ',
                key: 'remark',
                widget: 'textarea',
                inline: true,
                span: '24',
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.remark,
                widgetProps: {},
              },
              // {
              //   label: '创建时间: ',
              //   key: 'createTime',
              //   widget: 'dateInput',
              //   inline: true,
              //   span: '24',
              //   disabled: true,
              //   hide: type === 3,
              //   initialValue: baseDetail.createTime,
              //   widgetProps: {
              //     allowClear: false,
              //     format: 'YYYY-MM-DD HH:mm:ss',
              //   },
              // },
            ]}
          />
        </Col>
      </Row>
      {type !== 1 && (
        <Row>
          <Col span="24" style={{ textAlign: 'right' }}>
            <Button
              style={{ marginTop: 10, width: 80 }}
              type="primary"
              onClick={async () => {
                // 触发验证
                await form?.submitvalidate()
                await form1?.submitvalidate()
                // 获取错误信息
                const errors = form.getError()
                const errors1 = form1.getError()
                if (errors && Object.keys(errors).length > 0) return
                if (errors1 && Object.keys(errors1).length > 0) return
                // 获取表单值

                const value = await form.getFieldValues?.()
                const value1 = await form1.getFieldValues?.()
                const params = {
                  ...value1,
                  postIds: [Number(value1?.postIds)],
                  roleIds: [value1?.roleIds],
                  deptId: value1?.deptId[0]?.key,
                  uuid: value?.upload?.length ? uuid : null,
                }
                // 调用请求接口
                // type 1 : 查看 2 : 编辑 3 :新增
                if (props?.type === 2) {
                  const param = {
                    ...params,
                    userId: baseDetail?.userId,
                    postIds: params?.postIds || ' ',
                  }
                  await dispatch.editNewUser({
                    param,
                    callback: () => setIsOverlay(false),
                  })
                } else if (props?.type === 3) {
                  await dispatch.addNewUser({
                    params,
                    callback: () => setIsOverlay(false),
                  })
                }
                await dispatch.queryByPage({
                  page: 1,
                  pageSize: page * pageSize,
                })
              }}>
              保存
            </Button>
          </Col>
        </Row>
      )}
    </div>
  )
}

const mapStateToProps = ({ allusers, rolemanagement, dictionary }) => ({
  state: { allusers, rolemanagement, dictionary },
})

const mapDispatchToProps = ({ allusers, rolemanagement }) => ({
  dispatch: allusers,
  roleDispatch: rolemanagement,
})

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfo)

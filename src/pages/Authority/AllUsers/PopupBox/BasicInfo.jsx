import { useState, useEffect } from 'react' //,,useEffect
import { connect } from 'react-redux' //useSelector
import { Row, Col, Button, Card } from 'uiw'
import styles from './index.module.less'
import { ProForm, useForm } from '@uiw-admin/components'
import './index.css'
import { memberForm } from '@/utils/formValidation'
import { useDispatch } from 'react-redux'

// 基础信息
// type 1 : 查看 2 : 编辑 3 :新增
const BasicInfo = (props) => {
  const dispatchother = useDispatch()
  const form = useForm()
  const form1 = useForm()
  const { type, setIsOverlay, dispatch, state } = props
  const {
    baseDetail,
    types,
    isShow,
    userData,
    uuid,
    rolesDataInfo,
    postsDataInfo,
    saveState,
  } = state.allusers
  const { dictAllData } = state.dictionary
  const { allRoleList, arrLeverTop, arrRole } = state.rolemanagement
  const postName =
    arrRole?.find((e) => e?.deptId === baseDetail?.deptId)?.deptName || ''
  useEffect(() => {
    // 获取图片
    if (type === 2 || types === 2) {
      form1?.setFields &&
        form1.setFields({
          ...baseDetail,
          sex: Number(baseDetail?.sex),
          deptId: baseDetail.deptId
            ? [{ key: baseDetail.deptId, label: postName }]
            : '',
          roleIds: rolesDataInfo,
          postIds: postsDataInfo,
          remark: baseDetail.remark || '',
        })
    }
  }, [
    type,
    types,
    userData,
    baseDetail,
    form1,
    rolesDataInfo,
    postsDataInfo,
    postName,
  ])
  const [btnIcon, setBtnIcon] = useState('lock')
  // 下拉框值
  const [dropDownBox] = useState(
    allRoleList
      .filter((item) => item?.roleId !== 1)
      ?.map((item) => {
        return { value: item.roleId, label: item.roleName }
      })
  )
  //判断是否可以看到所有项目列表
  const naid = localStorage.getItem('key')
  return (
    <div className={styles.BasicInfo}>
      <Card title="公共头像">
        <div
          className="BasicInfoLeft"
          style={{ display: 'flex', flexDirection: 'row', marginLeft: '10%' }}>
          <ProForm
            form={form}
            formType="pure"
            className={styles.leftForm}
            onChange={(initial, current) => {
              current.avatar[0] &&
                dispatch.getUploadAvatar(current.avatar[0].file)
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
                key: 'avatar',
                widget: 'upload',
                span: '12',
                initialValue:
                  type !== 3 && baseDetail.avatar
                    ? [
                        {
                          dataURL:
                            baseDetail.avatar.indexOf('http') === 0 ||
                            !baseDetail.avatar
                              ? baseDetail.avatar
                              : `/api/file/selectFile/${baseDetail.avatar}`,
                        },
                      ]
                    : baseDetail.avatar,
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
          <div>
            <span style={{ color: '#ccc' }}>
              您可以在此处更改您的头像或删除当前头像
            </span>
            <br />
            <span style={{ color: '#ccc' }}>允许的最大文件大小为 200KB。</span>
          </div>
        </div>
      </Card>
      <Card title="个人资料" style={{ marginTop: 10 }}>
        <Row>
          <Col>
            <ProForm
              form={form1}
              formType="pure"
              onSubmit={(initial, current) => {
                const errorObj = memberForm({ initial, current, type })
                if (Object.keys(errorObj).length > 0) {
                  const err = new Error()
                  err.filed = errorObj
                  throw err
                }
              }}
              formDatas={[
                {
                  label: '姓名: ',
                  key: 'nickName',
                  widget: 'input',
                  inline: false,
                  span: '12',
                  required: true,
                  readOnly: type === 1 && 'readonly',
                  initialValue:
                    isShow === 'isshow'
                      ? userData?.nickName
                      : baseDetail.nickName,
                  widgetProps: {
                    placeholder: '请输入姓名',
                  },
                },
                {
                  label: '帐号: ',
                  key: 'userName',
                  widget: 'input',
                  disabled: type !== 3 ? true : false,
                  inline: false,
                  span: '12',
                  required: true,
                  readOnly: type === 1 && 'readonly',
                  initialValue: baseDetail.userName,
                  widgetProps: {
                    placeholder: '请输入帐号',
                  },
                  hide: isShow === 'isshow' ? true : false,
                },
                {
                  label: '密码: ',
                  key: 'password',
                  widget: 'input',
                  inline: false,
                  span: '12',
                  required: true,
                  readOnly: type === 1 && 'readonly',
                  initialValue: baseDetail.password,
                  hide:
                    type === 2
                      ? true
                      : false || isShow === 'isshow'
                      ? true
                      : false,
                  widgetProps: {
                    placeholder: '请输入密码',
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
                  inline: false,
                  span: '12',
                  disabled: type === 1 && true,
                  initialValue:
                    isShow === 'isshow' ? userData?.sex : baseDetail.sex || 0,
                  option: [
                    { label: '男', value: 0 },
                    { label: '女', value: 1 },
                  ],
                  widgetProps: {
                    placeholder: '请输入性别',
                  },
                },
                {
                  label: '电话: ',
                  key: 'phonenumber',
                  widget: 'input',
                  inline: false,
                  span: '12',
                  required: true,
                  readOnly: type === 1 && 'readonly',
                  initialValue:
                    isShow === 'isshow'
                      ? userData?.phonenumber
                      : baseDetail.phonenumber,
                  widgetProps: {
                    placeholder: '请输入电话',
                  },
                },
                {
                  label: '状态: ',
                  key: 'status',
                  widget: 'select',
                  disabled: naid === 'false' ? true : false,
                  inline: false,
                  option: [
                    { label: '正常', value: 0 },
                    { label: '停用', value: 1 },
                  ],
                  span: '12',
                  readOnly: type === 1 && 'readonly',
                  initialValue: baseDetail.status || 0,
                  widgetProps: {
                    placeholder: '请输入状态',
                  },
                  hide: isShow === 'isshow' ? true : false,
                },
                {
                  label: '邮箱: ',
                  key: 'email',
                  widget: 'input',
                  inline: false,
                  required: true,
                  span: '12',
                  readOnly: type === 1 && 'readonly',
                  initialValue:
                    isShow === 'isshow' ? userData?.email : baseDetail.email,
                  widgetProps: {
                    placeholder: '请输入邮箱',
                  },
                },
                {
                  label: '角色: ', // baseDetail.roleIds 角色为null
                  key: 'roleIds',
                  widget: 'searchSelect',
                  disabled: naid === 'false' ? true : false,
                  inline: false,
                  span: '12',
                  required: true,
                  // disabled: type === 1 && true,
                  // initialValue: rolesDataInfo,
                  option: dropDownBox,
                  widgetProps: {
                    multiple: false,
                    showSearch: true,
                    allowClear: true,
                    placeholder: '请选择角色',
                  },
                  hide: isShow === 'isshow' ? true : false,
                },
                {
                  label: '职位: ', // baseDetail.postIds 职位为null
                  key: 'postIds',
                  widget: 'select',
                  inline: false,
                  disabled: naid === 'false' ? true : false,
                  required: true,
                  span: '12',
                  // disabled: type === 1 && true,
                  initialValue: postsDataInfo || '',
                  option: dictAllData?.map((e) => ({
                    label: e?.postName,
                    value: e.postId,
                  })),
                  widgetProps: {
                    placeholder: '请选择职位',
                  },
                  hide: isShow === 'isshow' ? true : false,
                },
                {
                  label: '部门: ',
                  key: 'deptId',
                  widget: 'searchTree',
                  disabled: naid === 'false' ? true : false,
                  inline: false,
                  span: '12',
                  // disabled: type === 1 && true,
                  initialValue: baseDetail.deptId
                    ? [{ key: baseDetail.deptId, label: postName }]
                    : '',
                  option: arrLeverTop,
                  widgetProps: {
                    multiple: false,
                    style: { width: '100%' },
                    showSearch: true,
                    placeholder: '请选择部门',
                    onChange: (value) => {
                      dispatchother({
                        type: 'allusers/update',
                        payload: {
                          baseDetail: {
                            ...baseDetail,
                            deptId: value?.key,
                          },
                        },
                      })
                    },
                  },
                  hide: isShow === 'isshow' ? true : false,
                },
                {
                  label: '备注: ',
                  key: 'remark',
                  widget: 'textarea',
                  inline: false,
                  span: '24',
                  // readOnly: type === 1 && 'readonly',
                  initialValue:
                    isShow === 'isshow' ? userData?.remark : baseDetail?.remark,
                  widgetProps: {
                    placeholder: '请输入备注',
                  },
                },
              ]}
            />
          </Col>
        </Row>
        {type !== 1 && (
          <Row>
            <Col span="12" style={{ textAlign: 'right', marginLeft: '5.5%' }}>
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

                  const value1 = await form1.getFieldValues?.()
                  const params = {
                    ...value1,
                    postIds:
                      JSON.stringify(value1?.postIds) !== '{}'
                        ? [Number(value1?.postIds)]
                        : [],
                    roleIds: value1?.roleIds ? [value1?.roleIds] : [],
                    deptId: value1?.deptId[0]?.key || '',
                    avatar: uuid || '',
                  }
                  // 调用请求接口
                  // type 1 : 查看 2 : 编辑 3 :新增 types === 2:编辑用户
                  if (props?.type === 2) {
                    const param = {
                      ...params,
                      userId: baseDetail?.userId,
                    }
                    await dispatch.editNewUser({
                      param,
                      callback: () => setIsOverlay(false),
                    })
                    await dispatchother({
                      type: 'routeManagement/getInfo',
                    })
                    await dispatch.queryByPage({
                      page: state.allusers.page,
                      pageSize: state.allusers.pageSize,
                    })
                  } else if (props?.type === 3) {
                    await dispatch.addNewUser({
                      params,
                      callback: () => setIsOverlay(false),
                    })
                    await dispatch.queryByPage({
                      page: state.allusers.page,
                      pageSize: state.allusers.pageSize,
                    })
                  } else if (types === 2) {
                    const param = {
                      ...params,
                      userId: baseDetail?.userId,
                    }
                    await dispatch.editNewPerson({
                      param,
                      callback: () => setIsOverlay(false),
                    })
                    await dispatchother({
                      type: 'routeManagement/getInfo',
                    })
                  }
                }}
                loading={saveState}>
                保存
              </Button>
            </Col>
          </Row>
        )}
      </Card>
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

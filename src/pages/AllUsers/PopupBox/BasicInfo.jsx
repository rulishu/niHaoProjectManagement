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
  const { allRoleList } = state.rolemanagement

  // useEffect(() => {
  //   // 获取图片
  //   if (!baseDetail.path) uuid && dispatch.getNewUserAvatarFile({ uuid })
  // }, [baseDetail.path, dispatch, uuid])

  // 搜索角色变化回调
  const handleSearch = (value) => {
    const initialValue = allRoleList.map((item) => {
      return { value: item.id, label: item.name }
    })
    const newDropDownBox = initialValue.filter((item) =>
      item.label.includes(value.trim())
    )
    setDropDownBox([...newDropDownBox])
  }

  const [btnIcon, setBtnIcon] = useState('lock')

  // 下拉框值
  const [dropDownBox, setDropDownBox] = useState(
    allRoleList.map((item) => {
      return { value: item.id, label: item.name }
    })
  )

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
                    key: 'upload',
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
            formType="card"
            title={`成员基本信息${type === 2 ? '编辑' : ''}`}
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
              {
                label: 'ID: ',
                key: 'id',
                widget: 'input',
                inline: true,
                span: '24',
                readOnly: true,
                disabled: true,
                hide: type === 3,
                initialValue: baseDetail.id,
              },
              {
                label: '姓名：',
                key: 'userName',
                widget: 'input',
                inline: true,
                span: '24',
                required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.userName,
              },
              {
                label: '账户：',
                key: 'userAccount',
                widget: 'input',
                inline: true,
                span: '24',
                required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.userAccount,
              },
              {
                label: '密码：',
                key: 'userPassword',
                widget: 'input',
                inline: true,
                span: '24',
                required: true,
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.userPassword,
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
                label: '角色：',
                key: 'roleId',
                widget: 'searchSelect',
                inline: true,
                span: '24',
                required: true,
                disabled: type === 1 && true,
                initialValue: baseDetail.roleId,
                option: dropDownBox,
                widgetProps: {
                  onSearch: handleSearch,
                  showSearch: true,
                },
              },
              {
                label: '性别：',
                key: 'sex',
                widget: 'radio',
                inline: true,
                span: '24',
                disabled: type === 1 && true,
                initialValue: baseDetail.sex,
                option: [
                  { label: '男', value: 0 },
                  { label: '女', value: 1 },
                  { label: '保密', value: 3 },
                ],
                widgetProps: {
                  disabled: true,
                },
              },
              {
                label: '职位：',
                key: 'userPosition',
                widget: 'select',
                inline: true,
                span: '24',
                disabled: type === 1 && true,
                initialValue: baseDetail.userPosition,
                option: dictAllData.map((item) => {
                  return { value: item.dictCode, label: item.dictName }
                }),
              },
              {
                label: '手机号码：',
                key: 'userPhone',
                widget: 'input',
                inline: true,
                span: '24',
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.userPhone,
                widgetProps: {},
              },
              {
                label: '电子邮箱：',
                key: 'userEmail',
                widget: 'input',
                inline: true,
                span: '24',
                readOnly: type === 1 && 'readonly',
                initialValue: baseDetail.userEmail,
              },
              {
                label: '创建时间：',
                key: 'createTime',
                widget: 'dateInput',
                inline: true,
                span: '24',
                disabled: true,
                hide: type === 3,
                initialValue: baseDetail.createTime,
                widgetProps: {
                  allowClear: false,
                  format: 'YYYY-MM-DD HH:mm:ss',
                },
              },
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
                  uuid: value.upload.length ? uuid : null,
                }
                // 调用请求接口
                // type 1 : 查看 2 : 编辑 3 :新增
                if (props?.type === 2) {
                  const param = {
                    ...params,
                    id: baseDetail?.id,
                    userPosition: params?.userPosition || ' ',
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

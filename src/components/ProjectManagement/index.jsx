import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Loader } from 'uiw'
import formatter from '@uiw/formatter'
import { useState } from 'react'
import CompDropdown from '../../components/CompDropdown'
import { initListData } from '@/utils/utils'
import styles from './index.module.less'
import AddList from './AddList'

/**
 * 使用方法：
 * 先引用组件（fun为回调函数，回调刷新函数）
 * <ProjectManagement fun={reset}></ProjectManagement>
 *
 * 新增
 * dispatch({
 *  type: 'projectUpdate/updataProject',
 *  payload: { drawerType: 'add' },
 *})
 *
 * 编辑
 * dispatch({
 *  type: 'projectUpdate/updataProject',
 *  payload: { drawerType: 'edit'，id:"..." },
 *})
 * @returns
 */

const ProjectManagement = (fun) => {
  // const [showSubmit, setShowSubmit] = useState(true)
  const [addrolds, setAddrolds] = useState(false)
  const baseRef = useForm()
  const dispatch = useDispatch()
  const {
    projectUpdate: {
      drawerVisible,
      drawerType,
      seachValue,
      userList,
      id,
      isHangup,
      editLoading,
      fileIds, //Logo文件的id
      addList,
    },
    userHome: { user },
    loading,
  } = useSelector((state) => state)

  const updateData = (payload) => {
    dispatch({
      type: 'projectUpdate/updateState',
      payload,
    })
  }

  const optionEvent = (item) => {
    let key = item.userId
    let memberName = item.nickName + '  ' + item.email
    let arr = userList
    arr.push({
      key,
      memberName,
    })
    updateData({ userList: arr })

    baseRef.setFieldValue('projectLeaderId', item.userId)
    let data = {
      projectLeaderId: item.userId,
      name: seachValue?.name,
      begin: seachValue?.begin,
      end: seachValue?.end,
      descr: seachValue?.descr,
      status: seachValue?.status,
    }
    updateData({ seachValue: data })
    setAddrolds(false)
  }

  const dropdown = () => {
    return (
      <>
        <CompDropdown
          isOpen={addrolds}
          shape="input"
          template="addrole"
          listData={initListData(userList, seachValue.projectLeaderId, 'key', {
            memberName: 'memberName',
          })}
          isAllowsForNo={false}
          isGonnaHitDeselect={false}
          selectLabel={(e) => {
            baseRef.setFieldValue('projectLeaderId', e)
            setAddrolds(false)
            // setShowSubmit(false)
            let arr = {
              projectLeaderId: e,
              name: seachValue?.name,
              begin: seachValue?.begin,
              end: seachValue?.end,
              descr: seachValue?.descr,
              status: seachValue?.status,
            }
            updateData({ seachValue: arr })
          }}
          onClickLabelShow={(e) => {
            setAddrolds(e)
          }}
          isRadio={true}
          textBooks={{
            createTitle: `快速邀请成员并成为负责人`,
            mainTitle: `项目负责人`,
          }}
          actionButtons={
            JSON.parse(localStorage.getItem('userData'))?.admin
              ? {
                  create: { title: '快速邀请成员并成为负责人' },
                  manage: { isHide: true },
                }
              : {
                  create: { isHide: true },
                  manage: { isHide: true },
                }
          }
          form={{
            isHidSubmit: true,
            fields: (props) => {
              return {
                userId: {
                  inline: true,
                  children: (
                    <>
                      <AddList data={addList} optionEvent={optionEvent} />
                    </>
                  ),
                },
              }
            },
            fieldsShow: ({ fields }) => {
              return (
                <div style={{ minWidth: '350px' }}>
                  <div
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      display: 'flex',
                      lineHeight: '30px',
                    }}>
                    {fields.userId}
                  </div>
                </div>
              )
            },
            // verify: (initial, current) => {
            //   const errorObj = {}
            //   const { userId } = current
            //   if (!userId) {
            //     errorObj.userId = '请选择用户'
            //   }
            //   return errorObj
            // },
          }}
        />
      </>
    )
  }

  const onClose = () => {
    updateData({
      drawerVisible: false,
      seachValue: {},
      drawerType: '',
      fileIds: '',
      editLoading: false,
      isHangup: false,
    })
    // setShowSubmit(true)
    setAddrolds(false)
  }

  function saveData(newValue) {
    if (drawerType === 'add') {
      newValue.projectAvatar = fileIds
      dispatch({
        type: 'projectUpdate/addProject',
        payload: { newValue, callback: fun.fun, userName: user.userName },
      })
    } else if (drawerType === 'edit') {
      newValue.id = id
      newValue.projectAvatar = fileIds
      // seachValue.projectLeaderId = seachValue?.projectLeaderId[0]?.value
      dispatch({
        type: 'projectUpdate/updateProject',
        payload: { newValue, callback: fun.fun },
      })
    }
    dispatch({
      type: 'projectUpdate/updateState',
      payload: {
        editLoading: true,
      },
    })
  }

  // //项目负责人-模糊搜索
  // const [option, setOption] = useState(userList || '')
  // const handleSearch = (e) => {
  //   setTimeout(() => {
  //     const filterOpion = userList?.filter(
  //       (item) => !!item.label.includes(e?.trim())
  //     )
  //     setOption([...filterOpion])
  //   }, 500)
  // }
  // //项目负责人-默认
  // let dataprojectLeaderId = userList.filter(function (item) {
  //   return item.value === seachValue?.projectLeaderId
  // })
  const proform = () => {
    return (
      <ProForm
        customWidgetsList={{ dropdown: dropdown }}
        formType="pure"
        form={baseRef}
        formDatas={[
          {
            label: '项目名称:',
            key: 'name',
            widget: 'input',
            initialValue: seachValue?.name,
            widgetProps: {
              onChange: () => {
                // setShowSubmit(false)
                setAddrolds(false)
              },
            },
            placeholder: '请输入项目名称',
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入项目名称' }],
          },
          {
            label: '项目负责人:',
            key: 'projectLeaderId',
            widget: 'dropdown',
            span: '24',
            required: true,
            // rules: [{ required: true, message: '请输入项目负责人' }],
            hide: drawerType === 'add',
          },
          {
            label: '起始日期:',
            key: 'begin',
            initialValue: seachValue?.begin,
            placeholder: '请选择起始日期',
            widget: 'dateInput',
            disabled: isHangup,
            widgetProps: {
              format: 'YYYY-MM-DD',
              // onChange: () => {
              //   setShowSubmit(false)
              // },
              onClick: () => {
                setAddrolds(false)
              },
            },
            span: '24',
            required: true,
            help: isHangup ? '项目挂起后不能编辑日期' : '',
            // rules: [{ required: true, message: '请输入起始日期' }],
          },
          {
            label: '截止日期:',
            key: 'end',
            initialValue: seachValue?.end,
            widget: 'dateInput',
            placeholder: '请选择截止日期',
            widgetProps: {
              format: 'YYYY-MM-DD',
              // onChange: () => {
              //   setShowSubmit(false)
              // },
              onClick: () => {
                setAddrolds(false)
              },
            },
            span: '24',
            required: true,
            disabled: isHangup,
            help: isHangup ? '项目挂起后不能编辑日期' : '',
            // rules: [
            //   {
            //     validator: (value) => {
            //       const obj = baseRef?.getFieldValues()
            //       console.log(obj, formatter(value))
            //       if ((Object.keys(obj).length > 0 && formatter(value) >= formatter(obj.begin) || !formatter(obj.begin)))
            //         return true
            //     },
            //     message: '截止日期必须晚于或等于起始日期且不为空',
            //   },
            // ],
          },
          {
            label: '项目描述:',
            placeholder: '请输入项目描述',
            key: 'descr',
            widget: 'textarea',
            initialValue: seachValue?.descr,
            widgetProps: {
              onChange: () => {
                // setShowSubmit(false)
                setAddrolds(false)
              },
            },
            span: '24',
          },
          {
            label: '项目Logo:',
            key: 'projectAvatar',
            widget: 'upload',
            span: '24',
            initialValue: seachValue.projectAvatar
              ? [
                  {
                    dataURL: `/api/file/selectFile/${seachValue.projectAvatar}`,
                  },
                ]
              : null,
            widgetProps: {
              uploadType: 'card',
              maxNumber: 1,
              showFileIcon: {
                showPreviewIcon: true,
                showRemoveIcon: true,
              },
              onChange: async (e) => {
                // setShowSubmit(false)
                setAddrolds(false)
                if (e.length > 0) {
                  await dispatch({
                    type: 'projectUpdate/uploadFile',
                    payload: { file: e[0]?.file },
                  })
                } else {
                  await updateData({
                    fileIds: '',
                  })
                }
              },
            },
          },
          {
            label: '是否挂起:',
            key: 'status',
            widget: 'switch',
            initialValue: isHangup,
            span: '24',
            widgetProps: {
              onChange: () => {
                // setShowSubmit(false)
                setAddrolds(false)
                updateData({ isHangup: !isHangup })
              },
            },
            help: '挂起指的是项目暂时停止开发',
            hide: drawerType === 'add',
          },
        ]}
        onSubmit={(initial, current) => {
          console.log(current)
          const errorObj = {}
          if (!current?.name) {
            errorObj.name = '请输入项目名称'
          }
          if (!current?.begin) {
            errorObj.begin = '请输入起始日期'
          }
          if (!current?.end) {
            errorObj.end = '请输入截止日期'
          }
          if (
            current?.begin &&
            current?.end &&
            formatter(current?.end) < formatter(current?.begin)
          ) {
            errorObj.end = '截止日期必须晚于或等于起始日期'
          }
          if (Object.keys(errorObj).length > 0) {
            const err = new Error()
            err.filed = errorObj
            throw err
          }
          const newValue = {
            ...current,
            projectLeaderId: seachValue.projectLeaderId,
            begin: formatter(current.begin),
            end: formatter(current.end),
          }
          saveData(newValue)
        }}
        // onChange={(initial, current) => {
        //   let begin = formatter(current.begin)
        //   let end = formatter(current.end)
        //   current.begin = begin
        //   current.end = end
        //   updateData({
        //     seachValue: {
        //       ...current,
        //       projectLeaderId: seachValue.projectLeaderId,
        //     },
        //   })
        // }}
      />
    )
  }
  return (
    <div className={styles.layout}>
      <ProDrawer
        visible={drawerVisible}
        usePortal={false}
        width={500}
        onClose={onClose}
        title={drawerType === 'edit' ? '编辑' : '新增'}
        buttons={[
          // {
          //   label: '取消',
          //   onClick: onClose,
          // },
          {
            label: '保存',
            type: 'primary',
            style: { width: '80px' },
            // disabled: showSubmit,
            loading: editLoading,
            onClick: () => {
              baseRef?.submitvalidate()
              // await baseRef?.submitvalidate?.()
              // const obj = baseRef?.getFieldValues()
              // console.log(obj)
              // const errors = baseRef.getError()
              // if (errors && Object.keys(errors).length > 0) return
              // saveData()
              // setShowSubmit(true)
            },
          },
        ]}>
        <Loader
          loading={loading.effects.projectUpdate.selectAllUserlist}
          bgColor="rgba(0, 0, 0, 0.4)"
          style={{ width: '100%' }}
          tip="loading...">
          <div>
            {drawerType === 'add' ? (
              proform()
            ) : drawerType === 'edit' ? (
              Object.keys(seachValue).length ? (
                proform()
              ) : (
                <></>
              )
            ) : (
              ''
            )}
          </div>
        </Loader>
      </ProDrawer>
    </div>
  )
}

export default ProjectManagement

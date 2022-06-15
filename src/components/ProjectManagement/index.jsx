import { useDispatch, useSelector } from 'react-redux'
import { ProDrawer, ProForm, useForm } from '@uiw-admin/components'
import { Loader } from 'uiw'
import formatter from '@uiw/formatter'
import { useState } from 'react'
import CompDropdown from '../../components/CompDropdown'
import { initListData } from '@/utils/utils'
import styles from './index.module.less'

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
  const [showSubmit, setShowSubmit] = useState(true)
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
      fileIds, //Logo文件的id
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
          selectLabel={(e) => {
            baseRef.setFieldValue('projectLeaderId', e)
            setAddrolds(false)
            setShowSubmit(false)
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
          createTag={(_, current) => {
            console.log(current)
            return true
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
    })
    setShowSubmit(true)
    setAddrolds(false)
  }

  function saveData() {
    if (drawerType === 'add') {
      seachValue.projectAvatar = fileIds
      dispatch({
        type: 'projectUpdate/addProject',
        payload: { seachValue, callback: fun.fun, userName: user.userName },
      })
    } else if (drawerType === 'edit') {
      seachValue.id = id
      seachValue.projectAvatar = fileIds
      // seachValue.projectLeaderId = seachValue?.projectLeaderId[0]?.value
      dispatch({
        type: 'projectUpdate/updateProject',
        payload: { seachValue, callback: fun.fun },
      })
    }
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
                setShowSubmit(false)
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
            // initialValue: dataprojectLeaderId,
            // placeholder: '请选择项目负责人',
            // option: option,
            // widgetProps: {
            // mode: 'single',
            // labelInValue: true,
            // showSearch: true,
            // allowClear: true,
            // onSearch: handleSearch,
            // onChange: () => {
            //   setShowSubmit(false)
            // },
            // },
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
            widgetProps: {
              format: 'YYYY-MM-DD',
              onChange: () => {
                setShowSubmit(false)
              },
              onClick: () => {
                setAddrolds(false)
              },
            },
            span: '24',
            required: true,
            rules: [{ required: true, message: '请输入起始日期' }],
          },
          {
            label: '截止日期:',
            key: 'end',
            initialValue: seachValue?.end,
            widget: 'dateInput',
            placeholder: '请选择截止日期',
            widgetProps: {
              format: 'YYYY-MM-DD',
              onChange: () => {
                setShowSubmit(false)
              },
              onClick: () => {
                setAddrolds(false)
              },
            },
            span: '24',
            required: true,
            rules: [
              {
                validator: (value) => {
                  const obj = baseRef?.getFieldValues()
                  if (Object.keys(obj).length > 0 && value >= obj.begin)
                    return true
                },
                message: '截止日期必须晚于或等于起始日期且不能为空',
              },
            ],
          },
          {
            label: '项目描述:',
            placeholder: '请输入项目描述',
            key: 'descr',
            widget: 'textarea',
            initialValue: seachValue?.descr,
            widgetProps: {
              onChange: () => {
                setShowSubmit(false)
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
                setShowSubmit(false)
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
            widgetProps: {
              onChange: () => {
                setShowSubmit(false)
                setAddrolds(false)
              },
            },
            hide: drawerType === 'add',
          },
        ]}
        onChange={(initial, current) => {
          let begin = formatter(current.begin)
          let end = formatter(current.end)
          current.begin = begin
          current.end = end
          updateData({
            seachValue: {
              ...current,
              projectLeaderId: seachValue.projectLeaderId,
            },
          })
        }}
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
          {
            label: '取消',
            onClick: onClose,
          },
          {
            label: '保存',
            type: 'primary',
            disabled: showSubmit,
            onClick: async () => {
              await baseRef?.submitvalidate?.()
              const errors = baseRef.getError()
              if (errors && Object.keys(errors).length > 0) return
              saveData()
              setShowSubmit(true)
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

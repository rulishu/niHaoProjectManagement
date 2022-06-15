import { useEffect, useState } from 'react'
import { ProForm, useForm } from '@uiw-admin/components'
import { useDispatch } from 'react-redux'
const LabelSelect = (props) => {
  const { assignmentLabels, teamMembers, updateData, todolist } = props
  const [label, setLabel] = useState(assignmentLabels)
  const [team, setTeam] = useState(teamMembers)
  const dispatch = useDispatch()
  const form = useForm()
  useEffect(() => {
    setLabel(assignmentLabels)
    setTeam(teamMembers)
  }, [assignmentLabels, teamMembers])
  const changeFun = (props) => {
    const value = { ...form.getFieldValues?.(), ...props }
    let splicingConditionsDtos = []

    Object.keys(value).forEach((item) => {
      if (value[item].length > 0) {
        value[item].forEach((i) => {
          splicingConditionsDtos.push({
            field: i.label,
            value: i.value,
          })
        })
      }
    })
    if (todolist.activeKey !== '') {
      splicingConditionsDtos.push({
        field: 'status',
        value: todolist.activeKey,
      })
    }
    updateData({ splicingConditionsDtos })
    dispatch.todolist.getList({
      status: todolist.activeKey,
      projectId: value?.label[0]?.value,
      assignUserId: value?.author[0]?.value,
    })
  }

  return (
    <div style={{ padding: '0 4px' }}>
      <ProForm
        form={form}
        formType="pure"
        formDatas={[
          {
            label: '',
            key: 'label',
            widget: 'searchSelect',
            option: label,
            widgetProps: {
              mode: 'single',
              labelInValue: true,
              placeholder: '项目',
              onSearch: (value) => {
                const filterOpion = assignmentLabels.filter((item) =>
                  item.label.includes(value.trim())
                )
                setLabel(filterOpion)
              },
              onChange: (value) => {
                changeFun({ label: value })
              },
              // onSelect: (value) => console.log('selectvalue', value),
              // loading: loading,
              allowClear: true,
              showSearch: true,
              style: { width: '260px' },
            },
            span: '6',
          },
          {
            label: '',
            key: 'author',
            widget: 'searchSelect',
            option: team,
            widgetProps: {
              mode: 'single',
              labelInValue: true,
              placeholder: '指办人',
              onSearch: (value) => {
                const filterOpion = teamMembers.filter((item) =>
                  item.label.includes(value.trim())
                )
                setTeam([...filterOpion])
              },
              onChange: (value) => {
                changeFun({ author: value })
              },
              // onSelect: (value) => console.log('selectvalue', value),
              // loading: loading,
              allowClear: true,
              showSearch: true,
              style: { width: '260px' },
            },
            span: '6',
          },
          // {
          //   label: '',
          //   key: 'assignee',
          //   widget: 'searchSelect',
          //   option: team,
          //   widgetProps: {
          //     mode: 'single',
          //     labelInValue: true,
          //     placeholder: '指派',
          //     onSearch: (value) => {
          //       const filterOpion = teamMembers.filter((item) =>
          //         item.label.includes(value.trim())
          //       )
          //       setTeam([...filterOpion])
          //     },
          //     onChange: (value) => {
          //       changeFun({ assignee: value })
          //     },
          //     // onSelect: (value) => console.log('selectvalue', value),
          //     // loading: loading,
          //     allowClear: true,
          //     showSearch: true,
          //     style: { width: '100%' },
          //   },
          //   span: '6',
          // },
        ]}
      />
    </div>
  )
}

export default LabelSelect

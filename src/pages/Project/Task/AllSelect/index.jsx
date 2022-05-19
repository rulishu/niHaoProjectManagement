import { useEffect, useState } from 'react'
import { ProForm, useForm } from '@uiw-admin/components'

const LabelSelect = (props) => {
  const {
    assignmentLabels,
    teamMembers,
    milistones,
    updateData,
    pageS,
    project,
  } = props
  const [label, setLabel] = useState(assignmentLabels)
  const [team, setTeam] = useState(teamMembers)
  const [milistone, setMilistone] = useState(milistones)

  const form = useForm()

  useEffect(() => {
    setLabel(assignmentLabels)
    setTeam(teamMembers)
  }, [assignmentLabels, teamMembers])

  const changeFun = (props) => {
    console.log('props: ', props)
    const value = { ...form.getFieldValues?.(), ...props }
    console.log('value: ', value)
    let splicingConditionsDtos = []

    Object.keys(value).forEach((item) => {
      if (value[item].length > 0) {
        value[item].forEach((i) => {
          splicingConditionsDtos.push({
            condition: '=',
            field: i.label,
            value: i.value,
          })
        })
      }
    })
    console.log('splicingConditionsDtos: ', splicingConditionsDtos)
    if (project.activeKey !== '') {
      splicingConditionsDtos.push({
        condition: '=',
        field: 'assignmentStatus',
        value: project.activeKey,
      })
    }
    updateData({ splicingConditionsDtos })
    pageS({
      assignmentStatus: project.activeKey,
    })
  }

  return (
    <div>
      <ProForm
        form={form}
        formType="pure"
        formDatas={[
          {
            label: '',
            key: 'author',
            widget: 'searchSelect',
            option: team,
            widgetProps: {
              mode: 'multiple',
              labelInValue: true,
              placeholder: '作者',
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
              style: { width: '100%' },
            },
            span: '6',
          },
          {
            label: '',
            key: 'assignee',
            widget: 'searchSelect',
            option: team,
            widgetProps: {
              mode: 'multiple',
              labelInValue: true,
              placeholder: '指派',
              onSearch: (value) => {
                const filterOpion = teamMembers.filter((item) =>
                  item.label.includes(value.trim())
                )
                setTeam([...filterOpion])
              },
              onChange: (value) => {
                changeFun({ assignee: value })
              },
              // onSelect: (value) => console.log('selectvalue', value),
              // loading: loading,
              allowClear: true,
              showSearch: true,
              style: { width: '100%' },
            },
            span: '6',
          },
          {
            label: '',
            key: 'milistone',
            widget: 'searchSelect',
            option: milistone,
            widgetProps: {
              mode: 'multiple',
              labelInValue: true,
              placeholder: '里程碑',
              onSearch: (value) => {
                const filterOpion = milistones.filter((item) =>
                  item.label.includes(value.trim())
                )
                console.log('filterOpion: ', filterOpion)
                setMilistone([])
              },
              onChange: (value) => {
                changeFun({ milistone: value })
              },
              // onSelect: (value) => console.log('selectvalue', value),
              // loading: loading,
              allowClear: true,
              showSearch: true,
              style: { width: '100%' },
            },
            span: '6',
          },
          // {
          //   label: '',
          //   key: 'release',
          //   widget: 'searchSelect',
          //   option: option,
          //   widgetProps: {
          //     mode: 'multiple',
          //     labelInValue: true,
          //     placeholder: '状态',
          //     onSearch: (value) => console.log('onSearch', value),
          //     onChange: (value) => console.log('changevalue', value),
          //     onSelect: (value) => console.log('selectvalue', value),
          //     // loading: loading,
          //     allowClear: true,
          //     showSearch: true,
          //     style: { width: '100%' },
          //   },
          //   span: '4',
          // },
          {
            label: '',
            key: 'label',
            widget: 'searchSelect',
            option: label,
            widgetProps: {
              mode: 'multiple',
              labelInValue: true,
              placeholder: '标签',
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
              style: { width: '100%' },
            },
            span: '6',
          },
        ]}
      />
    </div>
  )
}

export default LabelSelect

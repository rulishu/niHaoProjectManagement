import { useEffect, useState } from 'react'
import { ProForm, useForm } from '@uiw-admin/components'
import styles from '../index.module.less'

const LabelSelect = (props) => {
  const {
    labelsListData,
    teamMembers,
    milistones,
    updateData,
    pageS,
    project,
    labelSearch,
  } = props
  const [label, setLabel] = useState([])
  const [team, setTeam] = useState(teamMembers)
  const [milistone, setMilistone] = useState(milistones)

  const form = useForm()

  useEffect(() => {
    setLabel(
      labelsListData.map((item) => {
        return {
          value: item.value,
          label: item.label,
        }
      })
    )
    setTeam(teamMembers)
    setMilistone(milistones)
  }, [labelsListData, teamMembers, milistones])

  useEffect(() => {
    if (labelSearch) {
      form.setFields({ labels: [labelSearch] })
      changeFun({ labels: [labelSearch] })
    }
  }, [labelSearch]) // eslint-disable-line

  const changeFun = (props) => {
    const value = { ...form.getFieldValues?.(), ...props }
    let selectDtos = []
    Object.keys(value).forEach((item) => {
      if (value[item].length > 0) {
        value[item].forEach((i) => {
          selectDtos.push({
            condition: '=',
            field: item,
            value: i.value,
          })
        })
      }
    })
    updateData({ selectDtos: [...selectDtos] })
    pageS({
      assignmentStatus: project.activeKey,
    })
  }

  return (
    <div style={{ padding: '0 4px' }}>
      <div className={styles.boxProForm}>
        <ProForm
          form={form}
          formType="pure"
          formDatas={[
            {
              label: '',
              key: 'createId',
              widget: 'searchSelect',
              option: team,
              widgetProps: {
                mode: 'multiple',
                labelInValue: true,
                placeholder: '作者',
                onSearch: (value) => {
                  const filterOpion = teamMembers.filter((item) =>
                    item?.label?.includes(value.trim())
                  )
                  setTeam([...filterOpion])
                },
                onChange: (value) => {
                  changeFun({ createId: value })
                },
                allowClear: true,
                showSearch: true,
                style: {
                  width: 'calc((100vw - 200px - 28px - 30px - 40px) / 4)',
                },
              },
              span: '6',
            },
            {
              label: '',
              key: 'assignmentId',
              widget: 'searchSelect',
              option: team,
              widgetProps: {
                mode: 'multiple',
                labelInValue: true,
                placeholder: '指派',
                onSearch: (value) => {
                  const filterOpion = teamMembers.filter((item) =>
                    item?.label?.includes(value.trim())
                  )
                  setTeam([...filterOpion])
                },
                onChange: (value) => {
                  changeFun({ assignmentId: value })
                },
                allowClear: true,
                showSearch: true,
                style: {
                  width: 'calc((100vw - 200px - 28px - 30px - 40px) / 4)',
                },
              },
              span: '6',
            },
            {
              label: '',
              key: 'milestonesId',
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
                  setMilistone([...filterOpion])
                },
                onChange: (value) => {
                  changeFun({ milestonesId: value })
                },
                // onSelect: (value) => console.log('selectvalue', value),
                // loading: loading,
                allowClear: true,
                showSearch: true,
                style: {
                  width: 'calc((100vw - 200px - 28px - 30px - 40px) / 4)',
                },
              },
              span: '6',
            },
            {
              label: '',
              key: 'labels',
              widget: 'searchSelect',
              option: label,
              widgetProps: {
                mode: 'multiple',
                labelInValue: true,
                placeholder: '标签',
                onSearch: (value) => {
                  const filterOpion = labelsListData.filter((item) =>
                    item?.label?.includes(value.trim())
                  )
                  setLabel(
                    filterOpion.map((item) => {
                      return {
                        value: item.value,
                        label: item.label,
                      }
                    })
                  )
                },
                onChange: (value) => {
                  changeFun({ labels: value })
                },
                showSearch: true,
                allowClear: true,
                style: {
                  width: 'calc((100vw - 200px - 28px - 30px - 40px) / 4)',
                },
              },
              span: '6',
            },
          ]}
        />
      </div>
    </div>
  )
}

export default LabelSelect

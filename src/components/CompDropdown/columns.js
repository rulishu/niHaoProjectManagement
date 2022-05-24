import { Input, DateInput } from 'uiw'
import Custom from './Custom'
import styles from './template.module.less'

// 配置 label 的模板
const label = {
  // 数据渲染头部
  header: [
    {
      title: '色块',
      dataIndex: 'color',
      width: 30,
      component: (item, record) => (
        <span
          className={styles.piece}
          style={{ backgroundColor: item?.color }}></span>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      resultsShow: true,
      isSearch: true,
      width: 100,
      component: (item, record) => (
        <span className={styles.title}>{item?.title}</span>
      ),
    },
  ],
  // 配置参数
  params: {
    title: '标签',
  },
  // 船舰标签的表单
  form: {
    fields: (props) => {
      return {
        dictLabel: {
          children: <Input size="small" placeholder="请输入标签" />,
        },
        listClass: {
          children: <Custom color={props?.color} />,
        },
      }
    },
    fieldsShow: ({ fields, state, canSubmit, resetForm }) => {
      return (
        <>
          <div className={styles.searchBox}>{fields.dictLabel}</div>
          {fields.listClass}
        </>
      )
    },
    verify: (initial, current) => {
      const errorObj = {}
      if (current.dictLabel.length < 2 || current.dictLabel.length > 50) {
        errorObj.dictLabel = '请输入标签名称,长度为2-50'
      }
      if (!current.listClass) {
        errorObj.listClass = '请选择或输入标签背景颜色'
      }
      return errorObj
    },
  },
}

// 配置 personnel 的模板
const personnel = {
  // 数据渲染头部
  header: [
    {
      title: '人员名称',
      dataIndex: 'memberName',
      resultsShow: true,
      isSearch: true,
      component: (item, record) => <span>{item?.memberName}</span>,
    },
    {
      title: '角色',
      dataIndex: 'memberRole',
      resultsShow: true,
      // isSearch: true,
      component: (item, record) => (
        <span>{item?.projectId && '/角色' + item?.memberRole}</span>
      ),
    },
    {
      title: '项目',
      dataIndex: 'projectId',
      resultsShow: true,
      component: (item, record) => (
        <span>{item?.projectId && '/项目' + item?.projectId}</span>
      ),
    },
  ],
  // 配置参数
  params: {
    title: '人员',
  },
  // 船舰标签的表单
  form: {
    fields: (props) => {
      return {
        dictLabel: {
          children: <Input size="small" placeholder="请输入人员" />,
        },
        listClass: {
          children: <Custom color={props?.color} />,
        },
      }
    },
    fieldsShow: ({ fields, state, canSubmit, resetForm }) => {
      return (
        <>
          <div className={styles.searchBox}>{fields.dictLabel}</div>
          {fields.listClass}
        </>
      )
    },
    verify: (initial, current) => {
      const errorObj = {}
      if (current.dictLabel.length < 2 || current.dictLabel.length > 50) {
        errorObj.dictLabel = '请输入标签名称,长度为2-50'
      }
      if (!current.listClass) {
        errorObj.listClass = '请选择或输入标签背景颜色'
      }
      return errorObj
    },
  },
}

// 配置 milepost 的模板
const milepost = {
  // 数据渲染头部
  header: [
    {
      title: '标题',
      dataIndex: 'title',
      resultsShow: true,
      isSearch: true,
      component: (item) => <span className={styles.title}>{item?.title}</span>,
    },
  ],
  // 配置参数
  params: {
    title: '里程碑',
  },
  // 船舰标签的表单
  form: {
    fields: (props) => {
      return {
        milestonesTitle: {
          inline: true,
          required: true,
          children: <Input placeholder="请输入标题" />,
        },
        startTime: {
          inline: true,
          required: true,
          labelFor: 'date-inline',
          children: (
            <DateInput
              format="YYYY-MM-DD"
              datePickerProps={{ todayButton: '今天' }}
            />
          ),
        },
      }
    },
    fieldsShow: ({ fields, state, canSubmit, resetForm }) => {
      return (
        <>
          <div className={styles.searchBox}>{fields.milestonesTitle}</div>
          <div className={styles.searchBox}>{fields.startTime}</div>
        </>
      )
    },
    verify: (initial, current) => {
      const errorObj = {}
      const { milestonesTitle, startTime } = current
      if (
        !milestonesTitle ||
        milestonesTitle.length < 2 ||
        milestonesTitle.length > 100
      ) {
        errorObj.milestonesTitle = '请输入标题,长度为2~100'
      }
      if (!startTime) {
        errorObj.startTime = '开始时间不能为空！'
      }
      return errorObj
    },
  },
}

const columns = { label, personnel, milepost }

export default columns

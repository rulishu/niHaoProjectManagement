## CompDropdown

集成创建内容的 __下拉菜单__ 组件，综合下拉菜单，解决业务中，选择内容并可以自定义创建内容表单组件.

## 何时使用

当你的下拉菜单需要支持创建内容的时候

### 基础用例

```jsx
import { CompDropdown } from '@/components'

function Demo() {
  const initListDataaa = () => {
    return [
      [
        { dictCode: 1, listClass: '#000', dictLabel: 'BUG', check: false },
        { dictCode: 2, listClass: '#333', dictLabel: '优化', check: true },
      ].map(item => {
          return {
            key: item?.dictCode,
            color: item?.listClass,
            title: item?.dictLabel,
            check: item?.check,
          }
        }
      )
    ]
  }
  return (
     <CompDropdown
        listData={initListData()}
        template="label"
        shape="label"
        selectLabel={(_, selKey) => selectLabel(selKey)}
        runLabel={(e) => { console.log('runLabel====>',runLabel)}}
        createTag={(initial, current) => console.log('createTag====>',initial, current)}
    />
  );
}

ReactDOM.render(<Demo />, _mount_);

```

## Props

| 参数           | 说明                    | 类型                          | 默认值 |
| -------------- | -------------------------------- | ----------------------------------------------- | ------ |
| listData        | 数据源（根据指定 `labelHeader` 来渲染数据）（必填）      | `listData[]      | `[]`     |
| isOpen | 组件是否显示下拉菜单 | `Boolean`     | `false`
| labelHeader   | 组件头（当使组件`template`有`header`字段时，可以不传改字段）` | `labelHeader{}`（必填）     | - |
| template  | 模板         |   `template`        |  -     |
| form      | 创建内容表单   | `formProps`        |  -     |
| title     | 主题文字       | `String`  | -    |
| isRadio   | 是否是单选     | `Boolean`     | `false`    |
| shape     | 结果框样式     | `String` 'input','label'（必填）      |    -   |
| loading| 是否处于加载中    | `Boolean`  | `false`   |
| selectLabel    | 选项选择回调函数  | `function(value,result[])`    | -  |
| runLabel       | 管理按钮的回调  | `function()`    | -  |
| searchLabel    | 标签搜索框改变触发回调  | `function(value,result[])`    | -  |
| createTag      | 新建标签提交回调函数  | `function(initial, current)`    | -  |
| createTagChange | 新建标签变化回调函数  | `function(initial, current)`    | -  |
| isTagClose     | 是否在 Tag 展示关闭按钮  | `Boolean`    | `false`  |
| closeLabel     | 关闭组件触发回调  | `function()`    | - |
| actionButtons  | 操作按钮组  | `actionButtons{}`    | - |
| isClickLabelShow  | 点击组件是否展示下拉  | `Boolean`     | - |
| onClickLabelShow  | 点击组件触发事件  | `function()`    | - |
| onChange  | 与 `selectLabel` 事件一样,为了方便组件应用与form  | `selectLabel{}`    | - |
| isAutoDown  | 选中是否自动收起(只在 `isRadio === true` 时有效)  | `Boolean`    | `true` |
| isGonnaHitDeselect  | 是否点击取消选中(只在 `isRadio === true` 时有效)  | `Boolean`    | `true` |
| dropdownWindow  | 继承自[uiw OverlayTrigger](https://uiwjs.github.io/#/components/overlay-trigger)的所有属性 | `OverlayTrigger Props`    | `{}` |
| dropdownCardBodyClassName  | 下拉卡片内容 class 名称  | `className`    | true |


### listData

组件数据源

| 参数            | 说明                                     | 类型     | 默认值 |
| -------------- | ---------------------------------------- | -------- | ------ |
| key            | 唯一标识符          | `String`       |    -    |
| check          | 是否被选中          | `Boolean`    | `false` |

其余属性参考至 组件 `labelHeader`

### labelHeader

组件头

| 参数            | 说明                                     | 类型     | 默认值 |
| --------------- | ---------------------------------------- | -------- | ------ |
| title        | 文字内容                               |   `String` | -  | checkbox |
| dataIndex    | 唯一标识符（必填） | `String`   | -     |
| width | 选中默认值              | `Number`   |  -  |
| component | 自定义组件（会覆盖 `dataIndex` ）  |  `(rowData:{}, record) => JSX.Element`   | -      |

### actionButtons props

操作按钮组参数

| 参数 | 说明    | 类型             | 默认值 |
| ---- | ------- | ---------------- | ------ |
| create | 创建内容按钮 | { isHide:是否隐藏按钮,title:按钮文字 } | -   |
| manage | 管理内容按钮 | { isHide:是否隐藏按钮,title:按钮文字 } | -  |

### form
创建内容form

| 参数 | 说明    | 类型             | 默认值 |
| ---- | ------- | ---------------- | ------ |
| fields     | 继承自[uiw form](https://uiwjs.github.io/#/components/form)的  `fields`   |  | -   |
| fieldsShow | 渲染表单回调 `(fields, state, canSubmit, resetForm) => JSX.Element `  继承自[uiw form](https://uiwjs.github.io/#/components/form)的  `children`|  | -      |
| verify     | 表单校验 | `(initial, current)=> errorObj{}` | -  |

其余属性与uiw Table一致

### template props

模板字段,模板内字段优先级低于组件`Props`
已经内置了两个模板`label` `personnel`

| 参数 | 说明    | 类型             | 默认值 |
| ---- | ------- | ---------------- | ------ |
| header   | labelHeader | labelHeader | -   |
| form | form | form | -  |
| params | 参数 | {title:`title`} | -  |
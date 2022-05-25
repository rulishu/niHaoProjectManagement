import { useMemo, useRef, useState } from 'react'
import { Dropdown, Menu, Input, Tag } from 'uiw'
import './index.css'

const firstArr = [
  { value: 'author', label: 'author' },
  { value: 'assignee', label: 'assignee' },
  { value: 'milistone', label: 'milistone' },
  { value: 'release', label: 'release' },
  { value: 'label', label: 'label' },
]

const thirdArr = [
  { value: 'aaa', label: 'aaa' },
  { value: 'bbb', label: 'bbb' },
  { value: 'ccc', label: 'ccc' },
]

const LabelSelect = (props) => {
  const {
    option = [
      { value: 1, text: '打开' },
      { value: 2, text: '关闭' },
      { value: '', text: '所有' },
    ],
    onChange,
    data = thirdArr,
  } = props

  const [value, setValue] = useState('') // input输入框的值
  const [tagList, setTagList] = useState([]) // 选中的标签
  const [open, setOpen] = useState(false) // 下拉框的开关
  const [options, setOptions] = useState(option)

  //   const keyDown = (e: any) => {
  //     console.log("!!!!", e);
  //   };

  //   useEffect(() => {
  //     document.addEventListener("keydown", keyDown);
  //   });

  // eslint-disable-next-line no-sparse-arrays
  const equals = [{ label: '=', value: '=' }, , { label: '!=', value: '!=' }]

  const inputRef = useRef(null)
  // console.log('inputRef: ', inputRef)

  const tags = useMemo(() => {
    if (tagList.length > 0) {
      return tagList.map((item, index) => (
        <Tag
          key={index}
          title={item.label}
          color={item.color}
          style={{ fontSize: 16, textAlign: 'center' }}
        />
      ))
    }
  }, [tagList])
  // console.log('tagList: ', tagList)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: 'gray',
        borderStyle: 'solid',
        paddingLeft: 5,
      }}>
      {tags}
      <Dropdown
        trigger="click"
        onVisibleChange={(isOpen) => setOpen(isOpen)}
        isOpen={open}
        menu={
          <div>
            <Menu bordered style={{ minWidth: 120 }}>
              {options.map((item, idx) => {
                //   const active =
                //     tagList.findIndex((i) => i.value === item.value) > -1;
                return (
                  <Menu.Item
                    key={idx}
                    //   active={active}
                    text={item.label}
                    onClick={(e) => {
                      // console.log('e: ', e)
                      // // 如果已经选了，就让他取消选中
                      // if (active) {
                      //   tagList.splice(
                      //     tagList.findIndex((i) => i.value === item.value),
                      //     1
                      //   );
                      // } else {
                      // 没选中就将数据添加到tag数组中
                      let col = '#1EABCD'

                      if (parseInt(String(tagList.length % 3)) === 1) {
                        col = '#28a745'
                      }
                      if (parseInt(String(tagList.length % 3)) === 2) {
                        col = '#008EF0'
                      }
                      setTagList(
                        tagList.concat([
                          {
                            value: item.value,
                            label: item.label,
                            color: col,
                          },
                        ])
                      )
                      // }
                      // 关闭Dropdown
                      setOpen(false)
                      onChange && onChange(item.value, e)
                    }}
                  />
                )
              })}
            </Menu>
          </div>
        }>
        <Input
          className="labinput"
          ref={inputRef}
          onFocus={() => {
            if (parseInt(String(tagList.length % 3)) === 0) {
              setOptions(firstArr)
            }
            if (parseInt(String(tagList.length % 3)) === 1) {
              setOptions(equals)
            }
            if (parseInt(String(tagList.length % 3)) === 2) {
              // tagList.slice(-2,-1)
              const str = tagList[tagList.length - 2].label
              // console.log('str: ', str)
              let arr = []
              data.forEach((item) => {
                // console.log('88', Object.keys(item))

                // 判断是否存在该属性
                if (Object.keys(item).findIndex((i) => i === str) > -1) {
                  arr.push({ label: item[str], value: item[str] })
                  // console.log('item[str]: ', item[str])
                }
              })
              // console.log('arr: ', arr)

              setOptions(arr)
            }
            //
            setOpen(true)
          }}
          onKeyDown={(e) => {
            // console.log('KeyDown: ', e.key)
            if (e.key === 'Backspace') {
              setTagList(tagList.splice(-1, 1))
            }
          }}
          placeholder="请输入内容"
          value={value}
          onChange={(e) => {
            // console.log()
            setValue(e.target.value)
          }}
        />
      </Dropdown>
    </div>
  )
}

export default LabelSelect

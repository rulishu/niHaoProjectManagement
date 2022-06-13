import React from 'react' // eslint-disable-line

export default function TitleEx(props) {
  // 定义需要使用的传入的父级数据和方法
  const { must, children } = props
  console.log('props', props)
  return (
    <span>
      {must ? (
        <span style={{ color: 'red', marginRight: 5 }}>*</span>
      ) : (
        <label style={{ marginRight: 12 }} />
      )}
      {children}
    </span>
  )
}

// 组件默认的props属性
TitleEx.defaultProps = {
  must: false,
}

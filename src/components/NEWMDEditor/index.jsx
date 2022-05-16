import MDEditor from '@uiw/react-md-editor'

const NEWMDEditor = (props) => {
  return (
    <MDEditor
      {...props}
      value={props.value}
      onChange={(value) => props.onChange(value)}
      style={{ flex: 1 }}
      preview="edit"
    />
  )
}

export default NEWMDEditor

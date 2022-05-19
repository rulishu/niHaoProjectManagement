import { useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
const NEWMDEditor = (props) => {
  const mdref = useRef()
  useEffect(() => {
    if (mdref?.current && props.rfval) {
      props.rfval(mdref)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mdref])

  return (
    <div data-color-mode="light" style={{ flex: 1 }}>
      <MDEditor
        // {...props}
        ref={mdref}
        value={props.value}
        onChange={(value) => props.onChange(value)}
        style={{ flex: 1 }}
        preview={props?.preview || 'edit'}
      />
    </div>
  )
}

export default NEWMDEditor

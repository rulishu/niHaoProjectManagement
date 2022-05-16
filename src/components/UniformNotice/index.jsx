import { Notify } from 'uiw'
import debounce from '@/utils/debounce'

const UniformNotice = (type, props, time = 300) => {
  return debounce(Notify[type], time, { ...props })
}
export default UniformNotice

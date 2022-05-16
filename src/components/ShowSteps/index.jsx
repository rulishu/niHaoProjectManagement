import Step from './Step'
import './style.css'

/**
 * This is the ShowSteps bar component
 * @param {listData} array 数据源
 * @param {size?} string small小 large大 组件大小
 * @return JSX.Element
 * className : className
 */
const ShowSteps = (props) => {
  const { listData, size } = props

  return (
    <div>
      {listData?.map((item, index) => (
        <Step size={size} item={item} key={index} />
      ))}
    </div>
  )
}

export default ShowSteps

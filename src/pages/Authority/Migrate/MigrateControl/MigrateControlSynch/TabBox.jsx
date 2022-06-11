import { Fragment } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { List, Empty } from 'uiw'

const TabBox = (props) => {
  const { data, type } = props
  const ListDataObj = {
    issues: ['title'],
    labels: ['name'],
    member: ['name'],
    milestone: ['title'],
  }

  return (
    <Fragment>
      <div>
        {data?.length ? (
          <List
            dataSource={data}
            renderItem={(item, index) => {
              return (
                <List.Item key={index}>
                  <div>{item[ListDataObj[type][0]]}</div>
                </List.Item>
              )
            }}
          />
        ) : (
          <Empty />
        )}
      </div>
    </Fragment>
  )
}

export default TabBox

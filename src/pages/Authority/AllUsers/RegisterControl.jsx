import { Form, FormItem, Switch, Divider } from 'uiw'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const RegisterControl = () => {
  const dispatch = useDispatch()

  const {
    allusers: { isRegister },
  } = useSelector((state) => state)

  useEffect(() => {
    dispatch({
      type: 'allusers/getRegisterSwitch',
    })
  }, [dispatch])

  return (
    <div>
      <Form>
        <FormItem
          style={{ marginTop: 15 }}
          inline={true}
          label="是否允许用户自行注册账号:"
          labelFor="basic-input-inline">
          <Switch
            size="large"
            checked={isRegister}
            onChange={() => {
              dispatch({
                type: 'allusers/registerSwitch',
              })
            }}
          />
        </FormItem>
      </Form>
      <Divider style={{ marginTop: 2 }}></Divider>
    </div>
  )
}

export default RegisterControl

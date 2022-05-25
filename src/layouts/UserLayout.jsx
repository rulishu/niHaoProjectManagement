import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'

export let navigate

const UserLayout = () => {
  navigate = useNavigate()

  const {
    login: { isLogin },
  } = useSelector((state) => state)

  return isLogin ? <Login /> : <Register />
}
export default UserLayout

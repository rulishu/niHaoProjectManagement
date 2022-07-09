import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Divider, Loader } from 'uiw'

let navigate
const ThridLogin = () => {
  const dispatch = useDispatch()
  const [isFullscreen, setIsFullscreen] = useState(false)
  navigate = useNavigate()

  const thirdLogin = () => {
    dispatch({
      type: 'login/getThirdLoginToken',
      payload: { navigate },
    })
  }

  useEffect(() => {
    const search = window.location.search
    console.log(search, window.location)
    if (search) {
      setIsFullscreen(true)
      const code = search.split('code=')[1]
      dispatch({
        type: 'login/authorAndLogin',
        payload: {
          param: { code },
          callback: () => setIsFullscreen(),
        },
      })
      // let url = window.location.href
      // url = url.replace(/(\?|#)[^'"]*/, '')
      // if (localStorage.getItem('token')) {
      //     history.push('/home')
      // navigate('/home', { replace: true })
      // }
    }
  }, [dispatch])

  const gitlab = (
    <svg width="18" height="18" viewBox="0 0 36 36">
      <path
        fill="#e24329"
        d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z"
      />
      <path
        fill="#e24329"
        d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z"
      />
      <path fill="#e24329" d="M18,34.38 3,14 33,14 Z" />
      <path fill="#fc6d26" d="M18,34.38 11.38,14 2,14 6,25Z" />
      <path fill="#fc6d26" d="M18,34.38 24.62,14 34,14 30,25Z" />
      <path
        fill="#fca326"
        d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z"
      />
      <path
        fill="#fca326"
        d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z"
      />
    </svg>
  )
  return (
    <>
      <Divider style={{ fontSize: 10, margin: 6, color: 'gray' }}>
        通过第三方账号登录
      </Divider>
      <Button type="link" onClick={thirdLogin}>
        {gitlab}
      </Button>
      <Loader
        tip="第三方登录加载中..."
        size="large"
        bgColor="rgba(255, 255, 255, 0.9)"
        fullscreen={isFullscreen}
        loading={isFullscreen}
      />
    </>
  )
}

export default ThridLogin

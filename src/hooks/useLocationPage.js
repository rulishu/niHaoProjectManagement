import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function useLocationPage() {
  const params = useParams()
  useEffect(() => {
    if (params && params.projectId) {
      sessionStorage.setItem('projectId', params.projectId)
      sessionStorage.setItem('userAccount', params.userAccount)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  return null
}

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import LeftPage from './leftPage'
import RightPage from './rightPage'
import useLocationPage from '@/hooks/useLocationPage'

export default function Home() {
  const dispatch = useDispatch()
  useLocationPage()
  const { projectId } = useParams()
  useEffect(() => {
    dispatch({
      type: 'projectoverview/getProjectDynamics', //动态
      payload: {
        projectId: projectId,
      },
    })
    dispatch({
      type: 'projectoverview/getProjectMembers', //成员
      payload: {
        projectId: projectId,
      },
    })
    dispatch({
      type: 'projectoverview/getProjectCountById', //统计
      payload: {
        projectId: projectId,
      },
    })
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <LeftPage />
      <RightPage />
    </div>
  )
}

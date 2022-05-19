import React from 'react'
import Search from './Search'
import useLocationPage from '@/hooks/useLocationPage'

const Index = () => {
  useLocationPage()
  return (
    <React.Fragment>
      <Search />
    </React.Fragment>
  )
}

export default Index

import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem;
`

export const Root = () => {
  return (
    <StyledRoot>
      <Navbar />
      <Outlet />
    </StyledRoot>
  )
}

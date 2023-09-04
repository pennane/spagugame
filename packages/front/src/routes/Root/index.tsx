import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const StyledContentWrapper = styled.div`
  margin: 0 2rem;
  margin-bottom: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const StyledContent = styled.div`
  max-width: 770px;
  width: 100%;
`

export const Root = () => {
  return (
    <StyledRoot>
      <Navbar />
      <StyledContentWrapper>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </StyledContentWrapper>
    </StyledRoot>
  )
}

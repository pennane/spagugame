import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { MOBILE_WIDTHS } from '../../hooks/useIsMobile'

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
  @media (max-width: ${MOBILE_WIDTHS.small}px) {
    margin: 0 1rem;
  }
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
      <Footer />
    </StyledRoot>
  )
}

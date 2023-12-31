import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { MOBILE_WIDTHS } from '../../hooks/useIsMobile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCharacterSequence } from '../../hooks/useCharacterSequence'
import { useSubscribeAchievementUnlocks } from '../../hooks/useSubscribeAchievementUnlocks'
import { useDebugMutation } from '../../hooks/useCharacterSequence/graphql/Debug.generated'

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

const SECRET_SEQUENCE = [
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
]

export const Root = () => {
  const [debug] = useDebugMutation()
  useCharacterSequence(SECRET_SEQUENCE, (sequence) => {
    debug({ variables: { sequence } })
  })
  useSubscribeAchievementUnlocks()
  return (
    <StyledRoot>
      <Navbar />
      <StyledContentWrapper>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </StyledContentWrapper>
      <Footer />
      <ToastContainer
        {...{
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: 'dark'
        }}
      />
    </StyledRoot>
  )
}

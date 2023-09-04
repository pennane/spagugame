import { useRouteError } from 'react-router-dom'
import styled from 'styled-components'
import { Heading } from '../../components/Heading'

import { P } from '../../components/P'
import { theme } from '../../theme'

type RouteError = {
  statusText?: string
  message?: string
}

const isRouteError = (e: unknown): e is RouteError => {
  if (typeof e !== 'object' || e === null) return false
  if ('statusText' in e && typeof e.statusText === 'string') return true
  if ('message' in e && typeof e.message === 'string') return true
  return false
}

const StyledErrorPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 8vw;
`

export const ErrorPage = () => {
  const error = useRouteError()

  const errorMessage = isRouteError(error)
    ? error.statusText || error.message || ''
    : ''

  console.error(error)

  return (
    <StyledErrorPage>
      <Heading.H1>Oops!</Heading.H1>
      <P.DefaultText>Sorry, an unexpected error has occurred.</P.DefaultText>
      <P.SmallText style={{ color: theme.colors.foreground.danger }}>
        <i>{errorMessage}</i>
      </P.SmallText>
    </StyledErrorPage>
  )
}

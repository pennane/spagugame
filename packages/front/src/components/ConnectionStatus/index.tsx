import { useSyncExternalStore } from 'react'
import styled from 'styled-components'
import {
  getShowReconnecting,
  subscribeToConnectionState
} from '../../graphql'

const StyledConnectionStatus = styled.span<{ $visible: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.foreground.warning};
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`

const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
`

export const ConnectionStatus = () => {
  const visible = useSyncExternalStore(
    subscribeToConnectionState,
    getShowReconnecting,
    getShowReconnecting
  )

  return (
    <StyledConnectionStatus
      $visible={visible}
      role="status"
      aria-hidden={!visible}
      title="Reconnecting to the server"
    >
      <Dot />
      Reconnecting…
    </StyledConnectionStatus>
  )
}

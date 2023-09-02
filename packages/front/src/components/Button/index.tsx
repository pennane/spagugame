import { FC, MouseEventHandler, ReactNode } from 'react'
import styled from 'styled-components'

type ButtonProps = {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
}

const StyledButton = styled.button``

export const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>
}

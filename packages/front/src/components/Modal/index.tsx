import { FC } from 'react'
import styled from 'styled-components'
import { Button } from '../Button'
import { Heading } from '../Heading'

type ModalProps = {
  children: React.ReactNode
  title: string
  show: boolean
  onCancel: () => void
  onConfirm: () => void
}

const StyledModalContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
`

const StyledModal = styled.div`
  display: grid;
  grid-auto-rows: 1fr 6fr 1fr;
  height: 20rem;
  background: #032115;
  color: black;
  max-width: 25rem;
  max-height: 70vh;
  border-radius: 0.4rem;
  margin: 2rem;
  animation: modal-appear 1.3s cubic-bezier(0.04, 0.5, 0.37, 0.99);
`

const StyledModalHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem;
`

const StyledCloseButton = styled(Button)`
  margin-left: auto;
  cursor: pointer;
  width: 48px;
  height: 48px;
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  &:hover {
    box-shadow: none;
  }
`

const StyledModalBody = styled.main`
  padding: 1rem;
`

const StyledModalFooter = styled.footer`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`

export const Modal: FC<ModalProps> = ({
  children,
  onCancel,
  onConfirm,
  title,
  show
}) => {
  if (!show) return null

  return (
    <StyledModalContainer>
      <StyledModal>
        <StyledModalHeader>
          <Heading.H2>{title}</Heading.H2>
          <StyledCloseButton onClick={onCancel}>
            <span aria-hidden="true">×</span>
          </StyledCloseButton>
        </StyledModalHeader>
        <StyledModalBody>{children}</StyledModalBody>
        <StyledModalFooter>
          <Button onClick={onCancel}>Cancel</Button>
          <Button color="danger" onClick={onConfirm}>
            Accept
          </Button>
        </StyledModalFooter>
      </StyledModal>
    </StyledModalContainer>
  )
}

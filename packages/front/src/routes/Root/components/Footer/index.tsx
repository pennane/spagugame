import { FC, useContext } from 'react'
import styled from 'styled-components'
import { CustomLink } from '../../../../components/CustomLink'
import { SoundContext } from '../../../../hooks/usePlaySound/context'
import { P } from '../../../../components/P'

const StyledFooter = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4rem;
  gap: 1.5rem;
`

const SoundToggleWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`

export const Footer: FC = () => {
  const [wantSound, setWantSound] = useContext(SoundContext)

  return (
    <StyledFooter>
      <CustomLink to="https://github.com/pennane/spagugame" target="_blank">
        Github
      </CustomLink>
      <SoundToggleWrapper>
        <P.SmallText>Sounds on:</P.SmallText>
        <input
          type="checkbox"
          checked={wantSound}
          onChange={() => {
            setWantSound(!wantSound)
          }}
        ></input>
      </SoundToggleWrapper>
    </StyledFooter>
  )
}

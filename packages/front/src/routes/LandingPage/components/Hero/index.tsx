import styled from 'styled-components'
import { Heading } from '../../../../components/Heading'
import { P } from '../../../../components/P'
import { MOBILE_WIDTHS } from '../../../../hooks/useIsMobile'
import { useLayoutEffect, useRef } from 'react'

const StyledHeroHeading = styled(Heading.H1)`
  font-size: 16vw;
  letter-spacing: -2.5vw;
  @media (min-width: ${MOBILE_WIDTHS.default}px) {
    font-size: 8rem;
    letter-spacing: -1.25rem;
  }
`

const StyledHeroSubHeading = styled(P.DefaultText)`
  font-size: 4vw;
  font-weight: 300;
  letter-spacing: -0.3vw;
  background: linear-gradient(to right, #d6e8d3, #b0d2ac);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  @media (min-width: ${MOBILE_WIDTHS.default}px) {
    font-size: 2rem;
    letter-spacing: -0.15rem;
  }
`

const StyledHero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5vw;
  margin-top: 4vw;
  @media (min-width: ${MOBILE_WIDTHS.default}px) {
    gap: 2.5rem;
    margin-top: 1rem;
  }
`

const FPS = 24
const SPEED = 0.05
const RESOLUTION = 48

let lastTimestamp = 0

let ctx: CanvasRenderingContext2D

const col = (x: number, y: number, r: number, g: number, b: number) => {
  if (!ctx) return
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
  ctx.fillRect(x, y, 1, 1)
}
const R = (x: number, y: number, t: number) => {
  return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t))
}

const G = (x: number, y: number, t: number) => {
  return Math.floor(
    192 +
      64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
  )
}

const B = (x: number, y: number, t: number) => {
  return Math.floor(
    192 +
      64 *
        Math.sin(
          5 * Math.sin(t / 9) +
            ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
        )
  )
}

let t = 0

const run = (timeStamp: number) => {
  requestAnimationFrame(run)
  if (timeStamp - lastTimestamp < 1000 / FPS) return
  for (let x = 0; x <= RESOLUTION; x++) {
    for (let y = 0; y <= RESOLUTION; y++) {
      col(x, y, R(x, y, t), G(x, y, t), B(x, y, t))
    }
  }
  t = t + SPEED
  lastTimestamp = timeStamp
}

run(0)

const StyledCanvas = styled.canvas`
  pointer-events: none;
  width: 100%;
  height: clamp(20rem, 60vw, 35rem);
  z-index: -2;
  inset: 0;
  position: absolute;
  mix-blend-mode: overlay;
  /* filter: contrast(5); */
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 100%);
  mask-image: linear-gradient(to top, transparent 0%, black 100%);
`

export const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext('2d')!
    }
  }, [canvasRef])

  return (
    <StyledHero>
      <StyledHeroHeading>Spagugame</StyledHeroHeading>
      <StyledHeroSubHeading>da future of social gaming</StyledHeroSubHeading>
      <StyledCanvas
        height={RESOLUTION}
        width={RESOLUTION}
        ref={canvasRef}
        id="hero-canvas"
      ></StyledCanvas>
    </StyledHero>
  )
}

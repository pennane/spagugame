import { useWindowDimensions } from '../useWindowDimensions'

export const MOBILE_WIDTHS = {
  small: 500,
  default: 800
}

export const useIsMobile = () => {
  const { width } = useWindowDimensions()

  return width <= MOBILE_WIDTHS.default
}

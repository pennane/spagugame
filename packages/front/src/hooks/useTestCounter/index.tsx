import { useTestCounterSubscription } from './graphql/TestCounter.generated'

export const useTestCounter = () => {
  const a = useTestCounterSubscription({})
  console.info(a.data)
}

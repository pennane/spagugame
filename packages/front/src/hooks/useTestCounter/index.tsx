import { useTestCounterSubscription } from './graphql/TestCounter.generated'

export const useTestCounter = () => {
  const a = useTestCounterSubscription({})
  console.log(a.data)
}

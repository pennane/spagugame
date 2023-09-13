import { FC, ReactNode, createContext } from 'react'

import { useCurrentUserQuery } from './graphql/CurrentUser.generated'
import { ProfilePageUserFragment } from '../../routes/ProfilePage/graphql/ProfilePage.generated'

export const CurrentUserContext = createContext<ProfilePageUserFragment | null>(
  null
)

type CurrentUserContextProviderProps = { children?: ReactNode }

export const CurrentUserContextProvider: FC<
  CurrentUserContextProviderProps
> = ({ children }) => {
  const { data } = useCurrentUserQuery()

  const currentUser = data?.currentUser || null

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  )
}

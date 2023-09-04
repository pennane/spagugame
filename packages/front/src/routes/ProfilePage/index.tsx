import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Heading } from '../../components/Heading'
import { useCurrentUserQuery } from '../../hooks/useCurrentUser/graphql/CurrentUser.generated'

export const ProfilePage: FC = () => {
  const { data, loading } = useCurrentUserQuery()
  const { userId } = useParams()

  return <Heading.H1>bro</Heading.H1>
}

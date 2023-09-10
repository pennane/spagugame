import { FC, useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from '../../../../hooks/useDebounce'
import { useFindUsersQuery } from './graphql/UserSearch.generated'
import { P } from '../../../../components/P'
import { UserSearchUser } from './components/UserSearchUser'

const StyledUserSearch = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledUserSearchInput = styled.input`
  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
  border-radius: 0.5rem;
  height: 3rem;
  color: ${({ theme }) => theme.colors.foreground.primary};
  padding: 0 1rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.foreground.primary};
  }
`

export const UserSearch: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const deboundedSearchTerm = useDebounce(searchTerm, 800)
  const { data, loading } = useFindUsersQuery({
    variables: { nameIncludes: deboundedSearchTerm },
    skip: deboundedSearchTerm.length < 3,
    fetchPolicy: 'cache-first'
  })

  return (
    <StyledUserSearch>
      <StyledUserSearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        placeholder="Search for users"
      />
      {loading && <P.DefaultText>Loading...</P.DefaultText>}
      {!loading &&
        data?.users &&
        data.users.length > 0 &&
        data?.users.map((user) => (
          <UserSearchUser key={user._id} user={user} />
        ))}
      {!loading &&
        (!data?.users ||
          (data.users.length === 0 && (
            <P.DefaultText>No users found</P.DefaultText>
          )))}
    </StyledUserSearch>
  )
}

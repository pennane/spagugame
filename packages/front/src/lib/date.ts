export const parseDate = (date: unknown) => {
  if (date instanceof Date) return date
  if (typeof date === 'string') return new Date(date)
  if (typeof date === 'number') return new Date(date)
  return new Date(0)
}

export const dateToFinnishLocale = (date: Date) => {
  return date.toLocaleDateString('fi-Fi', {
    minute: '2-digit',
    hour: '2-digit',
    timeZone: 'Europe/Helsinki'
  })
}

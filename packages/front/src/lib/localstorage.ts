export const LOCAL_STORAGE_BASE_KEY = `spagugame-storage`
export const createLocalStorageKey = (key: string) =>
  `${LOCAL_STORAGE_BASE_KEY}-${key}`

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serialized = localStorage.getItem(createLocalStorageKey(key))
    if (!serialized) return defaultValue
    const value = JSON.parse(serialized)
    return value as T
  } catch {
    return defaultValue
  }
}

export const setToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(createLocalStorageKey(key), JSON.stringify(value))
}

import { create } from "zustand"

interface User {
  username: string
  bio: string
  avatarUrl: string
}

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

function isSameUser(a: User | null, b: User | null): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  return (
    a.username === b.username && a.bio === b.bio && a.avatarUrl === b.avatarUrl
  )
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => {
    if (isSameUser(get().user, user)) return
    set({ user })
  },
}))

export { useUserStore }

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserPublic } from '@/services/api'
import { apiLogin, apiMe } from '@/services/api'

const PREFIX = (import.meta.env.VITE_APP_STORAGE_PREFIX as string) || 'smp_'
const TOKEN_KEY = `${PREFIX}token`

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<UserPublic | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string | null) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  async function login(username: string, password: string) {
    const t = await apiLogin(username, password)
    setToken(t.access_token)
    await fetchMe()
  }

  async function fetchMe() {
    if (!token.value) {
      user.value = null
      return
    }
    try {
      user.value = await apiMe()
    } catch {
      // token might be invalid
      setToken(null)
      user.value = null
    }
  }

  function logout() {
    setToken(null)
    user.value = null
  }

  async function loginAsAdmin() {
    // Default admin as per product requirements: admin/admin
    await login('admin', 'admin')
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    login,
    logout,
    fetchMe,
    loginAsAdmin,
  }
})

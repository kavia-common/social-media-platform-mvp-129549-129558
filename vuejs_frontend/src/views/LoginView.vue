<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    const redirect = (route.query.redirect as string) || { name: 'feed' }
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}

async function loginAdmin() {
  error.value = null
  loading.value = true
  try {
    await auth.loginAsAdmin()
    const redirect = (route.query.redirect as string) || { name: 'feed' }
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Admin login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h2>Welcome back</h2>
      <p class="muted">Sign in to continue</p>

      <form @submit.prevent="onSubmit" class="form">
        <label>
          <span>Username</span>
          <input class="input" v-model="username" placeholder="yourname" required />
        </label>
        <label>
          <span>Password</span>
          <input class="input" v-model="password" type="password" placeholder="••••••••" required />
        </label>

        <button class="btn btn-primary" :disabled="loading" type="submit">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
        <button class="btn btn-outline" :disabled="loading" type="button" @click="loginAdmin">
          Login as Admin
        </button>
      </form>

      <p class="muted small">
        No account?
        <router-link :to="{ name: 'register' }">Create one</router-link>
      </p>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 64px);
}
.auth-card {
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 12px;
}
.form {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}
label span {
  display: block;
  font-size: 12px;
  color: #8e8e8e;
  margin-bottom: 6px;
}
.small { font-size: 12px; }
.error { color: #ed4956; margin-top: 8px; }
</style>
